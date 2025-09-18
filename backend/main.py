import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor

# =========================
# Load & preprocess data
# =========================
df = pd.read_csv(r"C:\Users\Hp\Pictures\Smart Krishi Advisor\backend\All in One DataSetSwayam01cleaned.csv")

def clean_percentage(val):
    if isinstance(val, str) and "%" in val:
        return float(val.replace("%", ""))  
    try:
        return float(val)
    except:
        return None

# Clean all percentage columns
for col in df.columns:
    if df[col].dtype == object and df[col].astype(str).str.contains("%").any():
        df[col] = df[col].apply(clean_percentage)

# Fill missing values
cat_cols = ["Address", "Region", "Crop"]
num_cols = [c for c in df.columns if c not in cat_cols]

df[cat_cols] = df[cat_cols].fillna("Unknown")
df[num_cols] = df[num_cols].fillna(0)

# Encode categorical columns
encoders = {}
for col in ["Address", "Region"]:
    encoders[col] = LabelEncoder()
    df[col] = encoders[col].fit_transform(df[col].astype(str).str.lower())  # lowercase for consistency

# Features and target
X = df[["Address", "Region"]]
y = df[[
    "Nitrogen - High", "Nitrogen - Medium", "Nitrogen - Low",
    "Phosphorous - High", "Phosphorous - Medium", "Phosphorous - Low",
    "Potassium - High", "Potassium - Medium", "Potassium - Low",
    "pH - Acidic", "pH - Neutral", "pH - Alkaline"
]]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
print("✅ Soil Model trained. R² Score:", model.score(X_test, y_test))

# Save model
with open("soil_model.pkl", "wb") as f:
    pickle.dump({"model": model, "encoders": encoders}, f)
