"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./GeoHeatMap.module.scss";
import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import { useIncidentStore } from "@/features/incident/stores/incidentStore";
import { Incident } from "@/features/incident/types/incident.types";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

interface GeoHeatmapProps {
  selectedDate: Date | null;
}

const buildGeoJSON = (incidents: Incident[]): GeoJSON.FeatureCollection => ({
  type: "FeatureCollection",
  features: incidents
    .filter((i) => i.coordinates?.lat && i.coordinates?.lng)
    .map((inc) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [inc.coordinates.lng, inc.coordinates.lat],
      },
      properties: {
        weight:
          inc.priority === "high" ? 1 : inc.priority === "medium" ? 0.6 : 0.3,
      },
    })),
});

const GeoHeatmap = ({ selectedDate }: GeoHeatmapProps) => {
  const incidents = useIncidentStore((state) => state.incidents);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const filtered = useMemo(
    () =>
      selectedDate
        ? incidents.filter((i) =>
            isSameDay(new Date(i.createdAt), selectedDate),
          )
        : incidents,
    [incidents, selectedDate],
  );

  const center = useMemo(() => {
    const valid = incidents.filter(
      (i) => i.coordinates?.lat && i.coordinates?.lng,
    );
    if (valid.length === 0) return { lng: -74.0721, lat: 4.711 };
    return {
      lng: valid.reduce((s, i) => s + i.coordinates.lng, 0) / valid.length,
      lat: valid.reduce((s, i) => s + i.coordinates.lat, 0) / valid.length,
    };
  }, [incidents]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [center.lng, center.lat],
      zoom: 14,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right",
    );
    mapRef.current = map;
    map.on("load", () => setMapLoaded(true));

    return () => {
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const geojson = buildGeoJSON(filtered);
    const existing = map.getSource("incidents-heat") as
      | mapboxgl.GeoJSONSource
      | undefined;

    if (existing) {
      existing.setData(geojson);
      return;
    }

    map.addSource("incidents-heat", { type: "geojson", data: geojson });

    map.addLayer({
      id: "incidents-heatmap",
      type: "heatmap",
      source: "incidents-heat",
      paint: {
        "heatmap-weight": ["get", "weight"],
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 8, 1, 16, 4],
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(0,0,0,0)",
          0.1,
          "rgba(255, 230, 0, 0.9)",
          0.4,
          "rgba(255, 140, 0, 1)",
          0.7,
          "rgba(220, 30, 0, 1)",
          1,
          "rgba(100, 0, 30, 1)",
        ],
        "heatmap-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          30,
          14,
          60,
          16,
          80,
        ],
        "heatmap-opacity": 0.95,
      },
    });

    map.addLayer({
      id: "incidents-points",
      type: "circle",
      source: "incidents-heat",
      minzoom: 14,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 14, 7, 18, 16],
        "circle-color": "#ff3300",
        "circle-stroke-width": 2.5,
        "circle-stroke-color": "#ffffff",
        "circle-opacity": ["interpolate", ["linear"], ["zoom"], 14, 0, 15, 1],
      },
    });
  }, [mapLoaded, filtered]);

  const dateLabel = selectedDate
    ? format(selectedDate, "d 'de' MMMM yyyy", { locale: es })
    : null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.title}>Mapa de calor geográfico</p>
          <p className={styles.subtitle}>
            {dateLabel
              ? `${filtered.length} incidencia${filtered.length !== 1 ? "s" : ""} el ${dateLabel}`
              : "Zonas con más incidencias dentro de la obra"}
          </p>
        </div>
      </div>
      <div className={styles.mapWrapper}>
        <div ref={mapContainer} className={styles.map} />
      </div>
    </div>
  );
};

export default GeoHeatmap;
