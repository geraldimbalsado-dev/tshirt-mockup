"use client";

import { GenerationStatus, ModelId } from "@/types";

interface ActionControlsProps {
  hasDesign: boolean;
  selectedModel: ModelId | null;
  status: GenerationStatus;
  onGenerate: () => void;
}

export default function ActionControls({
  hasDesign,
  selectedModel,
  status,
  onGenerate,
}: ActionControlsProps) {
  const isLoading = status === "loading";
  const canGenerate = hasDesign && selectedModel !== null && !isLoading;

  const getMissingLabel = () => {
    if (!hasDesign && !selectedModel) return "Upload a design and select a model style";
    if (!hasDesign) return "Upload a design to continue";
    if (!selectedModel) return "Select a model style to continue";
    return null;
  };

  const missingLabel = getMissingLabel();

  return (
    <div className="flex flex-col gap-3">
      {/* Checklist */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className={`flex items-center gap-1.5 ${hasDesign ? "text-green-600" : ""}`}>
          <span
            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
              hasDesign ? "bg-green-500 border-green-500" : "border-gray-300"
            }`}
          >
            {hasDesign && (
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
          Design uploaded
        </span>

        <span
          className={`flex items-center gap-1.5 ${selectedModel ? "text-green-600" : ""}`}
        >
          <span
            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
              selectedModel ? "bg-green-500 border-green-500" : "border-gray-300"
            }`}
          >
            {selectedModel && (
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
          Model selected
        </span>
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={!canGenerate}
        className={`
          relative w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2.5
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
          ${
            canGenerate
              ? "bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white shadow-md shadow-brand-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        {isLoading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Generating Mockup...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Generate Mockup
          </>
        )}
      </button>

      {/* Helper hint */}
      {missingLabel && !isLoading && (
        <p className="text-xs text-center text-gray-400">{missingLabel}</p>
      )}
    </div>
  );
}
