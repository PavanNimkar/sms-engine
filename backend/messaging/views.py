from django.utils import timezone
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from records.models import TaxRecord  # read-only — no writes
from .models import SmsTemplate, SmsLog
from .serializers import (
    SmsTemplateSerializer,
    SmsLogSerializer,
    PreviewRequestSerializer,
    SendSmsSerializer,
)
from .gateway import send_sms

# ═══════════════════════════════════════════════════════════════════════
# SECTION 1 — SMS Templates  (CRUD)
# ═══════════════════════════════════════════════════════════════════════


class TemplateListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/messaging/templates/   → सर्व templates
    POST /api/messaging/templates/   → नवीन template तयार करा
    """

    queryset = SmsTemplate.objects.all()
    serializer_class = SmsTemplateSerializer
    permission_classes = [IsAuthenticated]


class TemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/messaging/templates/<id>/
    PATCH  /api/messaging/templates/<id>/
    DELETE /api/messaging/templates/<id>/
    """

    queryset = SmsTemplate.objects.all()
    serializer_class = SmsTemplateSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)


# ═══════════════════════════════════════════════════════════════════════
# SECTION 2 — SMS Registration list  (read — joined from TaxRecord)
# ═══════════════════════════════════════════════════════════════════════


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def sms_registration_list(request):
    """
    GET /api/messaging/registrations/

    Joins TaxRecord rows where holder_phone_number is set (not '0' / '').
    Returns: id, serial_number, holder_name, yene_baki,
             holder_phone_number, sms_sent, sent_at

    sms_sent / sent_at are derived from the latest SmsLog for that record.

    Query params:
      ?search=      → नाव / अनु. नंबर / फोन
      ?sms_sent=    → true | false
    """
    qs = TaxRecord.objects.exclude(holder_phone_number__in=["0", "", None]).order_by(
        "page_number", "id"
    )

    search = request.query_params.get("search", "").strip()
    if search:
        from django.db.models import Q

        qs = qs.filter(
            Q(holder_name__icontains=search)
            | Q(serial_number__icontains=search)
            | Q(holder_phone_number__icontains=search)
        )

    # Build a set of tax_record_ids that have a successful SmsLog
    sent_ids = set(
        SmsLog.objects.filter(status=SmsLog.STATUS_SENT).values_list(
            "tax_record_id", flat=True
        )
    )

    # Filter by sms_sent if requested
    sms_filter = request.query_params.get("sms_sent", "").lower()
    if sms_filter == "true":
        qs = qs.filter(id__in=sent_ids)
    elif sms_filter == "false":
        qs = qs.exclude(id__in=sent_ids)

    # Fetch latest sent_at per tax_record_id
    from django.db.models import Max

    sent_at_map = dict(
        SmsLog.objects.filter(status=SmsLog.STATUS_SENT)
        .values("tax_record_id")
        .annotate(latest=Max("sent_at"))
        .values_list("tax_record_id", "latest")
    )

    rows = []
    for r in qs:
        rows.append(
            {
                "id": r.id,
                "serial_number": r.serial_number,
                "holder_name": r.holder_name,
                "yene_baki": r.yene_baki,
                "holder_phone_number": r.holder_phone_number,
                "sms_sent": r.id in sent_ids,
                "sent_at": sent_at_map.get(r.id),
            }
        )

    return Response(rows)


# ═══════════════════════════════════════════════════════════════════════
# SECTION 3 — Preview
# ═══════════════════════════════════════════════════════════════════════


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def preview_sms(request):
    """
    POST /api/messaging/preview/
    Body: { "sms_id": "THAKBAKI_01", "tax_record_id": 5 }

    Returns the rendered SMS message WITHOUT sending it.
    Use this to show the preview in the modal before the user confirms.
    """
    ser = PreviewRequestSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

    # Fetch template
    try:
        template = SmsTemplate.objects.get(sms_id=ser.validated_data["sms_id"])
    except SmsTemplate.DoesNotExist:
        return Response({"error": "Template सापडला नाही."}, status=404)

    # Fetch TaxRecord
    try:
        record = TaxRecord.objects.get(pk=ser.validated_data["tax_record_id"])
    except TaxRecord.DoesNotExist:
        return Response({"error": "TaxRecord सापडला नाही."}, status=404)

    context = _build_context(record)
    message = template.render(context)

    return Response(
        {
            "sms_id": template.sms_id,
            "tax_record_id": record.id,
            "holder_name": record.holder_name,
            "phone_number": record.holder_phone_number,
            "rendered_message": message,
        }
    )


# ═══════════════════════════════════════════════════════════════════════
# SECTION 4 — Send
# ═══════════════════════════════════════════════════════════════════════


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_sms_view(request):
    """
    POST /api/messaging/send/
    Body: {
      "sms_id": "THAKBAKI_01",
      "tax_record_ids": [1, 2, 3]
    }

    For each tax_record_id:
      1. Renders the template with that record's data.
      2. Calls gateway.send_sms().
      3. Saves SmsLog entry (sent / failed).
    Returns a summary list.
    """
    ser = SendSmsSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

    sms_id = ser.validated_data["sms_id"]
    tax_record_ids = ser.validated_data["tax_record_ids"]

    # Fetch template
    try:
        template = SmsTemplate.objects.get(sms_id=sms_id)
    except SmsTemplate.DoesNotExist:
        return Response({"error": f'Template "{sms_id}" सापडला नाही.'}, status=404)

    # Fetch all requested records in one query
    records = {r.id: r for r in TaxRecord.objects.filter(id__in=tax_record_ids)}

    results = []
    logs_to_create = []
    now = timezone.now()

    for rid in tax_record_ids:
        record = records.get(rid)

        # ── Record not found ──────────────────────────────────────────
        if not record:
            results.append(
                {
                    "tax_record_id": rid,
                    "status": "failed",
                    "error": "Record सापडला नाही.",
                }
            )
            continue

        # ── No phone ──────────────────────────────────────────────────
        phone = record.holder_phone_number
        if not phone or phone in ("0", ""):
            results.append(
                {
                    "tax_record_id": rid,
                    "holder_name": record.holder_name,
                    "status": "skipped",
                    "error": "फोन नंबर नाही.",
                }
            )
            continue

        # ── Render message ────────────────────────────────────────────
        context = _build_context(record)
        message = template.render(context)

        # ── Call gateway ──────────────────────────────────────────────
        gw = send_sms(phone, message)
        log_status = SmsLog.STATUS_SENT if gw["success"] else SmsLog.STATUS_FAILED

        logs_to_create.append(
            SmsLog(
                template=template,
                rendered_message=message,
                phone_number=phone,
                tax_record_id=record.id,
                serial_number=record.serial_number,
                holder_name=record.holder_name,
                status=log_status,
                gateway_response=gw["response"],
                sent_at=now if gw["success"] else None,
            )
        )

        results.append(
            {
                "tax_record_id": rid,
                "holder_name": record.holder_name,
                "phone_number": phone,
                "status": log_status,
                "message": message,
            }
        )

    # Bulk-create logs
    if logs_to_create:
        SmsLog.objects.bulk_create(logs_to_create)

    sent_count = sum(1 for r in results if r["status"] == SmsLog.STATUS_SENT)
    failed_count = sum(1 for r in results if r["status"] == SmsLog.STATUS_FAILED)

    return Response(
        {
            "summary": {
                "total": len(tax_record_ids),
                "sent": sent_count,
                "failed": failed_count,
                "skipped": len(results) - sent_count - failed_count,
            },
            "results": results,
        },
        status=status.HTTP_200_OK,
    )


# ═══════════════════════════════════════════════════════════════════════
# SECTION 5 — SMS Log (read only)
# ═══════════════════════════════════════════════════════════════════════


class SmsLogListView(generics.ListAPIView):
    """
    GET /api/messaging/logs/
    Query: ?tax_record_id=  ?status=sent|failed|pending
    """

    serializer_class = SmsLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = SmsLog.objects.select_related("template").all()
        tid = self.request.query_params.get("tax_record_id")
        if tid:
            qs = qs.filter(tax_record_id=tid)
        st = self.request.query_params.get("status")
        if st:
            qs = qs.filter(status=st)
        return qs


# ═══════════════════════════════════════════════════════════════════════
# Helper
# ═══════════════════════════════════════════════════════════════════════


def _build_context(record: TaxRecord) -> dict:
    """
    Maps every TaxRecord field to a key the template variable can reference.
    Add more keys here if you add more variables to templates.
    """
    return {
        "holder_name": record.holder_name,
        "serial_number": record.serial_number,
        "property_number": record.property_number,
        "yene_baki": record.yene_baki or "0",
        "phone_number": record.holder_phone_number,
        # tax components
        "vasuli_total": record.vasuli_total or "0",
        "demand_total_ekun": record.demand_total_ekun or "0",
    }
