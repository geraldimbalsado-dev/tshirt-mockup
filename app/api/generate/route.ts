import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { SHARED_PROMPT } from "@/lib/models";
import { GenerateRequestBody, ModelId } from "@/types";
import fs from "fs";
import path from "path";

// Initialize OpenAI client — API key is kept server-side only
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VALID_MODEL_IDS: ModelId[] = [
  "model-1-female",
  "model-1-male",
  "model-2-female",
  "model-2-male",
  "model-3-female",
  "model-3-male",
];
const MAX_BASE64_BYTES = 15 * 1024 * 1024; // 15MB base64 upper bound

const MODEL_PHOTOS: Record<ModelId, string> = {
  "model-1-female": "model_1-female.jpg",
  "model-1-male":   "model_1-male.jpg",
  "model-2-female": "model_2-female.jpg",
  "model-2-male":   "model_2-male.jpg",
  "model-3-female": "model_3-female.jpg",
  "model-3-male":   "model_3-male.jpg",
};

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: GenerateRequestBody = await request.json();
    const { designBase64, designMimeType, modelId } = body;

    if (!designBase64 || !designMimeType || !modelId) {
      return NextResponse.json(
        { error: "Missing required fields: designBase64, designMimeType, modelId" },
        { status: 400 }
      );
    }

    if (!VALID_MODEL_IDS.includes(modelId)) {
      return NextResponse.json({ error: "Invalid modelId provided." }, { status: 400 });
    }

    if (designBase64.length > MAX_BASE64_BYTES) {
      return NextResponse.json(
        { error: "Design image is too large. Please upload an image under 10MB." },
        { status: 400 }
      );
    }

    // Load the selected model photo from disk as the base image
    const modelPhotoPath = path.join(process.cwd(), "public", "models", MODEL_PHOTOS[modelId]);
    const modelPhotoBuffer = fs.readFileSync(modelPhotoPath);
    const modelPhotoFile = await toFile(modelPhotoBuffer, MODEL_PHOTOS[modelId], { type: "image/jpeg" });

    // Convert uploaded design base64 to a File
    const imageBuffer = Buffer.from(designBase64, "base64");
    const ext = mimeToExt(designMimeType);
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

    // gpt-image-1 returns base64 by default — convert to a data URL for the client
    // If a URL is returned instead (dall-e-3 behaviour), pass it through directly.
    let imageUrl: string;

    if (imageData.b64_json) {
      imageUrl = `data:image/png;base64,${imageData.b64_json}`;
    } else if (imageData.url) {
      imageUrl = imageData.url;
    } else {
      return NextResponse.json(
        { error: "Unexpected response format from OpenAI." },
        { status: 502 }
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error("[/api/generate] Error:", err);

    // Surface meaningful OpenAI API errors to the client
    if (err instanceof OpenAI.APIError) {
      const message = parseOpenAIError(err);
      return NextResponse.json({ error: message }, { status: err.status ?? 500 });
    }

    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// Map MIME type to a safe file extension
function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[mime] ?? "png";
}

// Parse OpenAI API errors into user-friendly messages
function parseOpenAIError(err: InstanceType<typeof OpenAI.APIError>): string {
  if (err.status === 401) return "Invalid OpenAI API key. Check your OPENAI_API_KEY.";
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