import smtplib
from email.mime.text import MIMEText
from .config import Settings
import os

settings = Settings()  # pyright: ignore

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

def send_otp_email(to_email, otp):
    smtp_host = settings.EMAIL_HOST
    smtp_port = settings.EMAIL_PORT
    smtp_user = settings.EMAIL_USER
    smtp_pass = settings.EMAIL_PASSWORD

    # Build absolute path to the template
    template_path = os.path.join(
        BASE_DIR, "backend", "app", "core", "templates", "email_otp.html"
    )

    with open(template_path, "r", encoding="utf-8") as file:
        html_template = file.read()

    # Style: first 2 digits blue, last 2 digits orange
    otp_html = (
        f'<span style="color:#2a4d9b;">{otp[:2]}</span>'
        f'<span style="color:#ff8032;">{otp[2:]}</span>'
    )

    html_body = html_template.format(otp=otp_html)

    msg = MIMEText(html_body, "html")
    msg["Subject"] = "Your Tugma OTP"
    msg["From"] = smtp_user
    msg["To"] = to_email

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, [to_email], msg.as_string())