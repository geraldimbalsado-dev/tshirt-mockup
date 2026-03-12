"use client";

import Image from "next/image";
import { useState } from "react";
import { BrandModel, Gender, ModelId } from "@/types";
import { BRAND_MODELS } from "@/lib/models";

interface ModelPickerProps {
  selectedModel: ModelId | null;
  onSelect: (id: ModelId) => void;
}

function ModelCard({
  model,
  isSelected,
  onSelect,
}: {
  model: BrandModel;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative flex flex-col rounded-xl overflow-hidden border-2 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 group
        ${
          isSelected
            ? "border-brand-500 shadow-md shadow-brand-100 scale-[1.02]"
            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
        }
      `}
      aria-pressed={isSelected}
      aria-label={`Select ${model.style}`}
    >
      {/* Thumbnail */}
      <div className="relative bg-gray-100 aspect-[3/4] overflow-hidden">
        <Image
          src={model.thumbnail}
          alt={model.style}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 30vw, 160px"
        />
        {/* Selected overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-brand-500/10 flex items-start justify-end p-2">
            <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center shadow">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 bg-white flex-1">
        <p className="text-xs font-semibold text-gray-800 leading-tight">{model.label}</p>
        <p
          className="text-[10px] font-medium mt-0.5 leading-tight"
          style={{ color: model.accentColor }}
        >
          {model.style}
        </p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {model.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full capitalize"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

export default function ModelPicker({ selectedModel, onSelect }: ModelPickerProps) {
  const [activeGender, setActiveGender] = useState<Gender>("female");

  const filtered = BRAND_MODELS.filter((m) => m.gender === activeGender);
  const selected = BRAND_MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Step 2 — Choose Model Style
      </h2>

      {/* Gender tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(["female", "male"] as Gender[]).map((g) => (
          <button
            key={g}
            onClick={() => setActiveGender(g)}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${
              activeGender === g
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Model cards */}
      <div className="grid grid-cols-3 gap-3">
        {filtered.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            isSelected={selectedModel === model.id}
            onSelect={() => onSelect(model.id)}
          />
        ))}
      </div>

      {/* Description of selected model */}
      {selected && (
        <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-700">{selected.style}:</span>{" "}
            {selected.description}
          </p>
        </div>
      )}
    </div>
  );
}