import { create } from "zustand";
import { Incident } from "../types/incident.types";
import { API_URL } from "@/config/api";

type IncidentStore = {
  incidents: Incident[];
  loading: boolean;
  success: boolean;
  error: string | null;

  fetchIncidents: () => Promise<void>;
  clearIncidents: () => void;
  addIncident: (incident: Incident) => void;
};

export const useIncidentStore = create<IncidentStore>((set, get) => ({
  incidents: [],
  loading: false,
  success: false,
  error: null,

  fetchIncidents: async () => {
    const { loading, incidents } = get();

    if (loading || incidents.length > 0) {
      return;
    }

    set({
      loading: true,
      error: null,
    });

    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data: Incident[] = await res.json();

      set({
        incidents: data,
        loading: false,
        success: true,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  clearIncidents: () => {
    set({
      incidents: [],
    });
  },

  addIncident: (incident: Incident) => {
    set((state) => ({
      incidents: [...state.incidents, incident],
    }));
  },
}));

if (typeof window !== "undefined") {
  useIncidentStore.getState().fetchIncidents();
}
