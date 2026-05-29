from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Order
from .serializers import OrderSerializer


class OrderListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/orders/        → सर्व ऑर्डर्सची यादी
    POST /api/orders/        → नवीन ऑर्डर तयार करा
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Order.objects.all()
        # Optional search by name or phone
        search = self.request.query_params.get('search', None)
        if search:
            queryset = (
                queryset.filter(name__icontains=search) |
                queryset.filter(phone_number__icontains=search)
            )
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                "message": "ऑर्डर यशस्वीरित्या जतन केली.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/orders/<id>/  → एकच ऑर्डर पाहा
    PUT    /api/orders/<id>/  → ऑर्डर अद्यतनित करा
    PATCH  /api/orders/<id>/  → आंशिक अद्यतन
    DELETE /api/orders/<id>/  → ऑर्डर हटवा
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
