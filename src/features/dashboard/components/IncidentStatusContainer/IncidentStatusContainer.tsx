"use client";

import styles from "./IncidentStatusContainer.module.scss";
import IncidentStatusCard from "../IncidentStatusCard/IncidentStatusCard";
import {
  FiFolder,
  FiPlusCircle,
  FiCheckCircle,
  FiPercent,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";
import { useIncidentStore } from "@/features/incident/stores/incidentStore";

const IncidentStatusContainer = () => {
  const incidents = useIncidentStore((state) => state.incidents);

  const openCount = incidents.filter(
    (incident) => incident.status === "open",
  ).length;

  const createdCount = incidents.filter(
    (incident) => incident.createdAt,
  ).length;

  const closedCount = incidents.filter(
    (incident) => incident.status === "closed",
  ).length;

  const closeRate =
    createdCount > 0
      ? `${Math.round((closedCount / createdCount) * 100)}%`
      : "0%";

  const statusCards = [
    {
      status: "Abiertas",
      count: openCount,
      period: "actualmente",
      variant: "success" as const,
      icon: <FiFolder />,
    },
    {
      status: "Creadas",
      count: createdCount,
      period: "en el período",
      variant: "primary" as const,
      icon: <FiPlusCircle />,
      trend: { value: 3 },
    },
    {
      status: "Cerradas",
      count: closedCount,
      period: "en el período",
      variant: "danger" as const,
      icon: <FiCheckCircle />,
      trend: { value: 0 },
    },
    {
      status: "Tasa de cierre",
      count: closeRate,
      period: "cerradas / creadas",
      variant: "warning" as const,
      icon: <FiPercent />,
    },
    {
      status: "Tiempo medio resolución",
      count: "Sin datos",
      period: "días promedio",
      variant: "info" as const,
      icon: <FiClock />,
      trend: { value: 0 },
    },
    {
      status: "Vencidas activas",
      count: 245,
      period: "estado actual",
      variant: "danger" as const,
      icon: <FiAlertTriangle />,
    },
  ];

  return (
    <div className={styles.container}>
      {statusCards.map((card) => (
        <IncidentStatusCard
          key={card.status}
          status={card.status}
          count={card.count}
          period={card.period}
          variant={card.variant}
          icon={card.icon}
          trend={card.trend}
        />
      ))}
    </div>
  );
};

export default IncidentStatusContainer;
