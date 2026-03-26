import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
import joblib

# Load the oversampler
loaded_oversampler = joblib.load('../model/oversampler.joblib')

# Load the original dataset
new_data = pd.read_csv('../../datasets/new_unseen_dataset.csv')

new_data.replace('nan', np.nan, inplace=True)

numerical_cols = new_data.select_dtypes(include=np.number).columns
imputer_num = SimpleImputer(strategy='mean')
new_data[numerical_cols] = imputer_num.fit_transform(new_data[numerical_cols])

categorical_cols = new_data.select_dtypes(include='object').columns
imputer_cat = SimpleImputer(strategy='most_frequent')
new_data[categorical_cols] = imputer_cat.fit_transform(new_data[categorical_cols])

label_encoder = LabelEncoder()
for col in categorical_cols:
    new_data[col] = label_encoder.fit_transform(new_data[col])

selected_features = ['Year', 'Dis Mag Scale', 'Dis Mag Value', 'Country', 'Longitude', 'Latitude', 'Disaster Type']
X_selected = new_data[selected_features]

X_new = X_selected.drop('Disaster Type', axis=1)
y_new = X_selected['Disaster Type']

X_new_resampled, y_new_resampled = loaded_oversampler.fit_resample(X_new, y_new)
X_train, X_test, y_train, y_test = train_test_split(X_new_resampled, y_new_resampled, test_size=0.2, random_state=42)

scaler = StandardScaler()
scaler.fit(X_train)

joblib.dump(scaler, '../model/scaler.joblib')
print("Scaler saved successfully.")
