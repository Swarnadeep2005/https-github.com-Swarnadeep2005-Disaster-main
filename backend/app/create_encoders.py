import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
import joblib

new_data = pd.read_csv('../../datasets/new_unseen_dataset.csv')
new_data.replace('nan', np.nan, inplace=True)

categorical_cols = new_data.select_dtypes(include='object').columns
imputer_cat = SimpleImputer(strategy='most_frequent')
new_data[categorical_cols] = imputer_cat.fit_transform(new_data[categorical_cols])

encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    le.fit(new_data[col])
    encoders[col] = le

joblib.dump(encoders, '../model/encoders.joblib')
print("Encoders saved successfully. Keys:", list(encoders.keys()))
