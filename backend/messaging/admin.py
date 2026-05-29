from django.contrib import admin
from .models import SmsTemplate, SmsLog


@admin.register(SmsTemplate)
class SmsTemplateAdmin(admin.ModelAdmin):
    list_display = ("sms_id", "description1", "variable1", "created_at")
    search_fields = ("sms_id",)
    ordering = ("sms_id",)


@admin.register(SmsLog)
class SmsLogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "holder_name",
        "phone_number",
        "status",
        "sent_at",
        "serial_number",
    )
    list_filter = ("status",)
    search_fields = ("holder_name", "phone_number", "serial_number")
    readonly_fields = ("rendered_message", "gateway_response")
    ordering = ("-created_at",)
