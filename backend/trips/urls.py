from django.urls import path
from .views import TripListView, TripDetailView, TripStatusUpdateView


urlpatterns = [
    path("trips/", TripListView.as_view(), name="trips"),
    path("trip/<uuid:trip_id>/", TripDetailView.as_view(), name="trip-detail"),
    path("trip/<uuid:trip_id>/status/", TripStatusUpdateView.as_view(), name="trip-status"),

]