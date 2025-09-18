import os
import re
import json
import time
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_advisory(input_data: dict):
    """
    Generates bilingual pesticide advisory (JSON + HTML) using Gemini.
    Adds default alternatives for 'Framer' crops.
    """
    prompt = f"""
    You are an agricultural advisor.

    Inputs:
    - Pesticide: {input_data.get("pesticide","")}
    - Crop: {input_data.get("crop","")}
    - Disease: {input_data.get("disease","")}

    Your Task:
    Generate a bilingual pesticide advisory report in **two sections**:
    1. Full report in English.
    2. Full report in Marathi.

    Output Format: strict JSON only (no markdown).
    {{
      "english": {{
        "pesticide": "...",
        "trade_names": ["..."],
        "manufacturer": "...",
        "recommended_dosage": "...",
        "target_crops": ["..."],
        "controls_diseases": ["..."],
        "suitability": "High/Medium/Low",
        "lab_tested": true,
        "alternatives": ["..."],
        "summary": "..."
      }},
      "marathi": {{
        "pesticide": "...",
        "trade_names": ["..."],
        "manufacturer": "...",
        "recommended_dosage": "...",
        "target_crops": ["..."],
        "controls_diseases": ["..."],
        "suitability": "उच्च/मध्यम/कमी",
        "lab_tested": true,
        "alternatives": ["..."],
        "summary": "..."
      }}
    }}
    """

    model = genai.GenerativeModel("gemini-1.5-flash")

    # Retry logic for stability
    for attempt in range(3):
        try:
            response = model.generate_content(prompt)
            break
        except Exception as e:
            if attempt == 2:
                raise
            time.sleep(2)

    # Clean Gemini output
    raw_output = response.text.strip()
    raw_output = re.sub(r"```(?:json)?", "", raw_output).strip()

    try:
        data = json.loads(raw_output)
    except Exception:
        match = re.search(r"{.*}", raw_output, re.S)
        if match:
            data = json.loads(match.group())
        else:
            raise ValueError("Gemini returned invalid JSON: " + raw_output[:500])

    eng = data.get("english", {})
    mar = data.get("marathi", {})

    # Add alternative pesticide for "Framer" crop dynamically
    targets = [t.lower() for t in eng.get("target_crops", [])]
    if any("framer" in t for t in targets):
        eng["alternatives"] = list(set(eng.get("alternatives", []) + [
            "Neem-based pesticide", "Bio-friendly pesticide X"
        ]))
        mar["alternatives"] = list(set(mar.get("alternatives", []) + [
            "नीम आधारित कीटकनाशक", "जैव-मैत्रीपूर्ण कीटकनाशक X"
        ]))

    # Build bilingual HTML report
    html = f"""
    <h2>📑 Pesticide Advisory Report</h2>

    <h3>🇬🇧 English</h3>
    <p><b>🧴 Pesticide:</b> {eng.get("pesticide","")}</p>
    <p><b>🏷️ Trade Names:</b> {", ".join(eng.get("trade_names",[]))}</p>
    <p><b>🏭 Manufacturer:</b> {eng.get("manufacturer","")}</p>
    <p><b>💧 Dosage:</b> {eng.get("recommended_dosage","")}</p>
    <p><b>🌱 Target Crops:</b> {", ".join(eng.get("target_crops",[]))}</p>
    <p><b>🦠 Controls Diseases:</b> {", ".join(eng.get("controls_diseases",[]))}</p>
    <p><b>⭐ Suitability:</b> {eng.get("suitability","")}</p>
    <p><b>📝 Summary:</b> {eng.get("summary","")}</p>
    <p><b>🔄 Alternative Pesticides:</b> {", ".join(eng.get("alternatives", []))}</p>

    <hr/>

    <h3>🇮🇳 मराठी</h3>
    <p><b>🧴 कीटकनाशक:</b> {mar.get("pesticide","")}</p>
    <p><b>🏷️ व्यापारी नावे:</b> {", ".join(mar.get("trade_names",[]))}</p>
    <p><b>🏭 उत्पादक:</b> {mar.get("manufacturer","")}</p>
    <p><b>💧 डोस:</b> {mar.get("recommended_dosage","")}</p>
    <p><b>🌱 पिके:</b> {", ".join(mar.get("target_crops",[]))}</p>
    <p><b>🦠 रोग नियंत्रण:</b> {", ".join(mar.get("controls_diseases",[]))}</p>
    <p><b>⭐ उपयुक्तता:</b> {mar.get("suitability","")}</p>
    <p><b>📝 सारांश:</b> {mar.get("summary","")}</p>
    <p><b>🔄 पर्यायी कीटकनाशके:</b> {", ".join(mar.get("alternatives", []))}</p>
    """

    return {
        "input": input_data,
        "ai_response": data,
        "html": html
    }
