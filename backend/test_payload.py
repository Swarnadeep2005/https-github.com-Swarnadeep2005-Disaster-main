import warnings
warnings.filterwarnings('ignore')

import pandas as pd
from app.predictor import id_to_disaster, model, scaler

# Typical payload from frontend map picking Indonesia
df = pd.DataFrame([{
    "Year": 2024,
    "Dis Mag Scale": 0, # Km2
    "Dis Mag Value": 100,
    "Country": 90, # Indonesia
    "Longitude": 110.1,
    "Latitude": -7.2
}])

# also what happens if we pick Richter
df2 = pd.DataFrame([{
    "Year": 2024,
    "Dis Mag Scale": 2, # Richter
    "Dis Mag Value": 7.5,
    "Country": 90, # Indonesia
    "Longitude": 110.1,
    "Latitude": -7.2
}])

for i, d in enumerate([df, df2]):
    pred_unscaled = int(model.predict(d)[0])
    df_scaled = scaler.transform(d)
    pred_scaled = int(model.predict(df_scaled)[0])
    
    print(f"Payload {i}: Unscaled={id_to_disaster.get(pred_unscaled)} | Scaled={id_to_disaster.get(pred_scaled)}")
