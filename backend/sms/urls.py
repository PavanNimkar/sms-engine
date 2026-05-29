from django.urls import path
from . import views

urlpatterns = [
    # GET  /api/sms/                  → सर्व SMS नोंदी (joined, phone != 0)
    path("", views.sms_list_view, name="sms-list"),
    # PATCH /api/sms/<id>/toggle/     → sms_sent toggle
    path("<int:pk>/toggle/", views.sms_toggle_view, name="sms-toggle"),
    # PATCH /api/sms/bulk-toggle/     → एकाच वेळी अनेक toggle
    path("bulk-toggle/", views.sms_bulk_toggle_view, name="sms-bulk-toggle"),
]
