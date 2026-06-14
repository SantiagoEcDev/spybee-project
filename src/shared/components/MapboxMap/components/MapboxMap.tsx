"use client";

import { useEffect, useRef } from "react";
import mapboxgl, { Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "../styles/MapboxMap.module.scss";
import { Incident } from "@/features/incident/types/incident.types";
import { renderToStaticMarkup } from "react-dom/server";
import { GoAlertFill } from "react-icons/go";

interface MapboxMapProps {
  center?: [number, number];
  zoom?: number;
  mapStyle?: string;
  isAdding?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
  incidents?: Incident[];
}

const MapboxMap = ({
  center = [-74.0721, 4.711],
  zoom = 12,
  mapStyle = "mapbox://styles/mapbox/streets-v12",
  isAdding = false,
  onMapClick,
  incidents,
}: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const clickRef = useRef(onMapClick);

  useEffect(() => {
    clickRef.current = onMapClick;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!mapContainer.current || mapRef.current || !token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center,
      zoom,
    });

    mapRef.current = map;

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      clickRef.current?.(lat, lng);
    });

    const renderMarkers = () => {
      if (!mapRef.current) return;

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (!incidents?.length) return;

      const getColor = (priority: string) => {
        switch (priority) {
          case "high":
            return "#F87171";
          case "medium":
            return "#FBBF24";
          default:
            return "#34D399";
        }
      };

      incidents.forEach((incident) => {
        const el = document.createElement("div");

        el.innerHTML = renderToStaticMarkup(
          <GoAlertFill color={getColor(incident.priority)} size={22} />,
        );

        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";

        const marker = new mapboxgl.Marker(el)
          .setLngLat([incident.coordinates.lng, incident.coordinates.lat])
          .addTo(mapRef.current!);

        markersRef.current.push(marker);
      });
    };

    renderMarkers();

    map.getCanvas().style.cursor = isAdding ? "crosshair" : "";

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [incidents, isAdding, center, zoom, mapStyle, onMapClick]);

  return <><div ref={mapContainer} className={styles.mapboxMap} /><Marker /></>;
};

export default MapboxMap;
