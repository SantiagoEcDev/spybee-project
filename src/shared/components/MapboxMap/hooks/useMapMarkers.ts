import { useEffect, useRef, RefObject } from "react";
import mapboxgl from "mapbox-gl";
import { Incident } from "@/features/incident/types/incident.types";
import { renderToStaticMarkup } from "react-dom/server";
import { GoAlertFill } from "react-icons/go";
import React from "react";

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

const createMarkerEl = (color: string) => {
  const el = document.createElement("div");

  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";

  el.innerHTML = renderToStaticMarkup(
    React.createElement(GoAlertFill, {
      color,
      size: 22,
    }),
  );

  return el;
};

export function useMapMarkers(
  mapRef: RefObject<mapboxgl.Map | null>,
  incidents: Incident[] | undefined,
) {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const render = () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      incidents?.forEach((incident) => {
        const el = createMarkerEl(getColor(incident.priority));

        const marker = new mapboxgl.Marker(el)
          .setLngLat([incident.coordinates.lng, incident.coordinates.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    };

    if (map.loaded()) {
      render();
    } else {
      map.once("load", render);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidents]);
}
