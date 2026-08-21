"""
Email sending — DEV MODE.

No SMTP provider is configured for this project yet, so "sending" an
email just logs the OTP prominently to the backend console instead of
actually delivering it. This is a common, legitimate pattern during
development. To send real emails later, replace send_otp_email()'s body
with an SMTP call (e.g. via smtplib + a Gmail app password, or a
transactional email API like SendGrid/Resend) — the call sites
elsewhere in the app don't need to change.
"""
from app.utils.logger import logger
from app.utils.constants import OTP_EXPIRY_MINUTES


def send_otp_email(email: str, otp: str, purpose: str = "verification") -> None:
    """
    DEV MODE: logs the OTP instead of emailing it.
    Look for this in your backend terminal after registering / requesting
    a password reset.
    """
    logger.info(
        "\n"
        + "=" * 50 + "\n"
        f"  OTP EMAIL (dev mode — not actually sent)\n"
        f"  To:      {email}\n"
        f"  Purpose: {purpose}\n"
        f"  OTP:     {otp}\n"
        f"  Valid for {OTP_EXPIRY_MINUTES} minutes\n"
        + "=" * 50
    )