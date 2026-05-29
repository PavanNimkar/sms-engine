from rest_framework import serializers
from .models import TaxRecord


class TaxRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxRecord
        fields = "__all__"


# ── Holder serializer — exposes only the 3 editable holder fields ──────────
class HolderSerializer(serializers.ModelSerializer):
    """
    Used by HolderListCreateView and HolderDetailView.
    Exposes: id, serial_number, holder_name, holder_phone_number (read-only: created_at).
    All other TaxRecord fields keep their existing values on PATCH/PUT.
    """

    class Meta:
        model = TaxRecord
        fields = [
            "id",
            "serial_number",
            "holder_name",
            "holder_phone_number",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_holder_phone_number(self, value):
        if value in ("", "0", None):
            return value or "0"
        digits = value.replace("+", "").replace("-", "").replace(" ", "")
        if not digits.isdigit():
            raise serializers.ValidationError("फोन नंबर फक्त अंकांमध्ये असावा.")
        if len(digits) < 10 or len(digits) > 13:
            raise serializers.ValidationError("फोन नंबर १० ते १३ अंकांचा असावा.")
        return value

    def validate_serial_number(self, value):
        if not value or not str(value).strip():
            raise serializers.ValidationError("अनु. नंबर आवश्यक आहे.")
        return value

    def validate_holder_name(self, value):
        if not value or not str(value).strip():
            raise serializers.ValidationError("मिळकत धारकाचे नाव आवश्यक आहे.")
        return value

    # When creating via this serializer, fill required TaxRecord fields with safe defaults
    def create(self, validated_data):
        validated_data.setdefault("property_number", "-")
        validated_data.setdefault("page_number", 1)
        return super().create(validated_data)
