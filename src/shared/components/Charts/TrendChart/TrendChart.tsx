"use client";

import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./TrendChart.module.scss";
import { useMemo, useState } from "react";
import { useIncidentStore } from "@/features/incident/stores/incidentStore";
import {
  startOfWeek,
  startOfDay,
  startOfMonth,
  format,
  eachWeekOfInterval,
  eachDayOfInterval,
  eachMonthOfInterval,
  min,
  max,
} from "date-fns";
import { es } from "date-fns/locale";

type Granularity = "day" | "week" | "month";

interface DataPoint {
  label: string;
  creadas: number;
  cerradas: number;
  backlog: number;
}

const TrendChart = () => {
  const incidents = useIncidentStore((state) => state.incidents);
  const [granularity, setGranularity] = useState<Granularity>("week");

  const data = useMemo<DataPoint[]>(() => {
    if (incidents.length === 0) return [];

    const dates = incidents.map((i) => new Date(i.createdAt));
    const minDate = min(dates);
    const maxDate = max(dates);

    let buckets: Date[] = [];
    let bucketKey: (d: Date) => string;
    let labelFmt: (d: Date) => string;

    if (granularity === "day") {
      buckets = eachDayOfInterval({ start: minDate, end: maxDate });
      bucketKey = (d) => format(startOfDay(d), "yyyy-MM-dd");
      labelFmt = (d) => format(d, "MMM dd", { locale: es });
    } else if (granularity === "week") {
      buckets = eachWeekOfInterval(
        { start: minDate, end: maxDate },
        { weekStartsOn: 1 },
      );
      bucketKey = (d) =>
        format(startOfWeek(d, { weekStartsOn: 1 }), "yyyy-MM-dd");
      labelFmt = (d) => format(d, "MMM dd", { locale: es });
    } else {
      buckets = eachMonthOfInterval({ start: minDate, end: maxDate });
      bucketKey = (d) => format(startOfMonth(d), "yyyy-MM");
      labelFmt = (d) => format(d, "MMM yyyy", { locale: es });
    }

    const creadasMap = new Map<string, number>();
    incidents.forEach((inc) => {
      const key = bucketKey(new Date(inc.createdAt));
      creadasMap.set(key, (creadasMap.get(key) ?? 0) + 1);
    });

    const cerradasMap = new Map<string, number>();
    incidents.forEach((inc) => {
      if (!inc.closingDate) return;
      const key = bucketKey(new Date(inc.closingDate));
      cerradasMap.set(key, (cerradasMap.get(key) ?? 0) + 1);
    });

    let backlog = 0;
    return buckets.map((bucket) => {
      const key = bucketKey(bucket);
      const creadas = creadasMap.get(key) ?? 0;
      const cerradas = cerradasMap.get(key) ?? 0;
      backlog += creadas - cerradas;
      return {
        label: labelFmt(bucket),
        creadas,
        cerradas,
        backlog: Math.max(0, backlog),
      };
    });
  }, [incidents, granularity]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.title}>Tendencia: creadas vs cerradas</p>
          <p className={styles.subtitle}>
            Comparativa temporal con backlog acumulado
          </p>
        </div>
        <div className={styles.tabs}>
          {(["day", "week", "month"] as Granularity[]).map((g) => (
            <button
              key={g}
              className={`${styles.tab} ${granularity === g ? styles.tabActive : ""}`}
              onClick={() => setGranularity(g)}
            >
              {g === "day" ? "Día" : g === "week" ? "Semana" : "Mes"}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 16, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="backlogGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e8edf3",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />

            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              formatter={(value) =>
                value === "backlog"
                  ? "Backlog acumulado"
                  : value === "creadas"
                    ? "Creadas"
                    : "Cerradas"
              }
            />

            <Area
              type="monotone"
              dataKey="backlog"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#backlogGradient)"
              dot={false}
              activeDot={{ r: 4 }}
            />

            <Bar
              dataKey="creadas"
              fill="#3b82f6"
              radius={[3, 3, 0, 0]}
              barSize={14}
            />
            <Bar
              dataKey="cerradas"
              fill="#22c55e"
              radius={[3, 3, 0, 0]}
              barSize={14}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
