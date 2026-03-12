export type ModelId =
  | "model-1-female"
  | "model-1-male"
  | "model-2-female"
  | "model-2-male"
  | "model-3-female"
  | "model-3-male";

export type Gender = "female" | "male";

export interface BrandModel {
  id: ModelId;
  label: string;
  style: string;
  description: string;
  thumbnail: string;
  accentColor: string;
  tags: string[];
  gender: Gender;
}

export type GenerationStatus = "idle" | "loading" | "success" | "error";

export interface GenerationResult {
  imageUrl: string;
  revisedPrompt?: string;
}

export interface GenerateRequestBody {
  designBase64: string;
  designMimeType: string;
  modelId: ModelId;
}

export interface GenerateApiResponse {
  imageUrl?: string;
  error?: string;
}