import pandas as pd
import numpy as np
import joblib
from app.predictor import predict_disaster

def test_14_scenarios():
    print("Loading models and data for scenario extraction...")
    df = pd.read_csv('../datasets/new_unseen_dataset.csv', low_memory=False)
    
    # Needs to match encoded inputs. Let's load the encoders locally to pass the correct payload format.
    encoders = joblib.load('model/encoders.joblib')
    
    disasters = df['Disaster Type'].dropna().unique()
    
    # Force numerical
    df['Year'] = pd.to_numeric(df['Year'], errors='coerce')
    df['Dis Mag Value'] = pd.to_numeric(df['Dis Mag Value'], errors='coerce')
    df['Longitude'] = pd.to_numeric(df['Longitude'], errors='coerce')
    df['Latitude'] = pd.to_numeric(df['Latitude'], errors='coerce')
    
    # Fill NAs to extract rows
    cat_cols = ['Dis Mag Scale', 'Country']
    df[cat_cols] = df[cat_cols].fillna('Unknown')
    df[cat_cols] = df[cat_cols].astype(str)

    print("\n" + "="*80)
    print("TESTING 14 DISASTER SCENARIOS")
    print("="*80)
    
    successful_predictions = 0
    total_classes = len(disasters)
    
    for dt in disasters:
        # Extract the median/mean or a random representative row for this actual disaster
        subset = df[df['Disaster Type'] == dt].dropna(subset=['Year', 'Dis Mag Value', 'Longitude', 'Latitude'])
        if len(subset) == 0:
            subset = df[df['Disaster Type'] == dt] # fallback
            
        representative = subset.iloc[0] # just pick the first valid row
        
        # We need the original strings to show the user, and the encoded values to feed the payload
        country_str = representative['Country']
        scale_str = representative['Dis Mag Scale']
        
        # Encode them properly for the backend payload (which expects integers)
        try:
            country_encoded = encoders['Country'].transform([country_str])[0]
        except ValueError:
            country_encoded = encoders['Country'].transform(['Unknown'])[0]
            
        try:
            scale_encoded = encoders['Dis Mag Scale'].transform([scale_str])[0]
        except ValueError:
            scale_encoded = encoders['Dis Mag Scale'].transform(['Unknown'])[0]
            
        if pd.isna(representative['Year']):
            year = 2020
        else:
            year = int(representative['Year'])
            
        if pd.isna(representative['Dis Mag Value']):
            mag_val = 0
        else:
            mag_val = float(representative['Dis Mag Value'])
            
        if pd.isna(representative['Longitude']):
            lon = 0.0
            lat = 0.0
        else:
            lon = float(representative['Longitude'])
            lat = float(representative['Latitude'])
            
        payload = {
            "Year": year,
            "Dis_Mag_Scale": int(scale_encoded),
            "Dis_Mag_Value": mag_val,
            "Country": int(country_encoded),
            "Longitude": lon,
            "Latitude": lat
        }
        
        res = predict_disaster(payload)
        
        print(f"\nScenario Target: {dt.upper()}")
        print(f"Location: {country_str} (Lat: {lat:.4f}, Lon: {lon:.4f})")
        print(f"Metrics: Year={year}, Scale='{scale_str}', Value={mag_val}")
        print(f"Prediction Result: {res['name']}")
        if res['name'] == dt:
            successful_predictions += 1
            print("Status: [PASS]")
        else:
            print(f"Status: [FAIL] Expected {dt}, got {res['name']}")

    print("\n" + "-"*80)
    print(f"Summary: The model correctly predicted {successful_predictions} out of {total_classes} scenarios.")
    print("-" * 80)

if __name__ == "__main__":
    test_14_scenarios()
