import { z } from "zod";

export const incidentFormSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(120, "Máximo 120 caracteres"),
  description: z.string().min(1, "La descripción es requerida"),
  dueDate: z.string().nullable().default(null),
  category: z.string().min(1, "La categoría es requerida"),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  tags: z.array(z.string()).default([]),
  assignees: z.array(z.string()).min(1, "Asigna al menos un responsable"),
  observers: z.array(z.string()).default([]),
  lat: z.string().optional(),
  lng: z.string().optional(),
  locationDescription: z.string().optional(),
  photos: z.array(z.instanceof(File)).default([]),
  videos: z.array(z.instanceof(File)).default([]),
  documents: z.array(z.instanceof(File)).default([]),
});

export type IncidentFormValues = z.infer<typeof incidentFormSchema>;
