import { z } from "zod";

export const incidentSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),

  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),

  dueDate: z.date({
    message: "La fecha de vencimiento es obligatoria",
  }),

  category: z.string().min(1, "La categoría es obligatoria"),
  
  priority: z.enum(["low", "medium", "high"], {
    message: "La prioridad es obligatoria",
  }),

  tags: z.array(z.string()).optional(),

  assignees: z.array(z.string()).optional(),

  observers: z.array(z.string()).optional(),

  coordinates: z.object({
    lat: z.string().min(1, "La latitud es obligatoria"),

    lng: z.string().min(1, "La longitud es obligatoria"),
  }),

  locationDetails: z.string().optional(),

  files: z.array(z.string()).optional(),
});

export type IncidentFormData = z.infer<typeof incidentSchema>;
