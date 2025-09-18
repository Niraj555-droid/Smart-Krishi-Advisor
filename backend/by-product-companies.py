from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(
    title="Crop Byproduct Recommendations API",
    description="Recommends companies for crop by-products based on crop and district",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Allow all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File paths from .env
BYPRODUCTS_FILE = os.getenv("BYPRODUCTS_FILE", "indian_crops_byproducts_with_domains.csv")
COMPANIES_FILE = os.getenv("COMPANIES_FILE", "corrected_companies_with_district.csv")

# Load datasets globally
try:
    byproducts_df = pd.read_csv(BYPRODUCTS_FILE)
    companies_df = pd.read_csv(COMPANIES_FILE)
except Exception as e:
    raise RuntimeError(f"❌ Error loading datasets: {e}")

# Request schema
class RecommendationRequest(BaseModel):
    crop_name: str
    district: str

# Root endpoint
@app.get("/")
def home():
    return {"message": "✅ FastAPI Backend is running!"}

# Recommendations endpoint
@app.post("/recommendations")
def get_recommendations(request: RecommendationRequest):
    crop_name = request.crop_name.strip().lower()
    district = request.district.strip().lower()

    crop_data = byproducts_df[byproducts_df['Crop'].str.lower() == crop_name]
    if crop_data.empty:
        return {"error": f"No data available for crop: {crop_name}"}

    useful_domains = [d.strip() for d in crop_data.iloc[0]['Useful Domains'].split(',')]

    filtered_companies = companies_df[
        (companies_df['District'].str.lower() == district) &
        (companies_df['CompanyIndustrialClassification'].isin(useful_domains))
    ]

    top_companies = filtered_companies.head(10)

    recommendations = []
    for _, row in top_companies.iterrows():
        recommendations.append({
            "company_name": row.get("CompanyName", "N/A"),
            "address": row.get("Registered_Office_Address", "N/A"),
            "status": row.get("CompanyStatus", "Unknown"),
            "domain": row.get("CompanyIndustrialClassification", "N/A"),
            "distance": row.get("Distance", 80),
            "rating": row.get("StarRating", 4.5)
        })

    if not recommendations:
        return {"message": f"No companies found in district {district} for crop {crop_name} by-products"}

    return {"recommendations": recommendations}
