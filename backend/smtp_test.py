import smtplib
from email.mime.text import MIMEText

# Your credentials
sender = "it.support@seacolehealthsystems.co.uk"
app_password = "MySTERious1550#"  # Use the app password, NOT your normal email password

# The recipient of the test email
recipient = "nigeltino98@gmail.com"  # Or any other address you want to test with

# Email content
subject = "Test Email from Python"
body = "This is a test message sent using plain Python via PrivateEmail SMTP."

# Build the email
msg = MIMEText(body)
msg['Subject'] = subject
msg['From'] = sender
msg['To'] = recipient

try:
    # Connect to PrivateEmail SMTP server using SSL
    with smtplib.SMTP_SSL("mail.privateemail.com", 465) as server:
        server.login(sender, app_password)
        server.sendmail(sender, [recipient], msg.as_string())
        print("✅ Email sent successfully.")

except smtplib.SMTPAuthenticationError as e:
    print(f"❌ Authentication failed: {e}")
except Exception as e:
    print(f"❌ Something went wrong: {e}")
