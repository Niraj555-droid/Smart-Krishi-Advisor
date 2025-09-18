import os
import requests
import datetime
from twilio.rest import Client
from dotenv import load_dotenv

# Load env variables
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

def rain_alert_for_pesticide(location: str, rain_threshold: float = 1.0):
    today = datetime.date.today()
    end_date = today + datetime.timedelta(days=14)
    url = (
        f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
        f"{location}/{today}/{end_date}?key={API_KEY}&unitGroup=metric&include=days&elements=datetime,precip"
    )
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        data = res.json()
    except Exception as e:
        return False, f"❌ Weather API error: {e}"

    days = data.get("days", [])
    if not days:
        return False, "⚠️ No weather data found."

    rainy_days = [
        (datetime.date.fromisoformat(d["datetime"]), d.get("precip", 0))
        for d in days if d.get("precip", 0) >= rain_threshold
    ]
    if rainy_days:
        days_list = ", ".join([f"{d[0].strftime('%b %d')} ({d[1]:.1f} mm)" for d in rainy_days])
        message = f"🌧 Rain expected on {len(rainy_days)} day(s): {days_list}.\n❌ Do NOT spray pesticides."
        return True, message

    return False, "✅ No significant rain expected → Safe to spray pesticides in next 14 days."
