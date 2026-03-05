from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services import create_trip_plan, get_route, generate_eld_logs
from .models import Trip
from .serializers import TripSerializer


class TripListView(APIView):

    def post(self, request):

        data = request.data

        result = create_trip_plan(
            data.get("currentLocation"),
            data.get("pickupLocation"),
            data.get("dropoffLocation"),
            data.get("currentCycleUsed", 0)
        )

        if not result["success"]:
            return Response(result, status=400)

        return Response(result, status=200)

    def get(self, request):
        trips = Trip.objects.all()
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)


class TripDetailView(APIView):

    def get(self, request, trip_id):

        try:

            trip = Trip.objects.get(id=trip_id)

            serializer = TripSerializer(trip)
            data = serializer.data

            current_coords = (data["current_lng"], data["current_lat"])
            pickup_coords = (data["pickup_lng"], data["pickup_lat"])
            dropoff_coords = (data["dropoff_lng"], data["dropoff_lat"])

            route_data = get_route(
                current_coords,
                pickup_coords,
                dropoff_coords
            )

            if not route_data:
                return Response(
                    {"error": "Route generation failed"},
                    status=400
                )

            eld_logs = generate_eld_logs(route_data["duration_hours"])

            return Response({
                "trip_id": data["id"],
                "current": current_coords,
                "pickup": pickup_coords,
                "dropoff": dropoff_coords,
                "distance_miles": route_data["distance_miles"],
                "duration_hours": route_data["duration_hours"],
                "current_to_pickup": route_data["current_to_pickup"],
                "pickup_to_dropoff": route_data["pickup_to_dropoff"],
                "fuel_stops": data["fuel_stops"],
                "rest_stops": data["rest_stops"],
                "eld_logs": eld_logs,
                "current_cycle_used": data["current_cycle_used"]
            })

        except Trip.DoesNotExist:
            return Response(
                {"error": "Trip not found"},
                status=404
            )