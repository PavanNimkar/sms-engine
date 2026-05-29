from rest_framework import serializers
from .models import SmsRegistration


class SmsRegistrationSerializer(serializers.ModelSerializer):
    """
    Flat serializer — frontend ला एकच object मिळतो:
    {
      id, serial_number, holder_name, yene_baki,
      holder_phone_number, sms_sent, sent_at
    }
    """

    # Read-only fields pulled from related TaxRecord
    serial_number = serializers.CharField(
        source="tax_record.serial_number", read_only=True
    )
    holder_name = serializers.CharField(source="tax_record.holder_name", read_only=True)
    yene_baki = serializers.CharField(source="tax_record.yene_baki", read_only=True)
    tax_record_id = serializers.IntegerField(source="tax_record.id", read_only=True)

    class Meta:
        model = SmsRegistration
        fields = [
            "id",
            "tax_record_id",
            "serial_number",
            "holder_name",
            "yene_baki",
            "holder_phone_number",
            "sms_sent",
            "sent_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "tax_record_id",
            "serial_number",
            "holder_name",
            "yene_baki",
            "sent_at",
            "created_at",
            "updated_at",
        ]
