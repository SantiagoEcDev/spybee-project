"use client";

import DonutChart from "@/shared/components/Charts/DonutChart/DonutChart";
import styles from "./IncidentDonutContainer.module.scss";
import { useIncidentStore } from "@/features/incident/stores/incidentStore";

const IncidentDonutContainer = () => {
  const incidents = useIncidentStore((state) => state.incidents);

  const openCount = incidents.filter((i) => i.status === "open").length;
  const closedCount = incidents.filter((i) => i.status === "closed").length;

  const estadoSlices = [
    { label: "Abierta", value: openCount, color: "#22c55e" },
    { label: "Cerrada", value: closedCount, color: "#ef4444" },
  ].filter((s) => s.value > 0);

  const highCount = incidents.filter((i) => i.priority === "high").length;
  const mediumCount = incidents.filter((i) => i.priority === "medium").length;
  const lowCount = incidents.filter((i) => i.priority === "low").length;

  const prioridadSlices = [
    { label: "Alta", value: highCount, color: "#ef4444" },
    { label: "Media", value: mediumCount, color: "#f97316" },
    { label: "Baja", value: lowCount, color: "#22c55e" },
  ].filter((s) => s.value > 0);

  return (
    <div className={styles.container}>
      <DonutChart title="Por estado" slices={estadoSlices} />
      <DonutChart title="Por prioridad" slices={prioridadSlices} />
    </div>
  );
};

export default IncidentDonutContainer;
