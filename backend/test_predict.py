import sys
from app.predictor import predict_disaster

# Test Earthquake
data_earthquake = {
    "Year": 2015,
    "Dis_Mag_Scale": 2, # Richter
    "Dis_Mag_Value": 7.8,
    "Country": 136, # Nepal
    "Longitude": 84.731,
    "Latitude": 28.23
}
print("Earthquake test:", predict_disaster(data_earthquake))

# Test Storm
data_storm = {
    "Year": 2005,
    "Dis_Mag_Scale": 1, # Kph
    "Dis_Mag_Value": 250,
    "Country": 213, # USA
    "Longitude": -89.6,
    "Latitude": 29.3
}
print("Storm test:", predict_disaster(data_storm))

