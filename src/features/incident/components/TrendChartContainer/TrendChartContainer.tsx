import styles from "./TrendChartContainer.module.scss";

import TrendChart from "@/shared/components/Charts/TrendChart/TrendChart";

const TrendChartContainer = () => {
  return (
    <div className={styles["trendchart-container"]}>
      <TrendChart />
    </div>
  );
};

export default TrendChartContainer;
