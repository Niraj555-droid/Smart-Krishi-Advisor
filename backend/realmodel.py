import os
import datetime
import requests
from twilio.rest import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_KEY = os.getenv("VISUAL_CROSSING_API_KEY")
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_NUMBER = os.getenv("TWILIO_NUMBER")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_sms(to_number: str, message: str) -> bool:
    try:
        msg = client.messages.create(body=message, from_=TWILIO_NUMBER, to=to_number)
        print(f"✅ SMS sent! SID: {msg.sid}")
        return True
    except Exception as e:
        print(f"❌ Failed to send SMS: {e}")
        return False

def check_irrigation(location: str) -> bool:
    url = (
        f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
        f"{location}?key={API_KEY}&include=days&unitGroup=metric&elements=datetime,precip"
    )
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        data = res.json()
    except Exception as e:
        print(f"❌ Weather API error: {e}")
        return False

    days = data.get("days", [])
    last_10_days = days[-10:] if len(days) >= 10 else days
    return all(d.get("precip", 0) < 1 for d in last_10_days)

def run_model(location: str, phone_number: str = None, send_sms_flag: bool = False):
    notifications = []
    irrigation_needed = check_irrigation(location)

    if irrigation_needed:
        message = f"💧 Irrigation Alert: No rain in last 10 days at {location}. Consider irrigating crops."
    else:
        message = f"✅ Irrigation not required. Recent rain sufficient at {location}."

    if irrigation_needed and send_sms_flag and phone_number:
        send_sms(phone_number, message)

    notifications.append({
        "id": "3",
        "type": "irrigation",
        "priority": "high" if irrigation_needed else "low",
        "title": "Irrigation Alert",
        "message": message,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "actionRequired": irrigation_needed,
        "isRead": False
    })
    return notifications
