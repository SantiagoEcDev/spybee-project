import IncidentStatusContainer from "@/features/dashboard/components/IncidentStatusContainer/IncidentStatusContainer";
import IncidentDonutContainer from "@/features/incident/components/IncidentDonutContainer/IncidentDonutContainer";

const page = () => {
  return (
    <>
      <IncidentStatusContainer />
      <IncidentDonutContainer />
    </>
  );
};

export default page;
