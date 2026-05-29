from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path("auth/login/", views.login_view, name="login"),
    path("auth/logout/", views.logout_view, name="logout"),
    path("auth/me/", views.me_view, name="me"),
    # Full TaxRecord (read-only list + detail — unchanged)
    path("records/", views.TaxRecordListView.as_view(), name="records-list"),
    path(
        "records/<int:pk>/", views.TaxRecordDetailView.as_view(), name="records-detail"
    ),
    # Holder CRUD (NEW) — serial_number, holder_name, holder_phone_number
    path("holders/", views.HolderListCreateView.as_view(), name="holder-list-create"),
    path("holders/<int:pk>/", views.HolderDetailView.as_view(), name="holder-detail"),
]
