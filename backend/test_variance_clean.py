import warnings
warnings.filterwarnings('ignore')

import joblib
import pandas as pd
from app.predictor import id_to_disaster, model
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
        
        pred_unscaled = int(model.predict(df)[0])
        
        print(f"Test {i}: Prediction={id_to_disaster.get(pred_unscaled)}")

if __name__ == '__main__':
    test_various()
