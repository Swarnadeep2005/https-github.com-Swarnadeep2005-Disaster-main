import joblib
import pandas as pd
from app.predictor import id_to_disaster, model, scaler
import random

def test_various():
    for i in range(10):
        # Generate random typical disaster data
        df = pd.DataFrame([{
            "Year": random.randint(1970, 2024),
            "Dis Mag Scale": random.randint(0, 4),
            "Dis Mag Value": random.uniform(0, 50000),
            "Country": random.randint(0, 227),
            "Longitude": random.uniform(-180, 180),
            "Latitude": random.uniform(-90, 90)
        }])
        
        # Test original unscaled
        pred_unscaled = int(model.predict(df)[0])
        
        # Test scaled exactly what we had before (using simple transform)
        # Note: Latitude/Longitude are floats, scaler expected LabelEncoded integers.
        # This will scale them treating them as features anyway
        df_scaled = scaler.transform(df)
        pred_scaled = int(model.predict(df_scaled)[0])
        
        print(f"Test {i}: Unscaled={id_to_disaster.get(pred_unscaled)} | Scaled={id_to_disaster.get(pred_scaled)}")

test_various()
