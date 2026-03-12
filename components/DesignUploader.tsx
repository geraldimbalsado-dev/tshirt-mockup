"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface DesignUploaderProps {
  onFileSelect: (file: File) => void;
  previewUrl: string | null;
  onClear: () => void;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE_MB = 10;

export default function DesignUploader({
  onFileSelect,
  previewUrl,
  onClear,
}: DesignUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Prevent browser from opening dropped files as a new tab (document-level)
  useEffect(() => {
    const prevent = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener("dragover", prevent);
    document.addEventListener("drop", prevent);
    return () => {
      document.removeEventListener("dragover", prevent);
      document.removeEventListener("drop", prevent);
    };
  }, []);

  const validate = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Unsupported format. Please upload PNG, JPG, WEBP, or GIF.";
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File too large. Max size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setError(null);
    dragCounter.current = 0;
    if (inputRef.current) inputRef.current.value = "";
    onClear();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Step 1 - Upload Design
        </h2>
        {previewUrl && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square flex items-center justify-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Uploaded design preview"
            className="max-w-full max-h-full object-contain p-4"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => { setError(null); inputRef.current?.click(); }}
              className="bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Replace Image
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="design-upload"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={[
            "relative rounded-xl border-2 border-dashed aspect-square flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 select-none outline-none",
            "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
            isDragging
              ? "border-brand-500 bg-brand-50 scale-[1.01]"
              : "border-gray-300 bg-gray-50 hover:border-brand-400 hover:bg-brand-50",
          ].join(" ")}
        >
          <div
            className={[
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors pointer-events-none",
              isDragging ? "bg-brand-100" : "bg-gray-200",
            ].join(" ")}
          >
            <svg
              className={["w-6 h-6", isDragging ? "text-brand-600" : "text-gray-500"].join(" ")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="text-center px-4 pointer-events-none">
            <p className="text-sm font-medium text-gray-700">
              {isDragging ? "Drop your design here" : "Click or drag your design"}
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, GIF — max 10MB</p>
          </div>
        </label>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        id="design-upload"
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleChange}
        className="sr-only"
        aria-label="Upload design image"
      />
    </div>
  );
}
