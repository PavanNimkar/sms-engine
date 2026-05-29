from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from records.models import TaxRecord
from .models import SmsRegistration
from .serializers import SmsRegistrationSerializer


def _sync_sms_records():
    """
    TaxRecord मधील प्रत्येक नोंदीसाठी SmsRegistration असल्याची खात्री करतो.
    जर नसेल तर auto-create करतो.
    फक्त phone != '0' आणि phone != '' असलेल्या नोंदी.
    """
    valid_records = TaxRecord.objects.exclude(holder_phone_number__in=["0", "", None])
    for record in valid_records:
        SmsRegistration.objects.get_or_create(
            tax_record=record,
            defaults={"holder_phone_number": record.holder_phone_number},
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def sms_list_view(request):
    """
    GET /api/sms/
    TaxRecord मधून join केलेली यादी:
      serial_number | holder_name | yene_baki | holder_phone_number | sms_sent
    फक्त phone != '0' आणि phone != '' नोंदी.

    Query params:
      ?search=   → नाव / अनु. नंबर / फोन
      ?sms_sent= → true | false
    """
    # Auto-sync: नवीन TaxRecord records साठी SmsRegistration तयार करा
    _sync_sms_records()

    qs = SmsRegistration.objects.select_related("tax_record").exclude(
        holder_phone_number__in=["0", "", None]
    )

    search = request.query_params.get("search", "").strip()
    if search:
        qs = (
            qs.filter(tax_record__holder_name__icontains=search)
            | qs.filter(tax_record__serial_number__icontains=search)
            | qs.filter(holder_phone_number__icontains=search)
        )

    sms_filter = request.query_params.get("sms_sent", "").lower()
    if sms_filter == "true":
        qs = qs.filter(sms_sent=True)
    elif sms_filter == "false":
        qs = qs.filter(sms_sent=False)

    serializer = SmsRegistrationSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def sms_toggle_view(request, pk):
    """
    PATCH /api/sms/<id>/toggle/
    sms_sent toggle करतो (True ↔ False).
    True झाल्यावर sent_at वेळ सेट करतो.
    """
    try:
        obj = SmsRegistration.objects.select_related("tax_record").get(pk=pk)
    except SmsRegistration.DoesNotExist:
        return Response(
            {"error": "नोंद सापडली नाही."}, status=status.HTTP_404_NOT_FOUND
        )

    obj.sms_sent = not obj.sms_sent
    obj.sent_at = timezone.now() if obj.sms_sent else None
    obj.save(update_fields=["sms_sent", "sent_at", "updated_at"])

    return Response(
        {
            "message": "SMS पाठवला ✓" if obj.sms_sent else "SMS नाकारला.",
            "data": SmsRegistrationSerializer(obj).data,
        }
    )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def sms_bulk_toggle_view(request):
    """
    PATCH /api/sms/bulk-toggle/
    Body: { "ids": [1,2,3], "sms_sent": true }
    एकाच वेळी अनेक नोंदी update करा.
    """
    ids = request.data.get("ids", [])
    sms_sent = bool(request.data.get("sms_sent", True))

    if not ids:
        return Response(
            {"error": "ids आवश्यक आहेत."}, status=status.HTTP_400_BAD_REQUEST
        )

    now = timezone.now()
    objs = SmsRegistration.objects.filter(pk__in=ids)
    objs.update(
        sms_sent=sms_sent,
        sent_at=now if sms_sent else None,
    )

    return Response(
        {
            "message": f"{objs.count()} नोंदी अद्यतनित केल्या.",
            "sms_sent": sms_sent,
        }
    )
