from django.urls import path
from .views import TripListView, TripDetailView

urlpatterns = [
    path("trips/", TripListView.as_view()),
    path("trip/<uuid:trip_id>/", TripDetailView.as_view()),
]