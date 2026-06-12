"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

import {
  FiHome,
  FiPieChart,
  FiMapPin,
  FiAlertTriangle,
  FiBarChart2,
  FiUsers,
  FiFileText,
  FiSettings,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import styles from "./Sidebar.module.scss";

type NavigationItem = {
  key: string;
  href:
    | "/home"
    | "/dashboard"
    | "/map"
    | "/incidents"
    | "/analytics"
    | "/users"
    | "/reports"
    | "/settings"
    | "/share";
  icon: React.ComponentType;
  section: "main" | "footer";
};

const navigationItems: NavigationItem[] = [
  { key: "home", href: "/home", icon: FiHome, section: "main" },
  { key: "dashboard", href: "/dashboard", icon: FiPieChart, section: "main" },
  { key: "map", href: "/map", icon: FiMapPin, section: "main" },
  {
    key: "incidents",
    href: "/incidents",
    icon: FiAlertTriangle,
    section: "main",
  },
  {
    key: "analytics",
    href: "/analytics",
    icon: FiBarChart2,
    section: "main",
  },
  { key: "users", href: "/users", icon: FiUsers, section: "main" },
  { key: "reports", href: "/reports", icon: FiFileText, section: "main" },
  { key: "settings", href: "/settings", icon: FiSettings, section: "footer" },
  { key: "share", href: "/share", icon: FiShare2, section: "footer" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const [isExpanded, setIsExpanded] = useState(false);
  const mainItems = navigationItems.filter((item) => item.section === "main");
  const footerItems = navigationItems.filter(
    (item) => item.section === "footer",
  );

  const sidebarClassName = `${styles.sidebar} ${
    isExpanded ? styles.expanded : styles.collapsed
  }`;

  return (
    <aside className={sidebarClassName}>
      <div className={styles.top}>
        <div className={styles.avatarWrapper}>
          <Image
            src="https://i.pravatar.cc/150"
            alt="user"
            width={60}
            height={60}
            className={styles.avatar}
            priority
          />
        </div>

        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setIsExpanded((value) => !value)}
          aria-label={isExpanded ? "Cerrar sidebar" : "Abrir sidebar"}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>

      <nav className={styles.nav}>
        {mainItems.map(({ href, icon: Icon, key }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${pathname === href ? styles.active : ""}`}
          >
            <span className={styles.icon} aria-hidden="true">
              <Icon />
            </span>
            <span className={styles.label}>{t(`items.${key}`)}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        {footerItems.map(({ href, icon: Icon, key }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${pathname === href ? styles.active : ""}`}
          >
            <span className={styles.icon} aria-hidden="true">
              <Icon />
            </span>
            <span className={styles.label}>{t(`items.${key}`)}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
