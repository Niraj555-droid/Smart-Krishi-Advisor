import requests
import datetime
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("VISUAL_CROSSING_API_KEY")

def rain_alert_for_pesticide(location: str, rain_threshold: float = 1.0):
    """
    Checks 14-day forecast for rain that would prevent pesticide spraying.
    Returns: (risk: bool, message: str)
    """
    today = datetime.date.today()
    end_date = today + datetime.timedelta(days=14)
    url = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{location}/{today}/{end_date}?key={API_KEY}&unitGroup=metric&include=days&elements=datetime,precip"

    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        data = res.json()
    except Exception as e:
        return False, f"❌ Weather API error: {e}"

    days = data.get("days", [])
    rainy_days = [(datetime.date.fromisoformat(d["datetime"]), d.get("precip", 0))
                  for d in days if d.get("precip", 0) >= rain_threshold]

    if rainy_days:
        days_list = ", ".join([f"{d[0].strftime('%b %d')} ({d[1]:.1f} mm)" for d in rainy_days])
        message = f"🌧 Rain expected on {len(rainy_days)} day(s): {days_list}.\n❌ Do NOT spray pesticides."
        return True, message
    return False, "✅ No significant rain expected → Safe to spray pesticides in next 14 days."
