from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone_number', 'total_amount', 'address', 'created_at')
    search_fields = ('name', 'phone_number', 'address')
    list_filter = ('created_at',)
    ordering = ('-created_at',)
