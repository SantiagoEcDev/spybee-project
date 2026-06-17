import { Incident } from "../types/incident.types";


export function useIncidentFormOptions(incidents: Incident[]) {
  const assigneeOptions = Array.from(
    new Map(
      incidents.flatMap((incident) =>
        incident.assignees.map((user) => [user.id, user]),
      ),
    ).values(),
  );

  const observerOptions = Array.from(
    new Map(
      incidents.flatMap((incident) =>
        incident.observers.map((user) => [user.id, user]),
      ),
    ).values(),
  );

  const categoryOptions = Array.from(
    new Map(
      incidents
        .filter((incident) => incident.type)
        .map((incident) => [
          incident.type.id,
          {
            id: incident.type.id,
            name: incident.type.name,
            key: incident.type.key,
          },
        ]),
    ).values(),
  );

  const tagOptions = Array.from(
    new Map(
      incidents.flatMap((incident) =>
        incident.tags.map((tag) => [tag.id, tag]),
      ),
    ).values(),
  );

  return {
    assigneeOptions,
    observerOptions,
    categoryOptions,
    tagOptions,
  };
}
