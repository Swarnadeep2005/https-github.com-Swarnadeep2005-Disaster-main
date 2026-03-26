from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.predictor import predict_disaster

app = FastAPI(title="Disaster Prediction API")

# Allow frontend to access backend
origins = [
    "http://localhost:3000",
    "https://disaster-wheat-eight.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DisasterInput(BaseModel):
    Year: float
    Dis_Mag_Scale: float
    Dis_Mag_Value: float
    Country: int
    Longitude: float
    Latitude: float


@app.get("/")
def home():
    return {"message": "Disaster Prediction API is running"}


@app.post("/predict")
def predict(data: DisasterInput):

    prediction = predict_disaster(data.model_dump())

    return {
        "predicted_disaster": prediction
    }