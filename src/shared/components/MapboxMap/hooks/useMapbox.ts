import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface UseMapboxOptions {
  center: [number, number];
  zoom: number;
  zoomControls?: boolean;
  mapStyle: string;
  onMapClick?: (lat: number, lng: number) => void;
}

export function useMapbox({
  center,
  zoom,
  mapStyle,
  onMapClick,
  zoomControls = false,
}: UseMapboxOptions) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const clickRef = useRef(onMapClick);

  useEffect(() => {
    clickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!mapContainer.current || mapRef.current || !token) {
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center,
      zoom,
    });

    if (zoomControls) {
      map.addControl(
        new mapboxgl.NavigationControl({
          showCompass: false,
          visualizePitch: false,
        }),
        "top-right",
      );
    }

    mapRef.current = map;

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      clickRef.current?.(lat, lng);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { mapContainer, mapRef };
}
