import axios from 'axios';
import type { SlideType } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add user ID header from Clerk
export function setAuthHeader(userId: string) {
  api.defaults.headers.common['x-user-id'] = userId;
}

// Projects API
export const projectsApi = {
  getAll: () => api.get('/projects'),
  getOne: (id: string) => api.get(`/projects/${id}`),
  create: (data: CreateProjectInput) => api.post('/projects', data),
  update: (id: string, data: UpdateProjectInput) => api.patch(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Decks API
export const decksApi = {
  getByProject: (projectId: string) => api.get(`/decks?projectId=${projectId}`),
  getOne: (id: string) => api.get(`/decks/${id}`),
  getPublic: (slug: string) => api.get(`/decks/public/${slug}`),
  create: (data: CreateDeckInput) => api.post('/decks', data),
  update: (id: string, data: UpdateDeckInput) => api.patch(`/decks/${id}`, data),
  delete: (id: string) => api.delete(`/decks/${id}`),
};

// Branding API
export const brandingApi = {
  extract: (url: string) => api.post('/branding/extract', { url }),
};

// Types
export interface ProjectColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
}

export interface ProjectFonts {
  heading?: string;
  body?: string;
}

export interface Project {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  websiteUrl?: string;
  logo?: string;
  colors?: ProjectColors;
  fonts?: ProjectFonts;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  websiteUrl?: string;
  logo?: string;
  colors?: ProjectColors;
  fonts?: ProjectFonts;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}

export interface SlideContent {
  id: string;
  type: SlideType;
  data: Record<string, unknown>;
}

export interface Deck {
  _id: string;
  projectId: string;
  title: string;
  slug: string;
  audienceType: 'cold_leads' | 'customers' | 'investors' | 'custom';
  slides: SlideContent[];
  theme?: {
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeckInput {
  projectId: string;
  title: string;
  audienceType: 'cold_leads' | 'customers' | 'investors' | 'custom';
  slides?: SlideContent[];
  theme?: Deck['theme'];
  isPublic?: boolean;
}

export interface UpdateDeckInput extends Partial<Omit<CreateDeckInput, 'projectId'>> {}

export interface ExtractedBranding {
  logo?: string;
  colors: ProjectColors;
  fonts: ProjectFonts;
  metadata: {
    title?: string;
    description?: string;
    favicon?: string;
  };
}
