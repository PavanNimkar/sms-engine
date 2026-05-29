from django.db import models


class Order(models.Model):
    """
    ऑर्डर नोंद - नाव, फोन नंबर, एकूण रक्कम आणि पत्ता
    """

    # नाव (Name)
    name = models.CharField(max_length=200, verbose_name="नाव")

    # फोन नंबर (Phone Number)
    phone_number = models.CharField(max_length=15, verbose_name="फोन नंबर")

    # एकूण रक्कम (Total Amount)
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="एकूण रक्कम"
    )

    # पत्ता (Address)
    address = models.TextField(verbose_name="पत्ता")

    # तयार केल्याची वेळ (Created At)
    created_at = models.DateTimeField(auto_now_add=True)

    # अद्यतनित केल्याची वेळ (Updated At)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "ऑर्डर"
        verbose_name_plural = "ऑर्डर्स"

    def __str__(self):
        return f"{self.name} - ₹{self.total_amount}"
