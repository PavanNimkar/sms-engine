from django.urls import path
from . import views

urlpatterns = [
    # ── Templates CRUD ────────────────────────────────────────────────
    path(
        "templates/", views.TemplateListCreateView.as_view(), name="msg-template-list"
    ),
    path(
        "templates/<int:pk>/",
        views.TemplateDetailView.as_view(),
        name="msg-template-detail",
    ),
    # ── SMS Registration list (joined, phone != 0) ────────────────────
    path("registrations/", views.sms_registration_list, name="msg-registrations"),
    # ── Preview (render without sending) ─────────────────────────────
    path("preview/", views.preview_sms, name="msg-preview"),
    # ── Send ──────────────────────────────────────────────────────────
    path("send/", views.send_sms_view, name="msg-send"),
    # ── Logs (read-only) ──────────────────────────────────────────────
    path("logs/", views.SmsLogListView.as_view(), name="msg-logs"),
]
