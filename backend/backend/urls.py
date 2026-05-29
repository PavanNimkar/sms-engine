from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("records.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/sms/", include("sms.urls")),
    path("api/messages/", include("messaging.urls")),
]
