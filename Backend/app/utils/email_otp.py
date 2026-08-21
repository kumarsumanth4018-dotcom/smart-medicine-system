import hashlib
import hmac
import secrets
from email.message import EmailMessage

import aiosmtplib

from app.core.config import settings


def generate_otp() -> str:
    """Generate a secure six-digit OTP."""
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp(otp: str) -> str:
    """Hash the OTP before saving it in MongoDB."""
    return hmac.new(
        settings.SECRET_KEY.encode("utf-8"),
        otp.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def verify_otp_hash(otp: str, saved_hash: str) -> bool:
    """Compare an entered OTP with the saved OTP hash."""
    entered_hash = hash_otp(otp)

    return hmac.compare_digest(
        entered_hash,
        saved_hash,
    )


async def send_registration_otp(
    recipient_email: str,
    recipient_name: str,
    otp: str,
) -> None:
    """Send the registration OTP through Gmail."""

    message = EmailMessage()

    message["From"] = settings.SMTP_FROM_EMAIL
    message["To"] = recipient_email
    message["Subject"] = "Verify your Smart Medicine account"

    message.set_content(
        f"""
Hello {recipient_name},

Your Smart Medicine System verification code is:

{otp}

This OTP expires in {settings.OTP_EXPIRE_MINUTES} minutes.

If you did not create this account, ignore this email.

Regards,
Smart Medicine System
        """.strip()
    )

    await aiosmtplib.send(
        message,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        username=settings.SMTP_USERNAME,
        password=settings.SMTP_PASSWORD,
        start_tls=True,
    )