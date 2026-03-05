type Coordinate = [number, number];
type TripStatus = "ONGOING" | "FINISHED" | "DRAFTED";

interface EldLog {
  status: string;
  start: string;
  end: string;
}

interface ELD {
  day: number;
  log: EldLog[];
  summary: {
    driving_hours: number;
    off_duty_hours: number;
    on_duty_hours: number;
  };
}

export interface TripRouteResponse {
  trip_id: string;

  current: Coordinate;
  pickup: Coordinate;
  dropoff: Coordinate;
  status: TripStatus;
  distance_miles: number;
  duration_hours: number;
  pickup_location: string;
  dropoff_location: string;

  current_to_pickup: Coordinate[];
  pickup_to_dropoff: Coordinate[];

  fuel_stops: Coordinate[];
  rest_stops: Coordinate[];

  eld_logs: ELD[];
}
