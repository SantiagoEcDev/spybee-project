import { create } from "zustand";
import { Incident } from "../types/incident.types";
import { API_URL } from "@/config/api";

type IncidentStore = {
  incidents: Incident[];
  loading: boolean;
  error: string | null;

  fetchIncidents: () => Promise<void>;
  clearIncidents: () => void;
};


export const useIncidentStore = create<IncidentStore>((set) => ({
  incidents: [],
  loading: false,
  error: null,

  fetchIncidents: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        }
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data: Incident[] = await res.json();

      set({
        incidents: data,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  clearIncidents: () => {
    set({ incidents: [] });
  },
}));