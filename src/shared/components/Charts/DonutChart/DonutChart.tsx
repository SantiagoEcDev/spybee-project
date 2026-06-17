"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styles from "./DonutChart.module.scss";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  slices: DonutSlice[];
}

const DonutChart = ({ title, slices }: DonutChartProps) => {
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.total}>{total}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.donut}>
          <ResponsiveContainer width={90} height={90}>
            <PieChart>
              <Pie
                data={slices}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={44}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {slices.map((slice, i) => (
                  <Cell key={i} fill={slice.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className={styles.legend}>
          {slices.map((slice) => (
            <li key={slice.label} className={styles.legendItem}>
              <span
                className={styles.dot}
                style={{ backgroundColor: slice.color }}
              />
              <span className={styles.legendLabel}>{slice.label}</span>
              <span className={styles.legendValue}>{slice.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DonutChart;
