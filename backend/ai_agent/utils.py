from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_NUMBER = os.getenv("TWILIO_NUMBER")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_sms(to_number: str, message: str):
    """
    Sends SMS using Twilio.
    """
    try:
        msg = client.messages.create(body=message, from_=TWILIO_NUMBER, to=to_number)
        print(f"✅ SMS sent! SID: {msg.sid}")
        return True
    except Exception as e:
        print(f"❌ Failed to send SMS: {e}")
        return False
