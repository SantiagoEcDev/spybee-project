"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./MapboxMap.module.scss";

import { useEffect, useState } from "react";
import { Incident } from "@/features/incident/types/incident.types";

import { useMapbox } from "./hooks/useMapbox";
import { useMapCursor } from "./hooks/useMapCursor";
import { useMapMarkers } from "./hooks/useMapMarkers";
import MapBottomBar from "../../../features/incident/components/MapBottomBar/MapBottomBar";
import { useTemporaryMarker } from "./hooks/useTemporalMarker";

type MapMode = "2d" | "3d";

interface MapboxMapProps {
  center?: [number, number];
  zoom?: number;
  mapStyle?: string;
  isAdding?: boolean;
  onMapClick?: (lng: number, lat: number) => void;
  incidents?: Incident[];

  zoomControls?: boolean;

  markerCoordinates?: {
    lng: number;
    lat: number;
  } | null;
}

const MapboxMap = ({
  center = [-74.0721, 4.711],
  zoom = 12,
  mapStyle = "mapbox://styles/mapbox/streets-v12",
  isAdding = false,
  onMapClick,
  incidents,
  markerCoordinates,
  zoomControls = false,
}: MapboxMapProps) => {
  const { mapContainer, mapRef } = useMapbox({
    center,
    zoom,
    mapStyle,
    onMapClick,
    zoomControls,
  });

  const [mode, setMode] = useState<MapMode>("2d");

  useMapCursor(mapRef, isAdding);
  useMapMarkers(mapRef, incidents);
  useTemporaryMarker(mapRef, markerCoordinates);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (mode === "2d") {
      map.setPitch(0);
      map.setBearing(0);
    }

    if (mode === "3d") {
      map.setPitch(60);
      map.setBearing(-20);
    }
  }, [mode, mapRef]);

  return (
    <div className={styles.wrapper}>
      <div ref={mapContainer} className={styles.mapboxMap} />

      <MapBottomBar mode={mode} onChange={setMode} />
    </div>
  );
};

export default MapboxMap;
