import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
import joblib
import json
import os

def main():
    print("Loading dataset...")
    df = pd.read_csv('../datasets/new_unseen_dataset.csv', low_memory=False)

    features = ['Year', 'Dis Mag Scale', 'Dis Mag Value', 'Country', 'Longitude', 'Latitude']
    target = 'Disaster Type'

    df = df.dropna(subset=[target])

    print("Imputing missing values...")
    df['Year'] = pd.to_numeric(df['Year'], errors='coerce')
    df['Dis Mag Value'] = pd.to_numeric(df['Dis Mag Value'], errors='coerce')
    df['Longitude'] = pd.to_numeric(df['Longitude'], errors='coerce')
    df['Latitude'] = pd.to_numeric(df['Latitude'], errors='coerce')

    num_cols = ['Year', 'Dis Mag Value', 'Longitude', 'Latitude']
    # Use simple median imputation for numerics
    num_imputer = SimpleImputer(strategy='median')
    df[num_cols] = num_imputer.fit_transform(df[num_cols])

    cat_cols = ['Dis Mag Scale', 'Country']
    df[cat_cols] = df[cat_cols].fillna('Unknown')
    df[cat_cols] = df[cat_cols].astype(str)

    print("Encoding features & target...")
    encoders = {}
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le
        
    target_encoder = LabelEncoder()
    y = target_encoder.fit_transform(df[target].astype(str))
    
    disaster_mapping = {str(k): int(v) for k, v in zip(target_encoder.classes_, target_encoder.transform(target_encoder.classes_))}
    
    X = df[features]
    
    # Check if imblearn is installed
    try:
        from imblearn.over_sampling import RandomOverSampler
        print("Using RandomOverSampler from imblearn...")
        ros = RandomOverSampler(random_state=42)
        X_res, y_res = ros.fit_resample(X, y)
    except ImportError:
        print("imblearn not found. Falling back to duplicate rows for rare classes...")
        # Fallback to manual oversampling for rare classes
        X_res = X.copy()
        y_res = y.copy()
        
        counts = pd.Series(y_res).value_counts()
        max_count = counts.max()
        
        dfs_X = [X_res]
        dfs_y = [pd.Series(y_res)]
        
        for cls, count in counts.items():
            if count < max_count:
                multiplier = (max_count // count) - 1
                if multiplier > 0:
                    idx = np.where(y_res == cls)[0]
                    dfs_X.append(X_res.iloc[idx].sample(n=multiplier*count, replace=True, random_state=42))
                    dfs_y.append(pd.Series([cls] * (multiplier*count)))
        
        X_res = pd.concat(dfs_X, ignore_index=True)
        y_res = pd.concat(dfs_y, ignore_index=True).values

    print(f"Training Random Forest on {len(X_res)} samples...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1, class_weight='balanced')
    model.fit(X_res, y_res)
    
    print("Saving models...")
    os.makedirs('model', exist_ok=True)
    joblib.dump(model, 'model/random_forest_model.joblib')
    joblib.dump(encoders, 'model/encoders.joblib')
    with open('model/disaster_mapping.json', 'w') as f:
        json.dump(disaster_mapping, f, indent=4)
        
    print(f"Successfully retrained model for {len(disaster_mapping)} disaster types.")

if __name__ == '__main__':
    main()
