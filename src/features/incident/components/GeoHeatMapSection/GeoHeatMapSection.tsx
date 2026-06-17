"use client";

import GeoHeatmap from "@/shared/components/MapboxMap/GeoHeatMap/GeoHeatMap";
import styles from "./GeoHeatMapSection.module.scss";

import { useState } from "react";
import ActivityCalendar from "../AcitivityCalendar/AcitivityCalendar";

const GeoHeatmapSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <div className={styles.layout}>
      <GeoHeatmap selectedDate={selectedDate} />
      <ActivityCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
    </div>
  );
};

export default GeoHeatmapSection;
