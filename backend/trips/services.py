import requests
import os
from geopy.distance import geodesic
from .serializers import TripSerializer

ORS_API_KEY = os.getenv("ORS_API_KEY")
URL = os.getenv("ORS_PUBLIC_URL")
OSRM_URL = os.getenv("OSRM_BASE_URL", "http://router.project-osrm.org")


# get lon and lat from location

def geocode_location(location):
    try:
        response = requests.get(
            URL,
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

    except Exception:
        return None


#provide route form lon ,lat

def get_osrm_route(a, b):

    lng1, lat1 = a
    lng2, lat2 = b

    url = f"{OSRM_URL}/route/v1/driving/{lng1},{lat1};{lng2},{lat2}?overview=full&geometries=geojson"

    try:
        res = requests.get(url, timeout=10)
        data = res.json()

        if data.get("code") == "NoRoute":
            return {
                "error": "Impossible route between these locations"
            }

        if data.get("code") != "Ok":
            return {
                "error": "Routing service failed"
            }

        route = data["routes"][0]

        return {
            "distance_miles": route["distance"] / 1609,
            "duration_hours": route["duration"] / 3600,
            "geometry": route["geometry"]["coordinates"]
        }

    except Exception:
        return {
            "error": "Routing service unavailable"
        }
    
# calculate fuel stops within 1000miles
def calculate_fuel_stops(route_coords, duration_hours):
    fuel_stops = []

    if not route_coords or duration_hours <= 0:
        return fuel_stops

    FUEL_INTERVAL = 8
    points_per_hour = len(route_coords) / duration_hours
    hour = FUEL_INTERVAL

    while hour < duration_hours:
        index = int(hour * points_per_hour)

        if 0 <= index < len(route_coords):
            fuel_stops.append(route_coords[index])

        hour += FUEL_INTERVAL

    return fuel_stops


# calculate rest stops 

def calculate_rest_stops(route_coords, duration_hours, current_cycle_used):
    rest_stops = []

    if not route_coords:
        return rest_stops

    remaining_drive = max(0, 11 - current_cycle_used)

    if duration_hours <= remaining_drive:
        return rest_stops

    step = len(route_coords) / duration_hours
    hour = remaining_drive

    while hour < duration_hours:
        index = int(hour * step)

        if 0 <= index < len(route_coords):
            rest_stops.append(route_coords[index])

        hour += 11

    return rest_stops


def get_route(c1, c2, c3):

    r1 = get_osrm_route(c1, c2)
    r2 = get_osrm_route(c2, c3)

    if r1 is None or r2 is None:
        return None

    if "error" in r1:
        return r1

    if "error" in r2:
        return r2

    return {
        "current_to_pickup": r1["geometry"],
        "pickup_to_dropoff": r2["geometry"],
        "distance_miles": r1["distance_miles"] + r2["distance_miles"],
        "duration_hours": r1["duration_hours"] + r2["duration_hours"],
    }

#provide eld logs of each day

def generate_eld_logs(duration_hours):
    logs = []
    remaining_drive = duration_hours
    day = 1

    def format_time(hour):
        h = int(hour)
        m = int((hour - h) * 60)
        return f"{h:02d}:{m:02d}"

    while remaining_drive > 0:
        day_log = []
        time_cursor = 0

        driving = 0
        on_duty = 0
        off_duty = 0

        day_log.append({
            "status": "OFF",
            "start": "00:00",
            "end": "06:00"
        })
        off_duty += 6
        time_cursor = 6

        day_log.append({
            "status": "ON",
            "start": format_time(time_cursor),
            "end": format_time(time_cursor + 1)
        })
        on_duty += 1
        time_cursor += 1

        drive_today = min(11, remaining_drive)
        first_drive = min(5, drive_today)

        day_log.append({
            "status": "DR",
            "start": format_time(time_cursor),
            "end": format_time(time_cursor + first_drive)
        })

        driving += first_drive
        time_cursor += first_drive

        if drive_today > 5:
            day_log.append({
                "status": "OFF",
                "start": format_time(time_cursor),
                "end": format_time(time_cursor + 0.5)
            })
            off_duty += 0.5
            time_cursor += 0.5

        second_drive = drive_today - first_drive

        if second_drive > 0:
            day_log.append({
                "status": "DR",
                "start": format_time(time_cursor),
                "end": format_time(time_cursor + second_drive)
            })
            driving += second_drive
            time_cursor += second_drive

        day_log.append({
            "status": "ON",
            "start": format_time(time_cursor),
            "end": format_time(time_cursor + 1)
        })
        on_duty += 1
        time_cursor += 1

        if time_cursor < 24:
            day_log.append({
                "status": "OFF",
                "start": format_time(time_cursor),
                "end": "24:00"
            })
            off_duty += (24 - time_cursor)

        logs.append({
            "day": day,
            "summary": {
                "driving_hours": round(driving, 2),
                "on_duty_hours": round(on_duty, 2),
                "off_duty_hours": round(off_duty, 2)
            },
            "log": day_log
        })

        remaining_drive -= drive_today
        day += 1

    return logs

#genaerate trip plan

def create_trip_plan(current, pickup, dropoff, current_cycle_used):

    c1 = geocode_location(current)
    c2 = geocode_location(pickup)
    c3 = geocode_location(dropoff)

    if not all([c1, c2, c3]):
        return {
            "success": False,
            "message": "Could not geocode one or more locations"
        }

    route_data = get_route(c1, c2, c3)

    if not route_data:
        return {
            "success": False,
            "message": "Route generation failed"
        }

    if "error" in route_data:
        return {
            "success": False,
            "message": route_data["error"]
        }

    distance_miles = route_data["distance_miles"]
    duration_hours = route_data["duration_hours"]

    combined = route_data["current_to_pickup"] + route_data["pickup_to_dropoff"]

    fuel_stops = calculate_fuel_stops(combined, duration_hours)

    rest_stops = calculate_rest_stops(
        combined,
        duration_hours,
        current_cycle_used
    )

    serializer = TripSerializer(data={
        "current_location": current,
        "pickup_location": pickup,
        "dropoff_location": dropoff,
        "current_cycle_used": current_cycle_used,
        "current_lat": c1[1],
        "current_lng": c1[0],
        "pickup_lat": c2[1],
        "pickup_lng": c2[0],
        "dropoff_lat": c3[1],
        "dropoff_lng": c3[0],
        "distance_miles": distance_miles,
        "duration_hours": duration_hours,
        "fuel_stops": fuel_stops,
        "rest_stops": rest_stops
    })

    if serializer.is_valid():
        trip = serializer.save()

        return {
            "success": True,
            "message": "Trip created successfully",
            "trip_id": trip.id
        }

    return {
        "success": False,
        "message": "Failed to create trip",
        "errors": serializer.errors
    }