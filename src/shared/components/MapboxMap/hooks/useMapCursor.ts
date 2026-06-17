import { useEffect, RefObject } from "react";

export function useMapCursor(
  mapRef: RefObject<mapboxgl.Map | null>,
  isAdding: boolean,
) {
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getCanvas().style.cursor = isAdding ? "crosshair" : "";
  }, [mapRef, isAdding]);
}
