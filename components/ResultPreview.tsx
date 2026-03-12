"use client";

import { GenerationStatus } from "@/types";

interface ResultPreviewProps {
  status: GenerationStatus;
  imageUrl: string | null;
  error: string | null;
  onDownload: () => void;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6 py-12">
      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Your mockup will appear here</p>
        <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
          Upload a design and select a model style to generate your product mockup
        </p>
      </div>

      {/* Visual steps */}
      <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">
            1
          </span>
          Upload
        </span>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="flex items-center gap-1">
          <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">
            2
          </span>
          Select
        </span>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="flex items-center gap-1">
          <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">
            3
          </span>
          Generate
        </span>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-6 py-12">
      {/* Animated spinner rings */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
        <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-brand-200 border-b-transparent animate-spin-slow" />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700 animate-pulse-soft">
          Generating your mockup...
        </p>
        <p className="text-xs text-gray-400 mt-1">This usually takes 30–60 seconds</p>
      </div>

      {/* Skeleton placeholder */}
      <div className="w-full max-w-[280px] space-y-2 opacity-30">
        <div className="h-3 bg-gray-200 rounded-full w-3/4 mx-auto animate-pulse" />
        <div className="h-3 bg-gray-200 rounded-full w-1/2 mx-auto animate-pulse" />
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6 py-12">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">Generation failed</p>
        <p className="text-xs text-gray-500 mt-1 max-w-[260px] leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

export default function ResultPreview({
  status,
  imageUrl,
  error,
  onDownload,
}: ResultPreviewProps) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Result
        </h2>
        {status === "success" && imageUrl && (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Ready
          </span>
        )}
      </div>

      {/* Result panel */}
      <div className="flex-1 rounded-xl border border-gray-200 bg-white overflow-hidden min-h-[400px] flex flex-col">
        {status === "idle" && <EmptyState />}
        {status === "loading" && <LoadingState />}
        {status === "error" && <ErrorState message={error ?? "Unknown error occurred."} />}

        {status === "success" && imageUrl && (
          <div className="flex flex-col flex-1">
            {/* Image */}
            <div className="flex-1 relative bg-gray-50 flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Generated T-shirt mockup"
                className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm"
              />
            </div>

            {/* Download bar */}
            <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between bg-gray-50">
              <p className="text-xs text-gray-500">1024 × 1024 · PNG</p>
              <button
                onClick={onDownload}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
