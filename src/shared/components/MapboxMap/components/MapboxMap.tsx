"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "../styles/MapboxMap.module.scss";

interface MapboxMapProps {
  center?: [number, number];
  zoom?: number;
  mapStyle?: string;
  isAdding?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
}

const MapboxMap = ({
  center = [-74.0721, 4.711],
  zoom = 12,
  mapStyle = "mapbox://styles/mapbox/streets-v12",
  isAdding = false,
  onMapClick,
}: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const onMapClickRef = useRef(onMapClick);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  const handleClick = (e: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = e.lngLat;
    onMapClickRef.current?.(lat, lng);
  };

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center,
      zoom,
    });

    mapRef.current = map;

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.getCanvas().style.cursor = isAdding ? "crosshair" : "";
  }, [isAdding]);

  return <div ref={mapContainer} className={styles.mapboxMap} />;
};

export default MapboxMap;
