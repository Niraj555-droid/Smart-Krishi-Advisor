import json
import re
import google.generativeai as genai

# -----------------------------
# 1. Configure Gemini
# -----------------------------
genai.configure(api_key="AIzaSyA4dS9K-m2bw4CFDqysJvQs1NmMQGllBo0")  # 🔑 Replace with your key

def generate_advisory(input_data: dict):
    """
    Generates bilingual pesticide advisory (JSON + HTML) from Gemini.
    """

    # -----------------------------
    # 2. Build the prompt dynamically
    # -----------------------------
    prompt = f"""
    You are an agricultural advisor.

    Inputs:
    - Pesticide: {input_data.get("pesticide","")}
    - Crop: {input_data.get("crop","")}
    - Disease: {input_data.get("disease","")}

    Your Task:
    Generate a bilingual pesticide advisory report in **two sections**:
    1. Full report in English (all fields).
    2. Full report in Marathi (all fields translated, farmer-friendly).

    Output Rules:
    - Return only valid JSON.
    - Do not use markdown or code fences.
    - Use the following format exactly:

    {{
      "english": {{
        "pesticide": "...",
        "trade_names": ["...", "..."],
        "manufacturer": "...",
        "registration_no": "...",
        "formulation": "...",
        "recommended_dosage": "...",
        "target_crops": ["...", "..."],
        "controls_diseases": ["...", "..."],
        "suitability": "High/Medium/Low",
        "lab_tested": true/false,
        "alternatives": ["...", "..."],
        "economic_info": {{
          "average_price_per_kg": "...",
          "estimated_cost_per_acre": "..."
        }},
        "toxicity_class": "...",
        "environmental_risk": {{
          "bees": "...",
          "aquatic_life": "...",
          "soil_health": "..."
        }},
        "resistance_management": "...",
        "safety": "...",
        "usage_calendar": "...",
        "summary": "..."
      }},
      "marathi": {{
        "pesticide": "...",
        "trade_names": ["...", "..."],
        "manufacturer": "...",
        "registration_no": "...",
        "formulation": "...",
        "recommended_dosage": "...",
        "target_crops": ["...", "..."],
        "controls_diseases": ["...", "..."],
        "suitability": "उच्च/मध्यम/कमी",
        "lab_tested": true/false,
        "alternatives": ["...", "..."],
        "economic_info": {{
          "average_price_per_kg": "...",
          "estimated_cost_per_acre": "..."
        }},
        "toxicity_class": "...",
        "environmental_risk": {{
          "bees": "...",
          "aquatic_life": "...",
          "soil_health": "..."
        }},
        "resistance_management": "...",
        "safety": "...",
        "usage_calendar": "...",
        "summary": "..."
      }}
    }}
    """

    # -----------------------------
    # 3. Call Gemini
    # -----------------------------
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    raw_output = response.text
    raw_output = re.sub(r"```json|```", "", raw_output).strip()

    # -----------------------------
    # 4. Clean + Parse JSON
    # -----------------------------
    try:
        data = json.loads(raw_output)
    except json.JSONDecodeError:
        raise ValueError("Gemini returned invalid JSON: " + raw_output)

    # -----------------------------
    # 5. Build HTML for frontend
    # -----------------------------
    eng = data.get("english", {})
    mar = data.get("marathi", {})

    html = f"""
    <h2>📑 Pesticide Advisory Report</h2>

    <h3>🇬🇧 English</h3>
    <p><b>🧴 Pesticide:</b> {eng.get("pesticide","")}</p>
    <p><b>🏷️ Trade Names:</b> {", ".join(eng.get("trade_names",[]))}</p>
    <p><b>🏭 Manufacturer:</b> {eng.get("manufacturer","")}</p>
    <p><b>📜 Registration No.:</b> {eng.get("registration_no","")}</p>
    <p><b>💧 Dosage:</b> {eng.get("recommended_dosage","")}</p>
    <p><b>🌱 Target Crops:</b> {", ".join(eng.get("target_crops",[]))}</p>
    <p><b>🦠 Controls Diseases:</b> {", ".join(eng.get("controls_diseases",[]))}</p>
    <p><b>⭐ Suitability:</b> {eng.get("suitability","")}</p>
    <p><b>📝 Summary:</b> {eng.get("summary","")}</p>

    <hr/>

    <h3>🇮🇳 मराठी</h3>
    <p><b>🧴 कीटकनाशक:</b> {mar.get("pesticide","")}</p>
    <p><b>🏷️ व्यापारी नावे:</b> {", ".join(mar.get("trade_names",[]))}</p>
    <p><b>🏭 उत्पादक:</b> {mar.get("manufacturer","")}</p>
    <p><b>📜 नोंदणी क्र.:</b> {mar.get("registration_no","")}</p>
    <p><b>💧 डोस:</b> {mar.get("recommended_dosage","")}</p>
    <p><b>🌱 पिके:</b> {", ".join(mar.get("target_crops",[]))}</p>
    <p><b>📝 सारांश:</b> {mar.get("summary","")}</p>
    """

    return {
        "input": input_data,
        "ai_response": data,
        "html": html
    }
