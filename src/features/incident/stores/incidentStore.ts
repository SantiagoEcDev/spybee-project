import { create } from "zustand";
import { API_URL } from "@/config/api";
import { Incident } from "../types/incident.types";

type IncidentStore = {
  loading: boolean;
  success: boolean;
  error: string | null;
  incidents: Incident[];

  fetchIncidents: () => Promise<void>;
};

const initialState = {
  loading: false,
  success: false,
  error: null,
  incidents: [],
};

export const useIncidentStore = create<IncidentStore>((set) => ({
  ...initialState,

  fetchIncidents: async () => {
    set({
      ...initialState,
      loading: true,
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
        ...initialState,
        success: true,
        incidents: data,
      });
    } catch (error) {
      set({
        ...initialState,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
}));

useIncidentStore.getState().fetchIncidents();
