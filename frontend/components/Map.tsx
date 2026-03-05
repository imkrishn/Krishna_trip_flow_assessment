"use client";

import Map, { Marker, Source, Layer, MapRef } from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

import { Feature, LineString } from "geojson";
import { ZoomIn, ZoomOut } from "lucide-react";
import React, { useRef } from "react";

type Coord = [number, number];

interface Props {
  current: Coord;
  pickup: Coord;
  dropoff: Coord;
  route1: Coord[];
  route2: Coord[];
  fuelStops: Coord[];
  restStops: Coord[];
}

export default function TripMap({
  current,
  pickup,
  dropoff,
  route1,
  route2,
  fuelStops,
  restStops,
}: Props) {
  const mapRef = useRef<MapRef>(null);

  const routeCurrentPickup: Feature<LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: route1,
    },
  };

  const routePickupDropoff: Feature<LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: route2,
    },
  };

  const zoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const zoomOut = () => {
    mapRef.current?.zoomOut();
  };

  return (
    <div className="col-span-8 overflow-hidden h-max rounded-lg shadow-md border border-gray-200 relative">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: current[0],
          latitude: current[1],
          zoom: 4,
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        style={{ width: "100%", height: "520px" }}
      >
        {/* rest stops */}
        {restStops.map((stop, i) => (
          <Marker key={`rest-${i}`} longitude={stop[0]} latitude={stop[1]}>
            <div className="text-xl">🛑</div>
          </Marker>
        ))}

        {/* fuel stops */}
        {fuelStops.map((stop, i) => (
          <Marker key={`fuel-${i}`} longitude={stop[0]} latitude={stop[1]}>
            <div className="text-xl">⛽</div>
          </Marker>
        ))}

        {/* current */}
        <Marker longitude={current[0]} latitude={current[1]}>
          <div className="text-2xl">🧭</div>
        </Marker>

        {/* pickup */}
        <Marker longitude={pickup[0]} latitude={pickup[1]}>
          <div className="text-2xl">🚚</div>
        </Marker>

        {/* dropff */}
        <Marker longitude={dropoff[0]} latitude={dropoff[1]}>
          <div className="text-2xl">⛳</div>
        </Marker>

        <Source id="route1" type="geojson" data={routeCurrentPickup}>
          <Layer
            id="route1-line"
            type="line"
            paint={{
              "line-color": "#2563eb",
              "line-width": 5,
              "line-opacity": 0.9,
            }}
          />
        </Source>

        <Source id="route2" type="geojson" data={routePickupDropoff}>
          <Layer
            id="route2-line"
            type="line"
            paint={{
              "line-color": "#16a34a",
              "line-width": 5,
              "line-opacity": 0.9,
            }}
          />
        </Source>
      </Map>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-400">
        <div className="flex bg-white shadow-md rounded-md px-4 py-2 gap-5 items-center">
          <ZoomIn
            onClick={zoomIn}
            size={22}
            className="cursor-pointer active:scale-95"
          />

          <ZoomOut
            onClick={zoomOut}
            size={22}
            className="cursor-pointer active:scale-95"
          />
        </div>
      </div>
    </div>
  );
}
