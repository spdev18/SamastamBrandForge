export interface RequirementForm {
  businessName: string;
  industry: string;
  description: string;
  brandColors: string;
  targetAudience: string;
  tagline: string;
  platform: string;
}

export interface GeneratedAssets {
  logo: string | null;
  poster: string | null;
  videoScript: string | null;
  videoUrl: string | null;
  logoPrompt?: string;
  posterPrompt?: string;
}

export type GenerationStatus =
  | "idle"
  | "analyzing"
  | "logo"
  | "poster"
  | "script"
  | "video"
  | "done"
  | "error";
