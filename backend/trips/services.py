import requests
import os

ORS_API_KEY = os.getenv("ORS_API_KEY")
URL = os.getenv("ORS_PUBLIC_URL")

#get geolocation coordinats from location

def geocode_location(location):
    url = URL
    
    try:
        response = requests.get(
            url,
            params={
                "api_key": ORS_API_KEY,
                "text": location,
                "size": 1
            },
            timeout=5
        )

        response.raise_for_status()
        data = response.json()

        if not data["features"]:
            return None

        lon, lat = data["features"][0]["geometry"]["coordinates"]

        return (lon, lat)

    except Exception as e:
        print("Geocoding error:", e)
        return None
    

