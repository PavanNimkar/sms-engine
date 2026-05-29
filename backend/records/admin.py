from django.contrib import admin
from .models import TaxRecord


@admin.register(TaxRecord)
class TaxRecordAdmin(admin.ModelAdmin):
    list_display = ['serial_number', 'property_number', 'holder_name', 'page_number', 'yene_baki']
    list_filter = ['page_number']
    search_fields = ['holder_name', 'property_number', 'serial_number']
