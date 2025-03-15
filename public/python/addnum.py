import sys
import json
import os
import requests


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(SCRIPT_DIR, "../../data/data.json")
API_URL = "https://geocoding-api.open-meteo.com/v1/search?name={}&count=10&language=en&format=json"

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("false")
        sys.exit(1)

    phone = sys.argv[1]
    city = sys.argv[2]

    response = requests.get(API_URL.format(city))
    if response.status_code != 200:
        print("false")
        sys.exit(1)
    
    data_api = response.json()
    if "results" not in data_api or not data_api["results"]:
        print("false")
        sys.exit(1)
    
    lat = data_api["results"][0]["latitude"]
    lon = data_api["results"][0]["longitude"]
    coordinates = f"{lat},{lon}"

    try:
        with open(FILE_PATH, "r", encoding="utf-8") as file:
            data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        data = {}

    if coordinates not in data:
        data[coordinates] = []

    if phone not in data[coordinates]:
        data[coordinates].append(phone)

    with open(FILE_PATH, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

    print("true")
