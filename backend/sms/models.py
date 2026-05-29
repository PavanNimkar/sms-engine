from django.db import models
from records.models import TaxRecord


class SmsRegistration(models.Model):
    """
    SMS नोंदणी — TaxRecord शी OneToOne जोडणी.
    holder_phone_number येथे साठवला जातो (TaxRecord मधून कॉपी).
    sms_sent : SMS पाठवला की नाही (True / False).
    """

    tax_record = models.OneToOneField(
        TaxRecord,
        on_delete=models.CASCADE,
        related_name="sms_registration",
        verbose_name="मिळकत नोंद",
    )

    # फोन नंबर (TaxRecord.holder_phone_number मधून घेतलेला)
    holder_phone_number = models.CharField(
        max_length=15,
        default="0",
        verbose_name="फोन नंबर",
    )

    # SMS पाठवला का?
    sms_sent = models.BooleanField(
        default=False,
        verbose_name="SMS पाठवला",
    )

    sent_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="SMS वेळ",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["tax_record__page_number", "tax_record__id"]
        verbose_name = "SMS नोंदणी"
        verbose_name_plural = "SMS नोंदणी"

    def __str__(self):
        status = "✓ पाठवला" if self.sms_sent else "✗ नाही"
        return f"{self.tax_record.serial_number} — {self.tax_record.holder_name[:30]} [{status}]"
