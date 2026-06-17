"use client";

import styles from "./IncidentStatusCard.module.scss";
import clsx from "clsx";
import { ReactNode } from "react";

type Variant = "success" | "primary" | "danger" | "warning" | "info";

interface TrendData {
  value: number | string;
  label?: string; 
}

interface IncidentStatusCardProps {
  status: string;
  count: number | string;
  period: string;
  variant: Variant;
  icon: ReactNode;
  trend?: TrendData;
}

const TrendArrow = ({ value }: { value: number | string }) => {
  const num = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(num) || num === 0) return <span>—</span>;
  return num > 0 ? <span>↑</span> : <span>↓</span>;
};

const getTrendClass = (value: number | string) => {
  const num = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(num) || num === 0) return styles.trendNeutral;
  return num > 0 ? styles.trendUp : styles.trendDown;
};

const IncidentStatusCard = ({
  status,
  count,
  period,
  variant,
  icon,
  trend,
}: IncidentStatusCardProps) => {
  return (
    <div className={clsx(styles.card, styles[variant])}>
      <div className={styles.header}>
        <span className={styles.status}>{status}</span>
        <span className={styles.icon}>{icon}</span>
      </div>

      <div className={styles.count}>{count}</div>

      <div className={styles.footer}>
        <span className={styles.period}>{period}</span>
        {trend !== undefined && (
          <span className={clsx(styles.trend, getTrendClass(trend.value))}>
            <TrendArrow value={trend.value} />
            {typeof trend.value === "number"
              ? `${Math.abs(trend.value)}`
              : trend.value}{" "}
            {trend.label ?? "vs período anterior"}
          </span>
        )}
      </div>
    </div>
  );
};

export default IncidentStatusCard;
