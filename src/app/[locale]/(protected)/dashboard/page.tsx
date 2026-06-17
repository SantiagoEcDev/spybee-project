import IncidentStatusContainer from "@/features/dashboard/components/IncidentStatusContainer/IncidentStatusContainer";
import IncidentDonutContainer from "@/features/incident/components/IncidentDonutContainer/IncidentDonutContainer";
import TrendChartContainer from "@/features/incident/components/TrendChartContainer/TrendChartContainer";

const page = () => {
  return (
    <>
      <IncidentStatusContainer />
      <IncidentDonutContainer />
      <TrendChartContainer />
    </>
  );
};

export default page;
