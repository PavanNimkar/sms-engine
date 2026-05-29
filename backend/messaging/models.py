from django.db import models


class SmsTemplate(models.Model):
    """
    SMS Template table.
    Fields: sms_id, description1…10, variable1…10
    Each description_N is a static text chunk.
    Each variable_N is the placeholder name (e.g. 'holder_name', 'yene_baki')
    that the backend replaces with real data before sending.

    Template is assembled as:
      description1 + value_of_variable1 +
      description2 + value_of_variable2 + …

    Example:
      description1 = "प्रिय "        variable1 = "holder_name"
      description2 = ", तुमची थकबाकी " variable2 = "yene_baki"
      description3 = " रुपये आहे."    variable3 = ""  (empty = stop)
    """

    sms_id = models.CharField(max_length=50, unique=True, verbose_name="SMS ID")

    description1 = models.TextField(blank=True, default="", verbose_name="वर्णन १")
    variable1 = models.CharField(
        max_length=100, blank=True, default="", verbose_name="चल १"
    )

    description2 = models.TextField(blank=True, default="", verbose_name="वर्णन २")
    variable2 = models.CharField(
        max_length=100, blank=True, default="", verbose_name="चल २"
    )

    description3 = models.TextField(blank=True, default="", verbose_name="वर्णन ३")
    variable3 = models.CharField(
        max_length=100, blank=True, default="", verbose_name="चल ३"
    )

    description4 = models.TextField(blank=True, default="", verbose_name="वर्णन ४")
    variable4 = models.CharField(
        max_length=100, blank=True, default="", verbose_name="चल ४"
    )

    description5 = models.TextField(blank=True, default="", verbose_name="वर्णन ५")
    variable5 = models.CharField(
        max_length=100, blank=True, default="", verbose_name="चल ५"
    )

    description6 = models.TextField(blank=True, default="", verbose_name="वर्णन ६")
    variable6 = models.CharField(
        max_length=100, blank=True, default="", verbose_name="चल ६"
    )

    description7 = models.TextField(blank=True, default="", verbose_name="वर्णन ७")
    variable7 = models.CharField(
        max_length=100, blank=True, default="", verbose_name="चल ७"
    )

    description8 = models.TextField(blank=True, default="", verbose_name="वर्णन ८")
    variable8 = models.CharField(
        max_length=100, blank=True, default="", verbose_name="चल ८"
    )

    description9 = models.TextField(blank=True, default="", verbose_name="वर्णन ९")
    variable9 = models.CharField(
        max_length=100, blank=True, default="", verbose_name="चल ९"
    )

    description10 = models.TextField(blank=True, default="", verbose_name="वर्णन १०")
    variable10 = models.CharField(
        max_length=100, blank=True, default="", verbose_name="चल १०"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "SMS Template"
        verbose_name_plural = "SMS Templates"
        ordering = ["sms_id"]

    def __str__(self):
        return self.sms_id

    # ── Helper: build final message for a given data dict ────────────────
    def render(self, context: dict) -> str:
        """
        context = {'holder_name': 'राम पाटील', 'yene_baki': '1200', ...}
        Returns assembled SMS string.
        """
        parts = []
        for i in range(1, 11):
            desc = getattr(self, f"description{i}", "") or ""
            var = getattr(self, f"variable{i}", "") or ""
            if not desc and not var:
                break  # stop at first fully-empty pair
            parts.append(desc)
            if var:
                parts.append(str(context.get(var, "")))
        return "".join(parts).strip()


# ─────────────────────────────────────────────────────────────────────────────


class SmsLog(models.Model):
    """
    Every SMS send attempt is recorded here.
    Completely decoupled — stores phone + message as plain text so it
    works even if TaxRecord rows are deleted later.
    """

    STATUS_PENDING = "pending"
    STATUS_SENT = "sent"
    STATUS_FAILED = "failed"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_SENT, "Sent"),
        (STATUS_FAILED, "Failed"),
    ]

    # Which template was used (nullable — template may be deleted)
    template = models.ForeignKey(
        SmsTemplate,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="logs",
        verbose_name="Template",
    )

    # Snapshot of the rendered message (so we know exactly what was sent)
    rendered_message = models.TextField(verbose_name="पाठवलेला संदेश")

    # Recipient
    phone_number = models.CharField(max_length=15, verbose_name="फोन नंबर")

    # Reference to TaxRecord (stored as plain int so no FK constraint)
    tax_record_id = models.IntegerField(
        null=True, blank=True, verbose_name="TaxRecord ID"
    )
    serial_number = models.CharField(
        max_length=20, blank=True, default="", verbose_name="अनु. नंबर"
    )
    holder_name = models.CharField(
        max_length=300, blank=True, default="", verbose_name="धारकाचे नाव"
    )

    # Delivery
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING
    )
    gateway_response = models.TextField(
        blank=True, default="", verbose_name="Gateway Response"
    )
    sent_at = models.DateTimeField(null=True, blank=True, verbose_name="पाठवल्याची वेळ")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "SMS Log"
        verbose_name_plural = "SMS Logs"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.phone_number} | {self.status} | {self.created_at:%d-%m-%Y %H:%M}"
