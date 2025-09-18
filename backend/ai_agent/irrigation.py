import requests
import datetime
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("VISUAL_CROSSING_API_KEY")

def check_irrigation(location: str):
    """
    Checks the last 10 days of precipitation to decide if irrigation is needed.
    Returns: (irrigation_needed: bool, message: str)
    """
    url = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{location}?key={API_KEY}&include=days&unitGroup=metric&elements=datetime,precip"

    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        data = res.json()
    except Exception as e:
        return False, f"❌ Weather API error: {e}"

    days = data.get("days", [])
    last_10_days = days[-10:] if len(days) >= 10 else days

    irrigation_needed = all(d.get("precip", 0) < 1 for d in last_10_days)
    message = (f"💧 Irrigation Alert: No rain in last 10 days at {location}. Consider irrigating crops."
               if irrigation_needed else
               f"✅ Irrigation not required. Recent rain sufficient at {location}.")
    return irrigation_needed, message
