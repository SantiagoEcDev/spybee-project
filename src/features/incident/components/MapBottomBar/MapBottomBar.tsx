"use client";

import styles from "./MapBottomBar.module.scss";

type MapMode = "2d" | "3d";

interface MapBottomBarProps {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
  is360Enabled?: boolean;
  onToggle360?: (value: boolean) => void;
}

const MapBottomBar = ({
  mode,
  onChange,
}: MapBottomBarProps) => {
  return (
    <div className={styles.bar}>
      <button
        type="button"
        className={`${styles.button} ${mode === "2d" ? styles.active : ""}`}
        onClick={() => onChange("2d")}
      >
        2D
      </button>

      <button
        type="button"
        className={`${styles.button} ${mode === "3d" ? styles.active : ""}`}
        onClick={() => onChange("3d")}
      >
        3D
      </button>

      <button type="button" className={styles.button} disabled>
        Video
      </button>

      <button type="button" className={styles.button} disabled>
        360°
      </button>
    </div>
  );
};

export default MapBottomBar;
