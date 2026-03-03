from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import geocode_location
from .serializers import TripSerializer


class TripView(APIView):
    def post(self, request):
        data = request.data

        current = data.get("currentLocation")
        pickup = data.get("pickupLocation")
        dropoff = data.get("dropoffLocation")
        cycle = data.get("currentCycleUsed", 0)

        if not all([current, pickup, dropoff]):
            return Response(
                {"error": "Missing required fields"},
                status=status.HTTP_400_BAD_REQUEST
            )

        c1 = geocode_location(current)
        c2 = geocode_location(pickup)
        c3 = geocode_location(dropoff)

        if not all([c1, c2, c3]):
            return Response(
                {"error": "Could not geocode one or more locations"},
                status=status.HTTP_400_BAD_REQUEST
            )

        distance_miles = 500.0
        duration_hours = 8.5
        fuel_stops = 1

        serializer = TripSerializer(data={
            "current_location": current,
            "pickup_location": pickup,
            "dropoff_location": dropoff,
            "current_cycle_used": cycle,

            "current_lat": c1[0],
            "current_lng": c1[1],

            "pickup_lat": c2[0],
            "pickup_lng": c2[1],

            "dropoff_lat": c3[0],
            "dropoff_lng": c3[1],

            "distance_miles": distance_miles,
            "duration_hours": duration_hours,
            "fuel_stops": fuel_stops
        })

        if serializer.is_valid():
            trip = serializer.save()

            return Response(
                {
                    "message": "Trip created successfully",
                    "trip_id": trip.id
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)