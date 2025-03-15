import requests
import json
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from twilio.rest import Client

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(SCRIPT_DIR, "../data/data.json")

ACCOUNT_SID = os.getenv('ACCOUNT_SIM')
TWILIO_TOKEN = os.getenv('TWILIO_TOKEN')

threshold = 6 # Temp diff in ºC
hours_ahead = 2

def get_diffs(data):
    
    coordinates = [coords.split(',') for coords in data.keys()]

    def get_weather_data(lat, lon):
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": "apparent_temperature",
            "timezone": "GMT+0",
            "forecast_days": 2
        }
        url = "https://api.open-meteo.com/v1/forecast"
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error para coordenadas ({lat}, {lon}): {response.status_code}")
            return None

    weather_data = {}
    for lat, lon in coordinates:
        data = get_weather_data(lat, lon)
        if data:
            weather_data[f"{lat},{lon}"] = data

    # print(json.dumps(weather_data, indent=4))

    now = datetime.now(timezone.utc)
    future = now + timedelta(hours=hours_ahead)

    diffs = {}

    for key, val in weather_data.items():
        temperatures = val["hourly"]["apparent_temperature"]

        actual_temp = temperatures[now.hour]
        future_temp = temperatures[future.hour+24*(future.day-now.day)]

        diffs[key] = future_temp - actual_temp

    return diffs

def send_alerts(data, coords):

    telefs = data[coords]
    client = Client(ACCOUNT_SID, TWILIO_TOKEN)

    for tel in telefs:
        client.messages.create(
        from_='+16207431835',
        body='Test',
        to=tel
        )


if __name__ == "__main__":
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as file:
            data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        data = {}

    diffs = get_diffs(data)

    for coords, diff in diffs.items():
        if diff>threshold:
            send_alerts(data, coords)
            print("Alertes enviades per a "+coords)


