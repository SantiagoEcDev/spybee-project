import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

export const useTemporaryMarker = (
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  coordinates?: {
    lat: number;
    lng: number;
  } | null,
) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    if (!coordinates) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    const updateMarker = () => {
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({
          color: "#EEB702",
        })
          .setLngLat([coordinates.lng, coordinates.lat])
          .addTo(map);
      } else {
        markerRef.current.setLngLat([coordinates.lng, coordinates.lat]);
      }

      map.flyTo({
        center: [coordinates.lng, coordinates.lat],
        zoom: Math.max(map.getZoom(), 16),
        duration: 1000,
      });
    };

    if (map.loaded()) {
      updateMarker();
    } else {
      map.once("load", updateMarker);
    }

    return () => {
      map.off("load", updateMarker);
    };
  }, [coordinates, mapRef]);
};


