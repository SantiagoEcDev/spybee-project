export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type Project = {
  id: string;
  name: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Media = {
  id: string;
  name: string;
  type: "image" | "video" | "file";
  format: string;
  size: number;
  status: "uploaded" | "processing" | "failed";
  url: string;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type IncidentType = {
  id: string;
  key: string;
  name: string;
  name_en: string;
};

export type Priority = "low" | "medium" | "high" | "critical";

export type Status = "open" | "created" | "closed" | "cancelled";

export type Incident = {
  id: string;
  sequenceId: string;
  order: number;

  title: string;
  description: string;

  type: IncidentType;

  priority: Priority;
  status: Status;

  approval: boolean;

  project: Project;

  owner: User;

  whatsappOwner: string | null;

  assignees: User[];
  observers: User[];

  coordinates: Coordinates;

  locationDescription: string;

  dueDate: string | null;
  closingDate: string | null;

  media: Media[];

  tags: Tag[];

  deleted: string | null;

  createdAt: string;
  updatedAt: string;
};
