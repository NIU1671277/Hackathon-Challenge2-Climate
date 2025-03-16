import openmeteo_requests
import json
import sys
import requests_cache
from retry_requests import retry

def get_weather_data(latitude, longitude):
    # Setup the Open-Meteo API client with cache and retry on error
    cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
    retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
    openmeteo = openmeteo_requests.Client(session=retry_session)

    # Make sure all required weather variables are listed here
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": [
            "temperature_2m", "showers", "cloud_cover", "wind_speed_10m", 
            "relative_humidity_2m", "precipitation", "snowfall", "pressure_msl", 
            "wind_direction_10m", "apparent_temperature", "rain", "weather_code", 
            "surface_pressure", "wind_gusts_10m", "is_day"
        ]
    }

    try:
        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]
        current = response.Current()

        # Crear el diccionario con los datos actuales
        subdata = {
            "temperature_2m": current.Variables(0).Value(),
            "shower": current.Variables(1).Value(),
            "cloud_cover": current.Variables(2).Value(),
            "wind_speed_10m": current.Variables(3).Value(),
            "relative_humidity_2m": current.Variables(4).Value(),
            "precipitation": current.Variables(5).Value(),
            "snowfall": current.Variables(6).Value(),
            "pressure_msl": current.Variables(7).Value(),
            "wind_direction_10m": current.Variables(8).Value(),
            "apparent_temperature": current.Variables(9).Value(),
            "rain": current.Variables(10).Value(),
            "weather_code": current.Variables(11).Value(),
            "surface_pressure": current.Variables(12).Value(),
            "wind_gusts_10m": current.Variables(13).Value(),
            "is_day": current.Variables(14).Value()
        }

        # Imprimir el JSON como salida
        print(json.dumps(subdata))

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Latitude and longitude are required"}), file=sys.stderr)
        sys.exit(1)

    latitude = sys.argv[1]
    longitude = sys.argv[2]
    get_weather_data(latitude, longitude)