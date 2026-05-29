from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_phone_number(self, value):
        """Phone number must be digits only, 10 chars for Indian numbers."""
        digits = value.replace('+', '').replace('-', '').replace(' ', '')
        if not digits.isdigit():
            raise serializers.ValidationError("फोन नंबर फक्त अंकांमध्ये असावा.")
        if len(digits) < 10 or len(digits) > 13:
            raise serializers.ValidationError("फोन नंबर १० ते १३ अंकांचा असावा.")
        return value

    def validate_total_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("एकूण रक्कम शून्यापेक्षा जास्त असावी.")
        return value
