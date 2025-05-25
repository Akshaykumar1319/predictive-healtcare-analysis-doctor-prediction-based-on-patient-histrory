from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)

# Load Dataset
df = pd.read_csv("doctor_consultation_data.csv")

# Define Input and Output Features
X = df.drop(columns=["doctor consultation"])
y = df["doctor consultation"]

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Model (Random Forest)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save Model
joblib.dump(model, "doctor_consultation_model.pkl")

@app.route("/")
def landing():
    return render_template("landing_page.html")

@app.route("/prediction")
def prediction_page():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get Data from Form
        data = request.json
        features = np.array([
            data["age"], data["blood_pressure"], data["cholesterol"], data["heart_rate"],
            data["smoking"], data["alcohol"], data["exercise"], data["bmi"], data["diabetes"]
        ]).reshape(1, -1)

        # Load Model & Predict
        model = joblib.load("doctor_consultation_model.pkl")
        prediction = model.predict_proba(features)[0]
        
        # Define risk levels and recommendations
        if prediction[1] < 0.3:
            risk_level = "Low Risk"
            doctor_recommendation = "Regular check-up with General Physician recommended within 6 months"
        elif prediction[1] < 0.7:
            risk_level = "Moderate Risk"
            doctor_recommendation = "Consultation with Internal Medicine Specialist recommended within 1 month"
        else:
            risk_level = "High Risk"
            doctor_recommendation = "Immediate consultation with Cardiologist and Endocrinologist required"

        return jsonify({
            "risk_level": risk_level,
            "doctor_recommendation": doctor_recommendation,
            "probability": float(prediction[1])
        })

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/get_doctors", methods=["GET"])
def get_doctors():
    risk_level = request.args.get("risk_level")
    # In a real application, this would fetch from a database
    doctors = {
        "Low Risk": [
            {
                "id": "gp1",
                "name": "Sarah Johnson",
                "specialty": "General Physician",
                "experience": 8,
                "rating": 4.5,
                "reviewCount": 127,
                "location": "Medical Center, Downtown",
                "isAvailable": True,
                "nextSlot": "Today, 4:00 PM",
                "image": "https://example.com/doctor1.jpg"
            }
        ],
        "Moderate Risk": [
            {
                "id": "sp1",
                "name": "Michael Chen",
                "specialty": "Internal Medicine Specialist",
                "experience": 12,
                "rating": 4.8,
                "reviewCount": 243,
                "location": "Central Hospital",
                "isAvailable": True,
                "nextSlot": "Tomorrow, 10:00 AM",
                "image": "https://example.com/doctor2.jpg"
            }
        ],
        "High Risk": [
            {
                "id": "cd1",
                "name": "Emily Rodriguez",
                "specialty": "Cardiologist",
                "experience": 15,
                "rating": 4.9,
                "reviewCount": 318,
                "location": "Heart Care Center",
                "isAvailable": False,
                "nextSlot": "Tomorrow, 2:00 PM",
                "image": "https://example.com/doctor3.jpg"
            }
        ]
    }
    return jsonify(doctors.get(risk_level, []))

if __name__ == "__main__":
    app.run(debug=True)