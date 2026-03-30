import joblib
import pandas as pd
import json

model = joblib.load("model/random_forest_model.joblib")

# Load mapping
with open("model/disaster_mapping.json") as f:
    disaster_map = json.load(f)

# Reverse mapping
id_to_disaster = {int(v): k for k, v in disaster_map.items()}


def predict_disaster(data):

    df = pd.DataFrame([{
        "Year": data["Year"],
        "Dis Mag Scale": data["Dis_Mag_Scale"],
        "Dis Mag Value": data["Dis_Mag_Value"],
        "Country": data["Country"],
        "Longitude": data["Longitude"],
        "Latitude": data["Latitude"]
    }])

    # Pass raw features directly to model; Random forests do not need scaled inputs limit
    prediction = int(model.predict(df)[0])

    disaster_name = id_to_disaster.get(prediction, "Unknown")

    return {
        "id": prediction,
        "name": disaster_name
    }