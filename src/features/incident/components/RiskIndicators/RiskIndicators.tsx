"use client";

import styles from "./RiskIndicators.module.scss";
import { useIncidentStore } from "@/features/incident/stores/incidentStore";
import { useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiRefreshCw,
  FiAlertTriangle,
  FiMoon,
} from "react-icons/fi";
import { formatDistanceToNow, isPast, addDays } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import StatusChip from "../StatusChip/StatusChip";

const PAGE_SIZE = 10;

const priorityLabel: Record<string, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

const statusLabel: Record<string, string> = {
  open: "Abierta",
  closed: "Cerrada",
  on_pause: "En pausa",
  paused: "Pausada",
  in_progress: "En progreso",
};

const formatDueDate = (dueDate: string | null): React.ReactNode => {
  if (!dueDate) return <span className={styles.empty}>Sin fecha</span>;
  const date = new Date(dueDate);
  if (isPast(date)) {
    const distance = formatDistanceToNow(date, { locale: es });
    return <span className={styles.overdue}>Vencida hace {distance}</span>;
  }
  return (
    <span className={styles.dueSoon}>
      {formatDistanceToNow(date, { addSuffix: true, locale: es })}
    </span>
  );
};

const RiskIndicators = () => {
  const incidents = useIncidentStore((state) => state.incidents);
  const [page, setPage] = useState(1);

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sevenDaysLater = addDays(now, 7);

  const overdueToday = incidents.filter(
    (i) => i.dueDate && isPast(new Date(i.dueDate)) && i.status !== "closed",
  ).length;

  const notUpdated7d = incidents.filter(
    (i) => new Date(i.updatedAt) < sevenDaysAgo && i.status !== "closed",
  ).length;

  const highPriorityOpen = incidents.filter(
    (i) => i.priority === "high" && i.status !== "closed",
  ).length;

  const dueSoon = incidents.filter(
    (i) =>
      i.dueDate &&
      !isPast(new Date(i.dueDate)) &&
      new Date(i.dueDate) <= sevenDaysLater &&
      i.status !== "closed",
  ).length;

  const critical = useMemo(
    () =>
      incidents.filter(
        (i) =>
          i.status !== "closed" &&
          (i.priority === "high" ||
            (i.dueDate && new Date(i.dueDate) <= sevenDaysLater)),
      ),
    [incidents],
  );

  const totalPages = Math.ceil(critical.length / PAGE_SIZE);
  const paginated = critical.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const chips = [
    {
      icon: <FiAlertCircle />,
      label: "Vencidas hoy",
      value: overdueToday,
      iconClassName: styles.chipIconDanger,
      valueClassName: styles.chipValueDanger,
    },
    {
      icon: <FiRefreshCw />,
      label: "Sin actualizar 7d+ (actual)",
      value: notUpdated7d,
      iconClassName: styles.chipIconNeutral,
      valueClassName: styles.chipValueNeutral,
    },
    {
      icon: <FiAlertTriangle />,
      label: "Alta prioridad abiertas",
      value: highPriorityOpen,
      iconClassName: styles.chipIconWarning,
      valueClassName: styles.chipValueWarning,
    },
    {
      icon: <FiMoon />,
      label: "Próximas a vencer (7d)",
      value: dueSoon,
      iconClassName: styles.chipIconBlue,
      valueClassName: styles.chipValueBlue,
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTitle}>Indicadores de riesgo</p>
        <p className={styles.sectionSub}>
          Click en cada chip para ver el detalle
        </p>
      </div>
      <div className={styles.chips}>
        {chips.map((chip) => (
          <StatusChip
            key={chip.label}
            icon={chip.icon}
            label={chip.label}
            value={chip.value}
            iconClassName={chip.iconClassName}
            valueClassName={chip.valueClassName}
          />
        ))}
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <p className={styles.tableTitle}>Críticas para hoy</p>
            <p className={styles.tableSub}>
              Alta prioridad o con fecha próxima
            </p>
          </div>
          <span className={styles.tableTotal}>{critical.length} en total</span>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Asignados</th>
              <th>Creado por</th>
              <th>Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((inc) => (
              <tr key={inc.id}>
                <td className={styles.idCell}>#{inc.sequenceId}</td>
                <td className={styles.titleCell}>{inc.title}</td>
                <td>
                  <span
                    className={`${styles.badge} ${styles[`priority_${inc.priority}`]}`}
                  >
                    {priorityLabel[inc.priority] ?? inc.priority}
                  </span>
                </td>
                <td>
                  <span
                    className={`${styles.badge} ${styles[`status_${inc.status}`]}`}
                  >
                    {statusLabel[inc.status] ?? inc.status}
                  </span>
                </td>
                <td>
                  <div className={styles.avatars}>
                    {inc.assignees?.length > 0 ? (
                      inc.assignees
                        .slice(0, 3)
                        .map((a) => (
                          <Image
                            key={a.id}
                            src={a.avatarUrl}
                            alt={a.name}
                            title={a.name}
                            width={32}
                            height={32}
                            className={styles.avatar}
                          />
                        ))
                    ) : (
                      <span className={styles.empty}>—</span>
                    )}
                  </div>
                </td>
                <td>
                  {inc.owner ? (
                    <span className={styles.ownerName}>{inc.owner.name}</span>
                  ) : (
                    <span className={styles.empty}>—</span>
                  )}
                </td>
                <td>{formatDueDate(inc.dueDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, critical.length)} de {critical.length}
          </span>
          <div className={styles.pageButtons}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹
            </button>
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className={styles.ellipsis}>
                  ···
                </span>
              ) : (
                <button
                  key={p}
                  className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ""}`}
                  onClick={() => setPage(p as number)}
                >
                  {p}
                </button>
              ),
            )}
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskIndicators;
