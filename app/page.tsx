"use client";

import { useCallback, useState } from "react";
import DesignUploader from "@/components/DesignUploader";
import ModelPicker from "@/components/ModelPicker";
import ResultPreview from "@/components/ResultPreview";
import ActionControls from "@/components/ActionControls";
import { GenerationStatus, ModelId } from "@/types";

export default function HomePage() {
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelId | null>(null);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection from the uploader
  const handleFileSelect = useCallback((file: File) => {
    setDesignFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // Reset any previous result when a new design is uploaded
    setResultUrl(null);
    setStatus("idle");
    setError(null);
  }, []);

  // Clear the uploaded design
  const handleClear = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setDesignFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setStatus("idle");
    setError(null);
  }, [previewUrl]);

  // Main generation handler — converts file to base64, calls the API route
  const handleGenerate = useCallback(async () => {
    if (!designFile || !selectedModel) return;

    setStatus("loading");
    setError(null);
    setResultUrl(null);

    try {
      // Convert the uploaded image to base64
      const base64 = await fileToBase64(designFile);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designBase64: base64,
          designMimeType: designFile.type,
          modelId: selectedModel,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error ?? "Failed to generate mockup. Please try again.");
      }

      setResultUrl(data.imageUrl);
      setStatus("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setStatus("error");
    }
  }, [designFile, selectedModel]);

  // Download the generated image
  const handleDownload = useCallback(async () => {
    if (!resultUrl) return;
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tshirt-mockup-${selectedModel ?? "result"}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab if direct download fails (e.g. CORS)
      window.open(resultUrl, "_blank");
    }
  }, [resultUrl, selectedModel]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-none">
                T-Shirt Mockup Generator
              </h1>
              <p className="text-[10px] text-gray-500 mt-0.5">Powered by AI</p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Ready to generate
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Page intro */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create your product mockup
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
            Upload your design, pick a brand model style, and generate a
            professional-grade apparel photo in seconds.
          </p>
        </div>

        {/* Two-column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left panel — inputs */}
          <div className="flex flex-col gap-8">
            {/* Design uploader */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <DesignUploader
                onFileSelect={handleFileSelect}
                previewUrl={previewUrl}
                onClear={handleClear}
              />
            </div>

            {/* Model picker */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <ModelPicker selectedModel={selectedModel} onSelect={setSelectedModel} />
            </div>

            {/* Action controls */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <ActionControls
                hasDesign={designFile !== null}
                selectedModel={selectedModel}
                status={status}
                onGenerate={handleGenerate}
              />
            </div>
          </div>

          {/* Right panel — result */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <ResultPreview
                status={status}
                imageUrl={resultUrl}
                error={error}
                onDownload={handleDownload}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 mt-8">
        <p className="text-center text-xs text-gray-400">
          Generated images are for commercial use. Ensure your design complies with applicable
          rights.
        </p>
      </footer>
    </div>
  );
}

// Utility: convert File to base64 data string (without the data URL prefix)
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the "data:image/...;base64," prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
