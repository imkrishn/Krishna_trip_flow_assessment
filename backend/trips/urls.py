from django.urls import path
from .views import TripView

urlpatterns = [
    path("trips/", TripView.as_view()),
    path("trip/<uuid:trip_id>/", TripView.as_view()),
]
