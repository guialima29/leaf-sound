import type { OutputData } from "@editorjs/editorjs";

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Section {
  id: string;
  workspaceId: string;
  name: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface WorkspaceNote {
  id: string;
  workspaceId: string;
  sectionId?: string | null; // null/undefined = raiz da workspace (sem seção)
  title: string;
  description?: string;
  content?: OutputData;
  order?: number;
  isFavorite?: boolean;
  createdAt: number;
  updatedAt: number;
  lastUpdateDate: string;
  lastUpdateTime: string;
  href: string;
}

