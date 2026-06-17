"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Breadcrumb.module.scss";

const format = (value: string) =>
  value.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const Breadcrumb = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className={styles.nav} aria-label="breadcrumb">
      <div className={styles.container}>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <span key={href}>
              {isLast ? (
                <span className={styles.current}>{format(segment)}</span>
              ) : (
                <Link href={href} className={styles.link}>
                  {format(segment)}
                </Link>
              )}

              {!isLast && <span className={styles.separator}>/</span>}
            </span>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumb;
