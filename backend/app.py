import os
import pandas as pd
import pickle
import datetime
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import markdown  # pip install markdown
from dotenv import load_dotenv   # for environment variables

# Load environment variables
load_dotenv()

# AI Agent imports
from ai_agent.pesticide import rain_alert_for_pesticide
from ai_agent.irrigation import check_irrigation
from ai_agent.utils import send_sms

# Soil model (optional for irrigation predictions)
try:
    from realmodel import run_model
except ImportError:
    run_model = None  # Safe fallback if realmodel.py not present

# AI Report (Gemini) import
from Report import generate_advisory as ai_generate_advisory  

# Gemini imports
from google import genai

# ---------------------------
# Initialize Flask
# ---------------------------
app = Flask(__name__)
CORS(app)

# ---------------------------
# Initialize Gemini Client
# ---------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("❌ Missing GEMINI_API_KEY. Please add it to your .env file.")

gemini_client = genai.Client(api_key=GEMINI_API_KEY)

# ---------------------------
# Load CSV Datasets
# ---------------------------
df = pd.read_csv(r"D:\Smart Krishi Advisor\backend\All in One DataSetSwayam01cleaned.csv")
df["Address"] = df["Address"].astype(str).str.lower()
df["Region"] = df["Region"].astype(str).str.lower()
df["Crop"] = df["Crop"].astype(str)

# Byproducts & companies data
byproducts_df = pd.read_csv('indian_crops_byproducts_with_domains.csv')
companies_df = pd.read_csv('corrected_companies_with_district.csv')

# ---------------------------
# Load Soil Prediction Model
# ---------------------------
with open("soil_model.pkl", "rb") as f:
    saved = pickle.load(f)
model = saved["model"]
encoders = saved["encoders"]

y_columns = [
    "Nitrogen - High","Nitrogen - Medium","Nitrogen - Low",
    "Phosphorous - High","Phosphorous - Medium","Phosphorous - Low",
    "Potassium - High","Potassium - Medium","Potassium - Low",
    "pH - Acidic","pH - Neutral","pH - Alkaline"
]

# ---------------------------
# Location Info Endpoint
# ---------------------------
@app.route("/location-info", methods=["POST"])
def location_info():
    data_input = request.get_json()
    location_input = data_input.get("location", "").strip().lower()

    if not location_input:
        return jsonify({"error": "No location provided"}), 400

    address_rows = df[df["Address"] == location_input]
    if address_rows.empty:
        return jsonify({
            "Address": location_input,
            "Region": "Unknown",
            "Crops": "No data",
            "Attributes": {k: 0 for k in y_columns}
        })

    address_enc = encoders["Address"].transform([location_input])[0]
    region_val = encoders["Region"].transform([address_rows["Region"].iloc[0].lower()])[0]

    predicted = model.predict([[address_enc, region_val]])[0]
    crops = ", ".join(address_rows["Crop"].unique())

    result = {
        "Address": location_input,
        "Region": encoders["Region"].inverse_transform([region_val])[0],
        "Crops": crops if crops else "No data",
        "Attributes": {y_columns[i]: round(predicted[i], 2) for i in range(len(y_columns))}
    }
    return jsonify(result)

# ---------------------------
# Unified Alerts Endpoint
# ---------------------------
@app.route("/api/alerts", methods=["POST"])
def get_alerts():
    data = request.json
    location = data.get("location")
    send_sms_flag = data.get("sms", False)
    phone_number = data.get("phone_number", None)

    if not location:
        return jsonify({"error": "Location not provided"}), 400

    notifications = []

    # Pesticide Alert
    try:
        pesticide_risk, pesticide_message = rain_alert_for_pesticide(location)
        notifications.append({
            "id": "1",
            "type": "pesticide",
            "priority": "high" if pesticide_risk else "low",
            "title": "Pesticide Rain Alert",
            "message": pesticide_message,
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "actionRequired": pesticide_risk,
            "isRead": False
        })
        if send_sms_flag and phone_number:
            send_sms(phone_number, pesticide_message)
    except Exception as e:
        notifications.append({
            "id": "1",
            "type": "pesticide",
            "priority": "low",
            "title": "Pesticide Rain Alert",
            "message": f"❌ Error checking pesticide alert: {e}",
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "actionRequired": False,
            "isRead": False
        })

    # Irrigation Alert
    try:
        irrigation_needed, irrigation_message = check_irrigation(location)
        notifications.append({
            "id": "2",
            "type": "irrigation",
            "priority": "high" if irrigation_needed else "low",
            "title": "Irrigation Alert",
            "message": irrigation_message,
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "actionRequired": irrigation_needed,
            "isRead": False
        })
        if send_sms_flag and phone_number:
            send_sms(phone_number, irrigation_message)
    except Exception as e:
        notifications.append({
            "id": "2",
            "type": "irrigation",
            "priority": "low",
            "title": "Irrigation Alert",
            "message": f"❌ Error checking irrigation: {e}",
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "actionRequired": False,
            "isRead": False
        })

    return jsonify(notifications)

# ---------------------------
# AI Advisory Report Endpoint
# ---------------------------
@app.route("/api/generate-advisory", methods=["POST"])
def generate_advisory():
    data = request.json
    pesticide = data.get("pesticide") or data.get("pesticideName")
    crop = data.get("crop") or data.get("cropType")
    disease = data.get("disease") or data.get("diseaseName")

    try:
        result = ai_generate_advisory({
            "pesticide": pesticide,
            "crop": crop,
            "disease": disease
        })
        return jsonify({"report": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------
# Gemini Farmer Chatbot Endpoint
# ---------------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    if not data:
        return jsonify({"error": "No data received"}), 400

    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"error": "Message is empty"}), 400

    # Force reply in Marathi with bullet points
    prompt = (
        f"Answer the following in **Marathi** using bullet points. "
        f"Each point should be a complete sentence and clear for a farmer:\n\n{user_message}"
    )

    max_retries = 3
    retry_delay = 20

    for attempt in range(max_retries):
        try:
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            reply_raw = response.text

            # Optional: Convert to proper bullet points
            lines = [line.strip() for line in reply_raw.split("\n") if line.strip()]
            formatted_lines = []
            for line in lines:
                if not line.startswith("-"):
                    formatted_lines.append(f"- {line}")
                else:
                    formatted_lines.append(line)

            reply_formatted = "\n".join(formatted_lines)

            return jsonify({"reply": reply_formatted})
        except Exception as e:
            error_message = str(e)
            if "RESOURCE_EXHAUSTED" in error_message and attempt < max_retries - 1:
                time.sleep(retry_delay)
            else:
                return jsonify({"error": error_message}), 500

# ---------------------------
# Byproduct Companies Recommendations Endpoint
# ---------------------------
@app.route("/recommendations", methods=["POST"])
def get_recommendations():
    data = request.json
    crop_name = data.get("crop_name", "").strip().lower()
    district = data.get("district", "").strip().lower()

    if not crop_name or not district:
        return jsonify({"error": "Crop name or district not provided"}), 400

    crop_data = byproducts_df[byproducts_df['Crop'].str.lower() == crop_name]
    if crop_data.empty:
        return jsonify({"error": f"No data available for crop: {crop_name}"}), 404

    useful_domains = [d.strip() for d in crop_data.iloc[0]['Useful Domains'].split(',')]

    filtered_companies = companies_df[
        (companies_df['District'].str.lower() == district) &
        (companies_df['CompanyIndustrialClassification'].isin(useful_domains))
    ]

    top_companies = filtered_companies.head(10)

    recommendations = []
    for _, row in top_companies.iterrows():
        recommendations.append({
            "company_name": row['CompanyName'],
            "address": row['Registered_Office_Address'],
            "status": row['CompanyStatus'] if 'CompanyStatus' in row else "Unknown",
            "domain": row['CompanyIndustrialClassification'],
            "distance": row['Distance'] if 'Distance' in row else 80,
            "rating": row['StarRating'] if 'StarRating' in row else 4.5
        })

    if not recommendations:
        return jsonify({"message": f"No companies found in district {district} for crop {crop_name} by-products"}), 404

    return jsonify({"recommendations": recommendations})

# ---------------------------
# Test Endpoint
# ---------------------------
@app.route("/api/test", methods=["GET"])
def test():
    return "✅ Backend is running with Soil, Alerts, AI Advisory, Chatbot & Byproduct APIs!"

# ---------------------------
# Run App
# ---------------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
