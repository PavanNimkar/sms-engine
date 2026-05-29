from rest_framework import serializers
from .models import SmsTemplate, SmsLog

# ── Template ──────────────────────────────────────────────────────────────


class SmsTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SmsTemplate
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")


# ── Log (read-only) ───────────────────────────────────────────────────────


class SmsLogSerializer(serializers.ModelSerializer):
    template_sms_id = serializers.CharField(
        source="template.sms_id", read_only=True, default=None
    )

    class Meta:
        model = SmsLog
        fields = [
            "id",
            "template_sms_id",
            "rendered_message",
            "phone_number",
            "tax_record_id",
            "serial_number",
            "holder_name",
            "status",
            "gateway_response",
            "sent_at",
            "created_at",
        ]
        read_only_fields = fields


# ── Preview request (not a model) ────────────────────────────────────────


class PreviewRequestSerializer(serializers.Serializer):
    """Used by the preview endpoint to validate input."""

    sms_id = serializers.CharField()
    tax_record_id = serializers.IntegerField()


# ── Send request ──────────────────────────────────────────────────────────


class SendSmsSerializer(serializers.Serializer):
    """
    POST /api/messaging/send/
    Send SMS to one or more TaxRecord holders using a template.
    """

    sms_id = serializers.CharField()
    tax_record_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1,
    )
