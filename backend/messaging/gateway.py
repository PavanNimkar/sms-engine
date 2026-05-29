"""
SMS Gateway — cell24x7
──────────────────────────────────────────────────────────────────────
Provider : cell24x7  (https://sms.cell24x7.in)
API URL  : GET https://sms.cell24x7.in/otpReceiver/sendSMS
           ?user=<USER>&pwd=<PWD>&sender=<SENDER>
           &mobile=<10-digit>&msg=<url-encoded-text>&mt=0

Settings required in settings.py:
  SMS_GATEWAY_PROVIDER = "cell24x7"
  SMS_CELL24X7_USER    = "testdemo"
  SMS_CELL24X7_PWD     = "apidemo"
  SMS_CELL24X7_SENDER  = "CMTLTD"
  SMS_CELL24X7_MT      = "0"   # 0 = plain text, 1 = unicode/Devanagari
──────────────────────────────────────────────────────────────────────
"""

import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


# ── Public entry point ────────────────────────────────────────────────────


def send_sms(phone: str, message: str) -> dict:
    """
    Returns {'success': bool, 'response': str}

    Dispatches to the provider set in settings.SMS_GATEWAY_PROVIDER.
    Defaults to stub (console only) if not configured.
    """
    provider = getattr(settings, "SMS_GATEWAY_PROVIDER", "stub")

    if provider == "cell24x7":
        return _send_cell24x7(phone, message)
    if provider == "fast2sms":
        return _send_fast2sms(phone, message)
    if provider == "msg91":
        return _send_msg91(phone, message)

    return _send_stub(phone, message)


# ── cell24x7 ─────────────────────────────────────────────────────────────


def _send_cell24x7(phone: str, message: str) -> dict:
    """
    Calls the cell24x7 HTTP GET API.

    Success: HTTP 200 + body does NOT start with "ERROR"
             (cell24x7 returns a numeric message-id on success,
              e.g. "1234567890" or "Message Submitted")
    Failure: body starts with "ERROR …" or non-200 status.
    """
    user = getattr(settings, "SMS_CELL24X7_USER", "testdemo")
    pwd = getattr(settings, "SMS_CELL24X7_PWD", "apidemo")
    sender = getattr(settings, "SMS_CELL24X7_SENDER", "CMTLTD")
    mt = getattr(settings, "SMS_CELL24X7_MT", "0")

    # Normalise to 10-digit Indian number
    clean_phone = phone.strip()
    if clean_phone.startswith("+91"):
        clean_phone = clean_phone[3:]
    elif clean_phone.startswith("91") and len(clean_phone) == 12:
        clean_phone = clean_phone[2:]

    params = {
        "user": user,
        "pwd": pwd,
        "sender": sender,
        "mobile": clean_phone,
        "msg": message,  # requests will URL-encode this automatically
        "mt": mt,
    }

    try:
        resp = requests.get(
            "https://sms.cell24x7.in/otpReceiver/sendSMS",
            params=params,
            timeout=15,
        )
        body = resp.text.strip()

        logger.info(
            "[cell24x7] phone=%s  http=%s  resp=%s",
            clean_phone,
            resp.status_code,
            body[:120],
        )

        if resp.status_code == 200 and not body.upper().startswith("ERROR"):
            return {"success": True, "response": body}

        logger.error("[cell24x7] FAILED phone=%s body=%s", clean_phone, body)
        return {"success": False, "response": body}

    except requests.exceptions.Timeout:
        err = "cell24x7 API timeout (15 s)"
        logger.error("[cell24x7] %s  phone=%s", err, clean_phone)
        return {"success": False, "response": err}

    except Exception as exc:
        logger.exception("[cell24x7] Unexpected error phone=%s", clean_phone)
        return {"success": False, "response": str(exc)}


# ── STUB (development / testing) ─────────────────────────────────────────


def _send_stub(phone: str, message: str) -> dict:
    logger.info("[SMS STUB] TO=%s  MSG=%s", phone, message[:80])
    print(f"\n📱 [SMS STUB] → {phone}\n{message}\n{'─'*60}")
    return {"success": True, "response": "stub:ok"}


# ── Fast2SMS ──────────────────────────────────────────────────────────────


def _send_fast2sms(phone: str, message: str) -> dict:
    api_key = getattr(settings, "SMS_GATEWAY_API_KEY", "")
    try:
        r = requests.post(
            "https://www.fast2sms.com/dev/bulkV2",
            headers={"authorization": api_key},
            data={
                "route": "q",
                "message": message,
                "language": "unicode",
                "flash": 0,
                "numbers": phone,
            },
            timeout=10,
        )
        data = r.json()
        return {"success": bool(data.get("return")), "response": str(data)}
    except Exception as e:
        logger.error("Fast2SMS error: %s", e)
        return {"success": False, "response": str(e)}


# ── MSG91 ─────────────────────────────────────────────────────────────────


def _send_msg91(phone: str, message: str) -> dict:
    api_key = getattr(settings, "SMS_GATEWAY_API_KEY", "")
    sender = getattr(settings, "SMS_GATEWAY_SENDER", "GRAMPN")
    try:
        r = requests.post(
            "https://api.msg91.com/api/v5/flow/",
            headers={"authkey": api_key, "Content-Type": "application/json"},
            json={
                "sender": sender,
                "route": "4",
                "country": "91",
                "sms": [{"message": message, "to": [phone]}],
            },
            timeout=10,
        )
        data = r.json()
        return {"success": data.get("type") == "success", "response": str(data)}
    except Exception as e:
        logger.error("MSG91 error: %s", e)
        return {"success": False, "response": str(e)}
