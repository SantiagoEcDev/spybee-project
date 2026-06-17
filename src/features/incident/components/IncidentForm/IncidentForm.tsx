"use client";

import styles from "./IncidentForm.module.scss";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { incidentSchema } from "../../schema/incident.schema";
import { Incident, Priority } from "../../types/incident.types";
import { useIncidentFormOptions } from "../../hooks/useIncidentForm";
import { useIncidentStore } from "../../stores/incidentStore";
import Form from "@/shared/components/Form/Form";
import FormField from "@/shared/components/Form/FormField/FormField";
import Button from "@/shared/components/Button/Button";
import Select from "@/shared/components/Select/Select";
import CustomDatePicker from "@/shared/components/MUI/CustomDatePicker";
import MapboxMap from "@/shared/components/MapboxMap/MapboxMap";

type FormData = z.infer<typeof incidentSchema>;

interface IncidentFormProps {
  incidents: Incident[];
  coordinates?: {
    lat: number;
    lng: number;
  } | null;
  onClose?: () => void;
}

export default function IncidentForm({
  incidents,
  coordinates,
  onClose,
}: IncidentFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      category: "",
      priority: "low",
      tags: [],
      assignees: [],
      observers: [],
      coordinates: {
        lat: coordinates?.lat?.toString() ?? "",
        lng: coordinates?.lng?.toString() ?? "",
      },
      locationDetails: "",
    },
  });

  const { assigneeOptions, observerOptions, categoryOptions, tagOptions } =
    useIncidentFormOptions(incidents);

  const lat = useWatch({
    control,
    name: "coordinates.lat",
  });

  const lng = useWatch({
    control,
    name: "coordinates.lng",
  });

  const categorySelectOptions = categoryOptions.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const tagSelectOptions = tagOptions.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  const assigneeSelectOptions = assigneeOptions.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  const observerSelectOptions = observerOptions.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  const prioritySelectOptions = [
    { value: "low", label: "Baja" },
    { value: "medium", label: "Media" },
    { value: "high", label: "Alta" },
  ];

  const { addIncident } = useIncidentStore();

  const onSubmit = (data: FormData) => {
    const foundType = categoryOptions.find((cat) => cat.id === data.category);

    const newIncident: Incident = {
      id: crypto.randomUUID(),
      sequenceId: "",
      order: 0,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate.toISOString(),
      type: {
        id: foundType?.id ?? data.category,
        key: foundType?.key ?? "",
        name: foundType?.name ?? "",
        name_en: "",
      },
      priority: data.priority as Priority,
      status: "open",
      approval: false,
      project: { id: "", name: "" },
      owner: { id: "", name: "", email: "", avatarUrl: "" },
      whatsappOwner: null,
      assignees: assigneeOptions.filter((user) =>
        data.assignees?.includes(user.id),
      ),
      observers: observerOptions.filter((user) =>
        data.observers?.includes(user.id),
      ),
      coordinates: {
        lat: parseFloat(data.coordinates.lat),
        lng: parseFloat(data.coordinates.lng),
      },
      locationDescription: data.locationDetails ?? "",
      closingDate: null,
      media: [],
      tags: tagOptions.filter((tag) => data.tags?.includes(tag.id)),
      deleted: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addIncident(newIncident);
    reset();
    onClose?.();

    console.log("Nuevo incidente creado:", newIncident);
  };

  return (
    <Form title="Crear nuevo incidente" onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formGrid}>
        <FormField required label="Título" error={errors.title?.message}>
          <input
            {...register("title")}
            placeholder="Ingrese el título del incidente"
          />
        </FormField>

        <FormField required label="Categoría" error={errors.category?.message}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                inputId="category"
                options={categorySelectOptions}
                value={categorySelectOptions.find(
                  (opt) => opt.value === field.value,
                )}
                onChange={(opt) => field.onChange(opt?.value)}
                placeholder="Selecciona categoría"
              />
            )}
          />
        </FormField>

        <div className={styles.doubleField}>
          <FormField
            required
            label="Descripción"
            error={errors.description?.message}
          >
            <textarea
              placeholder="Ingrese la descripción del incidente"
              {...register("description")}
            />
          </FormField>
        </div>

        <FormField
          required
          label="Fecha de vencimiento"
          error={errors.dueDate?.message}
        >
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <CustomDatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Fecha de vencimiento"
              />
            )}
          />
        </FormField>

        <FormField required label="Prioridad">
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                inputId="priority"
                options={prioritySelectOptions}
                value={prioritySelectOptions.find(
                  (opt) => opt.value === field.value,
                )}
                onChange={(opt) => field.onChange(opt?.value)}
                placeholder="Selecciona prioridad"
              />
            )}
          />
        </FormField>

        <FormField label="Etiquetas">
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Select
                isMulti
                options={tagSelectOptions}
                placeholder="Selecciona etiquetas"
                value={tagSelectOptions.filter((opt) =>
                  field.value?.includes(opt.value),
                )}
                onChange={(selected) =>
                  field.onChange(selected.map((s) => s.value))
                }
              />
            )}
          />
        </FormField>

        <FormField label="Asignados">
          <Controller
            name="assignees"
            control={control}
            render={({ field }) => (
              <Select
                isMulti
                options={assigneeSelectOptions}
                placeholder="Selecciona asignados"
                value={assigneeSelectOptions.filter((opt) =>
                  field.value?.includes(opt.value),
                )}
                onChange={(selected) =>
                  field.onChange(selected.map((s) => s.value))
                }
              />
            )}
          />
        </FormField>

        <div className={styles.doubleField}>
          <FormField label="Observadores">
            <Controller
              name="observers"
              control={control}
              render={({ field }) => (
                <Select
                  isMulti
                  options={observerSelectOptions}
                  placeholder="Selecciona observadores"
                  value={observerSelectOptions.filter((opt) =>
                    field.value?.includes(opt.value),
                  )}
                  onChange={(selected) =>
                    field.onChange(selected.map((s) => s.value))
                  }
                />
              )}
            />
          </FormField>
        </div>

        <FormField label="Latitud" error={errors.coordinates?.lat?.message}>
          <input {...register("coordinates.lat")} placeholder="Latitud" />
        </FormField>

        <FormField label="Longitud" error={errors.coordinates?.lng?.message}>
          <input {...register("coordinates.lng")} placeholder="Longitud" />
        </FormField>

        <div className={styles.previewMap}>
          <MapboxMap
          zoomControls
            center={[-74.0721, 4.711]}
            zoom={16}
            markerCoordinates={
              lat && lng
                ? {
                    lat: parseFloat(lat),
                    lng: parseFloat(lng),
                  }
                : null
            }
          />
        </div>

        <div className={styles.doubleField}>
          <FormField label="Detalles de localización">
            <input
              {...register("locationDetails")}
              placeholder="Detalles de localización"
            />
          </FormField>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          Crear incidente
        </Button>
      </div>
    </Form>
  );
}
