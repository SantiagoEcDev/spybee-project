"use client";

import styles from "./ActivityCalendar.module.scss";
import { useIncidentStore } from "@/features/incident/stores/incidentStore";
import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  getYear,
} from "date-fns";
import { es } from "date-fns/locale";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState } from "react";

const WEEK_DAYS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
const YEARS = Array.from({ length: 5 }, (_, i) => getYear(new Date()) - 2 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) =>
  format(new Date(2000, i, 1), "MMM", { locale: es }),
);

const getBadgeVariant = (count: number) => {
  if (count >= 3) return styles.badgeDanger;
  if (count === 2) return styles.badgeWarning;
  return styles.badgeNeutral;
};

interface ActivityCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const ActivityCalendar = ({
  selectedDate,
  onSelectDate,
}: ActivityCalendarProps) => {
  const incidents = useIncidentStore((state) => state.incidents);
  const [current, setCurrent] = useState(new Date());

  const countByDay = useMemo(() => {
    const map = new Map<string, number>();
    incidents.forEach((inc) => {
      const key = format(new Date(inc.createdAt), "yyyy-MM-dd");
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, [incidents]);

  const days = useMemo(() => {
    const start = startOfMonth(current);
    const end = endOfMonth(current);
    const allDays = eachDayOfInterval({ start, end });
    const startDow = getDay(start);
    const offset = startDow === 0 ? 6 : startDow - 1;
    return [...Array(offset).fill(null), ...allDays];
  }, [current]);

  const selectedIncidents = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return incidents.filter(
      (inc) => format(new Date(inc.createdAt), "yyyy-MM-dd") === key,
    );
  }, [selectedDate, incidents]);

  const currentYear = getYear(current);
  const currentMonthIdx = current.getMonth();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <p className={styles.title}>Calendario de actividad</p>
        <p className={styles.subtitle}>Incidencias creadas por día</p>
      </div>

      <div className={styles.nav}>
        <button
          className={styles.navBtn}
          onClick={() => setCurrent((d) => subMonths(d, 1))}
        >
          <FiChevronLeft />
        </button>
        <div className={styles.selects}>
          <select
            className={styles.select}
            value={currentYear}
            onChange={(e) => {
              const d = new Date(current);
              d.setFullYear(Number(e.target.value));
              setCurrent(d);
            }}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            className={styles.select}
            value={currentMonthIdx}
            onChange={(e) => {
              const d = new Date(current);
              d.setMonth(Number(e.target.value));
              setCurrent(d);
            }}
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <button
          className={styles.navBtn}
          onClick={() => setCurrent((d) => addMonths(d, 1))}
        >
          <FiChevronRight />
        </button>
      </div>

      <div className={styles.grid}>
        {WEEK_DAYS.map((d) => (
          <div key={d} className={styles.weekDay}>
            {d}
          </div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={`blank-${i}`} />;
          const key = format(day, "yyyy-MM-dd");
          const count = countByDay.get(key) ?? 0;
          const isSelected = selectedDate
            ? isSameDay(day, selectedDate)
            : false;
          const isCurrentMonth = isSameMonth(day, current);

          return (
            <div
              key={key}
              className={`${styles.dayCell} ${isSelected ? styles.dayCellSelected : ""} ${!isCurrentMonth ? styles.dayCellFaded : ""}`}
              onClick={() => onSelectDate(day)}
            >
              <span className={styles.dayNumber}>{format(day, "d")}</span>
              {count > 0 && (
                <span className={`${styles.badge} ${getBadgeVariant(count)}`}>
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        {selectedDate && selectedIncidents.length > 0 ? (
          <ul className={styles.incidentList}>
            {selectedIncidents.map((inc) => (
              <li key={inc.id} className={styles.incidentItem}>
                <span className={styles.incidentId}>#{inc.sequenceId}</span>
                <span className={styles.incidentTitle}>{inc.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyHint}>
            Haz click en un día con actividad para ver el detalle
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityCalendar;
