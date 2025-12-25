export type AudienceType = "cold_leads" | "customers" | "investors" | "custom";

export interface ProjectColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface ProjectFonts {
  heading: string;
  body: string;
}

export interface SlideContent {
  id: string;
  type: SlideType;
  data: Record<string, unknown>;
}

export type SlideType =
  | "title"
  | "content"
  | "image"
  | "stats"
  | "team"
  | "quote"
  | "comparison"
  | "cta";

export interface TitleSlideData {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export interface ContentSlideData {
  title: string;
  bullets: string[];
  image?: string;
  imagePosition?: "left" | "right";
}

export interface ImageSlideData {
  title?: string;
  imageUrl: string;
  caption?: string;
}

export interface StatsSlideData {
  title: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
}

export interface TeamSlideData {
  title: string;
  members: Array<{
    name: string;
    role: string;
    image?: string;
    linkedin?: string;
  }>;
}

export interface QuoteSlideData {
  quote: string;
  author: string;
  role?: string;
  company?: string;
}

export interface ComparisonSlideData {
  title: string;
  left: {
    label: string;
    items: string[];
  };
  right: {
    label: string;
    items: string[];
  };
}

export interface CTASlideData {
  title: string;
  description?: string;
  buttonText: string;
  buttonUrl?: string;
  contactEmail?: string;
}

export interface DeckTheme {
  colors: Partial<ProjectColors>;
  fonts: Partial<ProjectFonts>;
}
