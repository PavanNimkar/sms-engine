from django.db import models


class TaxRecord(models.Model):
    """
    Gram Panchayat Aurvad - Tax Demand Register (नमुना नंबर १ मागणी रजिस्टर)
    Each record represents one property holder's tax entry.
    """

    # Serial number (अनु. नंबर)
    serial_number = models.CharField(max_length=20, verbose_name="अनु. नंबर")

    # Property number (मिळकत नंबर)
    property_number = models.CharField(max_length=50, verbose_name="मिळकत नंबर")

    # ✅ FIX: IntegerField does NOT support max_length.
    # Phone numbers need leading zeros, so CharField is correct here.
    holder_phone_number = models.CharField(
        max_length=15,
        default="0",
        blank=True,
        verbose_name="फोन नंबर",
    )

    # Property holder name (मिळकत धारकाचे नाव)
    holder_name = models.TextField(verbose_name="मिळकत धारकाचे नाव")

    # Page number (पान नंबर)
    page_number = models.PositiveIntegerField(default=1, verbose_name="पान नंबर")

    # ─── DEMAND (मागणी) ───────────────────────────────────────────
    demand_gharpatii_previous = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी घरपट्टी मागील"
    )
    demand_gharpatii_current = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी घरपट्टी चालू"
    )
    demand_gharpatii_total = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी घरपट्टी एकूण"
    )

    demand_arogya_previous = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी आरोग्य मागील"
    )
    demand_arogya_current = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी आरोग्य चालू"
    )
    demand_arogya_total = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी आरोग्य एकूण"
    )

    demand_divabatti_previous = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी दिवाबत्ती मागील"
    )
    demand_divabatti_current = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी दिवाबत्ती चालू"
    )
    demand_divabatti_total = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी दिवाबत्ती एकूण"
    )

    demand_paani_previous = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी पाणीपट्टी मागील"
    )
    demand_paani_current = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी पाणीपट्टी चालू"
    )
    demand_paani_total = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी पाणीपट्टी एकूण"
    )

    demand_dand_previous = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी 5% दंड/सूट मागील"
    )
    demand_dand_current = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी 5% दंड/सूट चालू"
    )
    demand_dand_total = models.CharField(
        max_length=50, blank=True, default="", verbose_name="मागणी 5% दंड/सूट एकूण"
    )

    demand_total_previous = models.CharField(
        max_length=50, blank=True, default="", verbose_name="एकूण मागणी मागील"
    )
    demand_total_current = models.CharField(
        max_length=50, blank=True, default="", verbose_name="एकूण मागणी चालू"
    )
    demand_total_ekun = models.CharField(
        max_length=50, blank=True, default="", verbose_name="एकूण मागणी एकूण"
    )

    # ─── COLLECTION (वसूली) ───────────────────────────────────────
    receipt_before_dec31 = models.CharField(
        max_length=100,
        blank=True,
        default="",
        verbose_name="३१ डिसें पूर्वी पावती क्रमांक",
    )
    receipt_after_dec31 = models.CharField(
        max_length=100, blank=True, default="", verbose_name="पावती दिनांक"
    )

    vasuli_gharpatii = models.CharField(
        max_length=50, blank=True, default="", verbose_name="वसूली घरपट्टी"
    )
    vasuli_arogya = models.CharField(
        max_length=50, blank=True, default="", verbose_name="वसूली आरोग्य"
    )
    vasuli_divabatti = models.CharField(
        max_length=50, blank=True, default="", verbose_name="वसूली दिवाबत्ती"
    )
    vasuli_paani = models.CharField(
        max_length=50, blank=True, default="", verbose_name="वसूली पाणीपट्टी"
    )
    vasuli_dand = models.CharField(
        max_length=50, blank=True, default="", verbose_name="वसूली 5% दंड/सूट"
    )
    vasuli_total = models.CharField(
        max_length=50, blank=True, default="", verbose_name="एकूण वसूली"
    )

    yene_baki = models.CharField(
        max_length=50, blank=True, default="", verbose_name="येणे बाकी"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["page_number", "id"]
        verbose_name = "Tax Record"
        verbose_name_plural = "Tax Records"

    def __str__(self):
        return (
            f"{self.serial_number} - {self.property_number} - {self.holder_name[:40]}"
        )
