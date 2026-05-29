from django.contrib import admin
from .models import SmsRegistration


@admin.register(SmsRegistration)
class SmsRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "serial_number",
        "holder_name",
        "yene_baki",
        "holder_phone_number",
        "sms_sent",
        "sent_at",
    )
    list_filter = ("sms_sent",)
    search_fields = (
        "tax_record__holder_name",
        "tax_record__serial_number",
        "holder_phone_number",
    )
    ordering = ("tax_record__page_number", "tax_record__id")

    def serial_number(self, obj):
        return obj.tax_record.serial_number

    serial_number.short_description = "अनु. नंबर"

    def holder_name(self, obj):
        return obj.tax_record.holder_name

    holder_name.short_description = "नाव"

    def yene_baki(self, obj):
        return obj.tax_record.yene_baki

    yene_baki.short_description = "येणे बाकी"
