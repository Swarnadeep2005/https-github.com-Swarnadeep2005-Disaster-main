import warnings
warnings.filterwarnings('ignore')

import pandas as pd
from app.predictor import id_to_disaster, model

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
    pred = int(model.predict(d)[0])
    
    print(f"Payload {i}: Prediction={id_to_disaster.get(pred)}")
