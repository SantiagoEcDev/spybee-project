import IncidentStatusContainer from "@/features/dashboard/components/IncidentStatusContainer/IncidentStatusContainer";
import IncidentDonutContainer from "@/features/incident/components/IncidentDonutContainer/IncidentDonutContainer";
import RiskIndicatorsContainer from "@/features/incident/components/RiskIndicatorsContainer/RiskIndicatorsContainer";
import TrendChartContainer from "@/features/incident/components/TrendChartContainer/TrendChartContainer";

const page = () => {
  return (
    <>
      <IncidentStatusContainer />
      <IncidentDonutContainer />
      <TrendChartContainer />
      <RiskIndicatorsContainer/>
    </>
  );
};

export default page;
