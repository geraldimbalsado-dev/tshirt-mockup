import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { BRAND_MODELS, SHARED_PROMPT } from "@/lib/models";
import { GenerateRequestBody, AcceptedMimeType } from "@/types";
import { promises as fsp } from "fs";
import path from "path";

// Initialize OpenAI client -- API key is kept server-side only
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 0, // disable silent retries; surface failures immediately
});

// Derive valid IDs and photo filenames from BRAND_MODELS -- single source of truth
const VALID_MODEL_IDS = BRAND_MODELS.map((m) => m.id);
const MODEL_PHOTOS: Record<string, string> = Object.fromEntries(
  BRAND_MODELS.map((m) => [m.id, m.thumbnail.replace("/models/", "")])
);

const ACCEPTED_MIME_TYPES: AcceptedMimeType[] = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
];

const MAX_BASE64_CHARS = 15 * 1024 * 1024; // ~11MB decoded -- matches 10MB client limit

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<GenerateRequestBody>;
    const { designBase64, designMimeType, modelId } = body;

    // Validate required fields with type narrowing
    if (
      typeof designBase64 !== "string" ||
      typeof designMimeType !== "string" ||
      typeof modelId !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields." },
        { status: 400 }
      );
    }

    if (!ACCEPTED_MIME_TYPES.includes(designMimeType as AcceptedMimeType)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PNG, JPG, WEBP, or GIF." },
        { status: 400 }
      );
    }

    if (!VALID_MODEL_IDS.includes(modelId as never)) {
      return NextResponse.json({ error: "Invalid modelId provided." }, { status: 400 });
    }

    if (designBase64.length > MAX_BASE64_CHARS) {
      return NextResponse.json(
        { error: "Design image is too large. Please upload an image under 10MB." },
        { status: 400 }
      );
    }

    // Load the selected model photo from disk as the base image
    const photoFilename = MODEL_PHOTOS[modelId];
    const modelPhotoPath = path.join(process.cwd(), "public", "models", photoFilename);

    let modelPhotoBuffer: Buffer;
    try {
      modelPhotoBuffer = await fsp.readFile(modelPhotoPath);
    } catch {
      return NextResponse.json(
        { error: "Model photo not found on server. Please contact support." },
        { status: 500 }
      );
    }

    const modelPhotoFile = await toFile(modelPhotoBuffer, photoFilename, { type: "image/jpeg" });

    // Convert uploaded design base64 to a File
    const imageBuffer = Buffer.from(designBase64, "base64");
    const ext = mimeToExt(designMimeType as AcceptedMimeType);
    const designFile = await toFile(imageBuffer, `design.${ext}`, { type: designMimeType });

    // Send design first so it gets treated as the primary reference, model photo second as the canvas to edit
    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: [designFile, modelPhotoFile],
      prompt: SHARED_PROMPT,
      n: 1,
      size: "1024x1024",
    });

    const imageData = response.data?.[0];

    if (!imageData) {
      return NextResponse.json(
        { error: "No image returned from OpenAI. Please try again." },
        { status: 502 }
      );
    }

    if (!imageData.b64_json) {
      return NextResponse.json(
        { error: "Unexpected response format from OpenAI." },
        { status: 502 }
      );
    }

    return NextResponse.json({ imageUrl: `data:image/png;base64,${imageData.b64_json}` });
  } catch (err) {
    console.error("[/api/generate] Error:", err);

    if (err instanceof OpenAI.APIError) {
      const message = parseOpenAIError(err);
      // Never forward 401 details to the client -- it leaks server config state
      const status = err.status === 401 ? 500 : (err.status ?? 500);
      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// Map accepted MIME type to file extension
function mimeToExt(mime: AcceptedMimeType): string {
  const map: Record<AcceptedMimeType, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[mime];
}

// Parse OpenAI API errors into user-friendly messages
function parseOpenAIError(err: InstanceType<typeof OpenAI.APIError>): string {
  if (err.status === 401) return "Image generation is temporarily unavailable. Please try again later.";
  if (err.status === 429) return "OpenAI rate limit reached. Please wait a moment and try again.";
  if (err.status === 400) {
    const msg = err.message?.toLowerCase() ?? "";
    if (msg.includes("content policy") || msg.includes("safety"))
      return "The design or prompt was flagged by OpenAI content policy. Please try a different design.";
    if (msg.includes("size") || msg.includes("resolution"))
      return "Image size or format not supported. Try a PNG under 4MB.";
    return `Bad request: ${err.message}`;
  }
  if (err.status === 503) return "OpenAI service is temporarily unavailable. Please try again.";
  return err.message ?? "OpenAI API error. Please try again.";
}