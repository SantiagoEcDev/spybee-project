import RiskIndicators from "../RiskIndicators/RiskIndicators";
import styles from "./RiskIndicatorsContainer.module.scss";

const RiskIndicatorsContainer = () => {
  return (
    <div className={styles.container}>
      <RiskIndicators />
    </div>
  );
};

export default RiskIndicatorsContainer;
