import { BrandModel } from "@/types";

export const BRAND_MODELS: BrandModel[] = [
  {
    id: "model-1-female",
    label: "Style 1",
    style: "Oversized Street Look",
    description:
      "Female model in an oversized white graphic tee with shades and dark cargo pants, shot against a clean white background.",
    thumbnail: "/models/model_1-female.jpg",
    accentColor: "#2C2C2C",
    tags: ["oversized", "street", "graphic"],
    gender: "female",
  },
  {
    id: "model-1-male",
    label: "Style 1",
    style: "Varsity Street Look",
    description:
      "Male model in a black jersey tee with olive cargo pants and shades, shot against a clean white background.",
    thumbnail: "/models/model_1-male.jpg",
    accentColor: "#2C2C2C",
    tags: ["varsity", "street", "urban"],
    gender: "male",
  },
  {
    id: "model-2-female",
    label: "Style 2",
    style: "Casual Pop Culture Tee",
    description:
      "Female model in a brown oversized tee against a vivid red background. Ideal for colorful illustration and pop-culture prints.",
    thumbnail: "/models/model_2-female.jpg",
    accentColor: "#7B3F00",
    tags: ["casual", "colorful", "pop-culture"],
    gender: "female",
  },
  {
    id: "model-2-male",
    label: "Style 2",
    style: "Relaxed Casual Look",
    description:
      "Male model in a rust-toned mesh tee with denim shorts, shot against a neutral background. Great for laid-back graphic prints.",
    thumbnail: "/models/model_2-male.jpg",
    accentColor: "#8B4513",
    tags: ["casual", "relaxed", "streetwear"],
    gender: "male",
  },
  {
    id: "model-3-female",
    label: "Style 3",
    style: "Edgy Dark Aesthetic",
    description:
      "Female model seated in a black oversized tee with sunglasses against a deep teal background. Perfect for bold and artistic designs.",
    thumbnail: "/models/model_3-female.jpg",
    accentColor: "#1A6B72",
    tags: ["dark", "edgy", "artistic"],
    gender: "female",
  },
  {
    id: "model-3-male",
    label: "Style 3",
    style: "Clean Minimal Editorial",
    description:
      "Male model in a plain black oversized tee with dark jeans, shot against a neutral background. Perfect for clean, minimal designs.",
    thumbnail: "/models/model_3-male.jpg",
    accentColor: "#1A1A1A",
    tags: ["minimal", "editorial", "clean"],
    gender: "male",
  },
];

// Prompt used for all models -- passed to OpenAI images.edit server-side
export const SHARED_PROMPT = `
You are given two images:
- IMAGE 1: A photograph of a model. This is the canvas. Edit this image by replacing the model's t-shirt with the t-shirt from IMAGE 2.
- IMAGE 2: The t-shirt design to copy. This is the source of truth. Every detail, color, graphic, text, and shirt color in this image must be reproduced exactly.

This is a professional photo retouching task on an existing real photograph -- not an image generation task. Do not generate a new image. Do not redraw any part of the scene. Edit only what is explicitly specified below.

STEP 1 -- ERASE THE ORIGINAL SHIRT DESIGN:
Before placing any new design, erase every existing graphic, logo, pattern, illustration, text, print, and decoration from the model's shirt in IMAGE 1. The shirt must become completely plain and blank -- a single solid color with no remnant of any prior design element. Preserve the shirt's fabric texture, folds, wrinkles, creases, lighting, shadows, and fit exactly as they appear in IMAGE 1. Only the surface decoration is removed; the physical shirt remains unchanged.

STEP 2 -- APPLY THE UPLOADED DESIGN:
Once the shirt is blank, place the uploaded t-shirt design from IMAGE 2 onto the shirt. Blend it naturally with the shirt's existing folds, lighting, shadows, and perspective so it appears realistically screen-printed on the fabric.

WHAT TO CHANGE:
Replace the entire surface decoration of the t-shirt worn by the model in IMAGE 1 with the t-shirt design shown in IMAGE 2. Every single detail of the output shirt -- color, graphic, text, print, pattern, and overall appearance -- must come EXCLUSIVELY from IMAGE 2. Do not carry over, blend, or retain ANY design detail from the model's original shirt in IMAGE 1. The original shirt's design in IMAGE 1 is completely erased before the new design is applied. Do not approximate, summarize, or reinterpret IMAGE 2 -- copy it exactly and completely.

CRITICAL -- SHIRT SOURCE RULE:
The output shirt must look like IMAGE 2's shirt worn by the model in IMAGE 1's pose and lighting. It must NOT look like IMAGE 1's shirt with IMAGE 2's design applied on top. Every shirt detail -- base color, fabric color, graphic, text, print, logo, and pattern -- must come solely from IMAGE 2. Nothing from IMAGE 1's shirt design should remain in the output.

WHAT MUST NOT CHANGE (preserve pixel-perfectly):
- The model's face, skin tone, eyes, lips, expression, and all facial features
- The model's hair color, texture, hairline, and any hair accessories
- The model's hands, fingers, fingernails, arms, elbows, neck, and body proportions
- The model's exact pose, stance, and body posture
- All clothing other than the shirt (pants, shoes, socks, belt, accessories, jewelry, outerwear, hats)
- The background -- its color, tone, texture, gradients, depth, and any environmental or studio elements
- The scene's lighting direction, softness, intensity, and color temperature
- All existing shadows cast by the model onto the background
- The camera framing, crop, angle, focal length, and perspective
- The photo's overall exposure, contrast, white balance, saturation, and color grading
- Any lens distortion, vignetting, or optical characteristics present in the original photo
- Any motion blur, depth-of-field blur, or focus falloff present in the original photo

FABRIC COMPOSITING RULES:
- The design must behave exactly as real screen-printed ink on fabric -- nothing more, nothing less
- Ink sits directly on the surface of the fabric fibers; it does not float above, glow, or emit light
- The design must conform to every wrinkle, fold, crease, gather, stretch, and surface irregularity on the shirt
- Where the fabric curves away from the camera (torso curvature, chest roundness), the design must follow that three-dimensional curvature in full perspective
- The existing directional light and shadow already on the shirt must pass over the design -- the design inherits them and does not create its own lighting
- Deep wrinkle valleys must appear darker over the printed design, consistent with the ambient occlusion already present on the shirt
- Raised fabric areas must appear slightly brighter over the design, consistent with the highlights already present on the shirt
- Specular highlights on the fabric must appear on top of and over the printed design area
- On dark-colored shirts, white and light-colored elements of the design render as opaque ink; on light-colored shirts, dark ink may show very slight fabric undertone bleed consistent with real screen printing
- Ink colors must appear slightly muted and fabric-absorbed compared to their values on a backlit digital screen -- this is the correct appearance of real printed ink
- The edges of the print must have the subtle natural diffusion of real screen-print ink registration -- not perfectly sharp vector edges, not blurry smears
- For textured or mesh fabrics, ink visually integrates into the weave pattern of the fabric
- Transparent or empty areas of the design must reveal the shirt's base color beneath them -- not white, not black, but the actual shirt color
- The design must not be tiled, repeated, or duplicated; it is applied once as a single unified print
- The design's original aspect ratio must be preserved exactly -- do not stretch or compress it

SHADOW AND OCCLUSION:
- Any shadows cast by the model's arms, hands, or body onto the shirt must remain visible over the printed design
- Shadows cast by the shirt collar or neckline onto the upper chest area must remain visible over the top of the print
- The printed design does not cast any shadows of its own onto the fabric

PLACEMENT AND SCALE:
- Position the design in a standard front chest-print location, horizontally centered on the shirt
- Scale proportionally to a realistic DTG or screen-print size as seen in real-world fashion photography
- The design must not extend beyond the printable surface of the shirt front, and must not overlap sleeves, collar, or seams

DESIGN INTEGRITY (reproduce the uploaded design with zero deviation):
- Reproduce every color in the uploaded design exactly -- do not shift, correct, warm, cool, saturate, or desaturate any color value
- Reproduce every shape, outline, and silhouette in the design exactly -- do not smooth, simplify, round, or distort any edges
- Reproduce all typography exactly -- every font, weight, size, spacing, kerning, and letter form must match the original design precisely
- Preserve all spatial relationships between design elements -- the layout, alignment, and relative positioning of every element must match the original
- Preserve the proportional size relationships between all elements within the design -- nothing scaled up or down relative to other parts
- Reproduce the exact outer boundary and silhouette of the entire design
- Preserve all negative space -- empty or transparent areas within the design must remain exactly as they are in the original
- Reproduce all line weights exactly -- do not thin or thicken any strokes in the design
- Reproduce all gradients exactly -- direction, color stops, and spread must match the original
- Reproduce all patterns and internal textures within the design exactly -- do not substitute or approximate them
- Render semi-transparent and partially opaque areas of the design correctly -- transparency levels must match the original
- Preserve the correct stacking and layering order of all overlapping design elements
- Do not simplify or merge complex or highly detailed areas of the design -- reproduce fine detail fully
- Do not apply any artistic filter, painterly effect, illustration style, or visual treatment to the design
- Do not color-grade or tone-match the design's colors to match the photo's overall color grade -- the design's colors are independent
- Do not crop, clip, or cut off any part of the design -- the entire design must be fully visible
- Do not rotate the design -- it must be applied perfectly upright as it appears in the original upload
- Do not mirror, flip horizontally, or flip vertically any part of the design
- Preserve fine details at print scale -- small text, thin lines, and intricate elements must remain sharp and legible
- If the design contains multiple elements, all must appear together as one complete, unified graphic -- no element may be omitted or displaced
- Reproduce all logos, icons, symbols, and brand marks in the design with exact fidelity -- no reinterpretation
- The design must be complete -- no element from the uploaded design may be missing, partially rendered, or faded
- Internal boundaries between distinct color areas in the design must remain crisp -- colors must not bleed into each other
- Render the design at full artwork resolution -- it must not appear pixelated, blurry, or lossy
- Do not reinterpret, improve, enhance, or creatively modify the design concept in any way -- reproduce it literally as provided
- Reproduce all figurative or illustrative content in the design literally -- characters, scenes, objects must appear exactly as drawn
- The design must be oriented right-side up as it would be read when the shirt is worn normally
- Do not add any element, mark, pattern, texture, or graphic that is not present in the uploaded design
- Do not remove, hide, or omit any element, mark, or detail that is present in the uploaded design
- Treat the uploaded design as the single authoritative source of truth -- every pixel of the design that should be visible must be rendered with exact fidelity
- Solid fill areas of the design must appear uniformly filled with consistent ink density -- no patchy, uneven, or faded coverage in any region
- Each distinct color in the design must remain fully isolated -- no color contamination, bleeding, or mixing between adjacent color areas caused by compositing
- If the design includes halftone patterns, dot screens, or fine repeating patterns, reproduce them accurately at their correct frequency and angle
- No design content may be clipped or hidden due to incorrect margin or boundary assumptions -- the full artwork is always fully visible
- All icons and pictograms in the design must match the original exactly, including all internal cutouts, holes, and counter-spaces
- Do not add any watermark, credit mark, print registration mark, or any extraneous mark not present in the original uploaded design
- The overall visual weight and tonal density of the design -- how dark or light it reads as a whole -- must match the original
- All text in the design must remain fully legible at print scale -- no character may be distorted, merged with adjacent characters, or rendered unreadable
- All gaps, gutters, and margins between elements within the design must be preserved at their exact proportions
- If any part of the design is symmetrical, that symmetry must be maintained with exact precision -- no drift or asymmetry introduced
- The visual hierarchy of the design -- which elements are dominant, which are secondary -- must exactly reflect the original artwork's intent
- Do not reduce the number of distinct colors in the design through posterization, color quantization, or any simplification process
- If the design contains embedded photographic or raster imagery, reproduce it at full fidelity with no additional compression or degradation
- If any text or shape in the design has an outline stroke, that stroke must be reproduced at the correct weight, color, and position
- Any drop shadows, inner shadows, glows, or graphic effects that are part of the design artwork itself must be reproduced exactly as they appear in the upload
- Do not stretch or distort the design to fill a target area -- always place it at its natural proportions
- If the design contains a defined background shape such as a badge, frame, banner, or container, that boundary must be reproduced exactly
- Do not invent, hallucinate, or extrapolate any design detail, element, or area not explicitly visible in the uploaded artwork -- render only what is there
- The final rendered design on the shirt must be verifiably identical in content, color, and composition to the uploaded design, as if photographed directly off the fabric

FINAL OUTPUT QUALITY:
- The final image must exactly match the original photo's resolution, noise level, film grain, JPEG compression character, and overall rendering style
- Noise and grain must be uniformly distributed across the entire image -- including over the composited print area -- with zero visible seam, mask edge, or transition boundary between the original photo and the composited area
- Do not sharpen, smooth, upscale, denoise, or color-correct any part of the image
- The result must be completely photorealistic and indistinguishable from a real photograph of a person wearing a shirt with that design printed on it
- A professional retoucher examining the image at full resolution must not be able to detect any digital compositing was performed
`.trim();