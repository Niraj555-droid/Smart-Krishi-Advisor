from pesticide import rain_alert_for_pesticide
from irrigation import check_irrigation
from utils import send_sms

# Configuration
location = "Pune"
phone_number = "+919022645877"

# Pesticide alert
pesticide_alert, pesticide_message = rain_alert_for_pesticide(location)
print(pesticide_message)
if pesticide_alert:
    send_sms(phone_number, pesticide_message)

# Irrigation alert
irrigation_needed, irrigation_message = check_irrigation(location)
print(irrigation_message)
if irrigation_needed:
    send_sms(phone_number, irrigation_message)
