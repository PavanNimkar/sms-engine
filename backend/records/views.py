from django.contrib.auth import authenticate
from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import TaxRecord
from .serializers import TaxRecordSerializer, HolderSerializer

# ── Auth views (unchanged) ─────────────────────────────────────────────────


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if not username or not password:
        return Response({"error": "Username and password are required."}, status=400)
    user = authenticate(username=username, password=password)
    if user is None:
        return Response({"error": "Invalid credentials."}, status=401)
    token, _ = Token.objects.get_or_create(user=user)
    return Response(
        {
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            },
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({"message": "Logged out successfully."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    return Response(
        {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        }
    )


# ── TaxRecord views (unchanged) ────────────────────────────────────────────


class TaxRecordListView(generics.ListAPIView):
    serializer_class = TaxRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = TaxRecord.objects.all()
        search = self.request.query_params.get("search")
        if search:
            queryset = (
                queryset.filter(holder_name__icontains=search)
                | queryset.filter(property_number__icontains=search)
                | queryset.filter(serial_number__icontains=search)
            )
        page_num = self.request.query_params.get("page_number")
        if page_num:
            queryset = queryset.filter(page_number=page_num)
        return queryset


class TaxRecordDetailView(generics.RetrieveAPIView):
    queryset = TaxRecord.objects.all()
    serializer_class = TaxRecordSerializer
    permission_classes = [IsAuthenticated]


# ── Holder CRUD views (NEW) ────────────────────────────────────────────────


class HolderListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/holders/   → सर्व धारकांची यादी (serial_number, holder_name, holder_phone_number)
    POST /api/holders/   → नवीन धारक तयार करा
    Supports ?search=    → नाव / अनु. नंबर / फोन नंबरने शोधा
    """

    serializer_class = HolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = TaxRecord.objects.all()
        search = self.request.query_params.get("search")
        if search:
            queryset = (
                queryset.filter(holder_name__icontains=search)
                | queryset.filter(serial_number__icontains=search)
                | queryset.filter(holder_phone_number__icontains=search)
            )
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(
            {
                "message": "धारक यशस्वीरित्या जोडला.",
                "data": HolderSerializer(instance).data,
            },
            status=status.HTTP_201_CREATED,
        )


class HolderDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/holders/<id>/  → एक धारक पाहा
    PATCH  /api/holders/<id>/  → आंशिक अद्यतन (नाव / फोन / अनु. नंबर)
    PUT    /api/holders/<id>/  → पूर्ण अद्यतन
    DELETE /api/holders/<id>/  → धारक हटवा
    """

    queryset = TaxRecord.objects.all()
    serializer_class = HolderSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True  # always allow partial update
        response = super().update(request, *args, **kwargs)
        response.data = {
            "message": "धारक यशस्वीरित्या अद्यतनित केला.",
            "data": response.data,
        }
        return response

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        name = instance.holder_name
        instance.delete()
        return Response(
            {"message": f'"{name}" हा धारक हटवला.'},
            status=status.HTTP_200_OK,
        )
