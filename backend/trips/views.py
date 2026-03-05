from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Trip
from .serializers import TripSerializer
from .services import create_trip_plan, get_route, generate_eld_logs


class TripListView(APIView):

    def post(self, request):

        data = request.data

        current = data.get("currentLocation")
        pickup = data.get("pickupLocation")
        dropoff = data.get("dropoffLocation")

        if not current or not pickup or not dropoff:
            return Response(
                {"error": "Missing coordinates"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # make previous ongoing trips drafted
        Trip.objects.filter(status="ONGOING").update(status="DRAFTED")

        result = create_trip_plan(
            current,
            pickup,
            dropoff,
            data.get("currentCycleUsed", 0)
        )

        if not result["success"]:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)

        return Response(result, status=status.HTTP_201_CREATED)

    def get(self, request):

        trips = Trip.objects.all().order_by("-created_at")

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
                    status=status.HTTP_400_BAD_REQUEST
                )

            if "error" in route_data:
                return Response(
                    {"error": route_data["error"]},
                    status=status.HTTP_400_BAD_REQUEST
                )

            eld_logs = generate_eld_logs(route_data["duration_hours"])

            return Response({
                "trip_id": data["id"],
                "status": data["status"],

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
                status=status.HTTP_404_NOT_FOUND
            )


class TripStatusUpdateView(APIView):

    def post(self, request, trip_id):

        try:

            trip = Trip.objects.get(id=trip_id)

            if trip.status == "FINISHED":
                return Response(
                    {"error": "Finished trips cannot be modified"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            new_status = request.data.get("status")

            if new_status not in ["ONGOING", "FINISHED"]:
                return Response(
                    {"error": "Invalid status"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # if resuming drafted trip  make others drafted
            if new_status == "ONGOING":
                Trip.objects.filter(status="ONGOING").update(status="DRAFTED")

            trip.status = new_status
            trip.save()

            return Response({
                "trip_id": trip.id,
                "status": trip.status
            })

        except Trip.DoesNotExist:
            return Response(
                {"error": "Trip not found"},
                status=status.HTTP_404_NOT_FOUND
            )