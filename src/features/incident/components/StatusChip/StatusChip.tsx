import styles from "./StatusChip.module.scss";

type StatusChipProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconClassName: string;
  valueClassName: string;
};

const StatusChip = ({
  icon,
  label,
  value,
  iconClassName,
  valueClassName,
}: StatusChipProps) => {
  return (
    <div className={styles.chip}>
      <div className={iconClassName}>{icon}</div>

      <span className={styles.chipLabel}>{label}</span>

      <span className={valueClassName}>{value}</span>
    </div>
  );
};

export default StatusChip;
