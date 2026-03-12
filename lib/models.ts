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

// Prompt used for all models — passed to OpenAI images.edit server-side
export const SHARED_PROMPT = `
This is a professional photo retouching task on an existing real photograph — not an image generation task. Do not generate a new image. Do not redraw any part of the scene. Edit only what is explicitly specified below.

WHAT TO CHANGE:
Replace the existing graphic printed on the front of the t-shirt with the design provided in the second image. Reproduce the uploaded design faithfully — do not simplify, stylize, reinterpret, rescale disproportionately, or alter its colors, shapes, layout, or composition in any way.

WHAT MUST NOT CHANGE (preserve pixel-perfectly):
- The model's face, skin tone, eyes, lips, expression, and all facial features
- The model's hair color, texture, hairline, and any hair accessories
- The model's hands, fingers, fingernails, arms, elbows, neck, and body proportions
- The model's exact pose, stance, and body posture
- All clothing other than the shirt's graphic area (pants, shoes, socks, belt, accessories, jewelry, outerwear, hats)
- The shirt's base color, fabric texture, shape, cut, collar style, sleeve length, hem, cuffs, and all seam lines
- The background — its color, tone, texture, gradients, depth, and any environmental or studio elements
- The scene's lighting direction, softness, intensity, and color temperature
- All existing shadows cast by the model onto the background and onto the shirt itself
- All existing highlights, reflections, and specularity on the shirt fabric
- The camera framing, crop, angle, focal length, and perspective
- The photo's overall exposure, contrast, white balance, saturation, and color grading
- Any lens distortion, vignetting, or optical characteristics present in the original photo
- Any motion blur, depth-of-field blur, or focus falloff present in the original photo

FABRIC COMPOSITING RULES:
- The design must behave exactly as real screen-printed ink on fabric — nothing more, nothing less
- Ink sits directly on the surface of the fabric fibers; it does not float above, glow, or emit light
- The design must conform to every wrinkle, fold, crease, gather, stretch, and surface irregularity on the shirt
- Where the fabric curves away from the camera (torso curvature, chest roundness), the design must follow that three-dimensional curvature in full perspective
- The existing directional light and shadow already on the shirt must pass over the design — the design inherits them and does not create its own lighting
- Deep wrinkle valleys must appear darker over the printed design, consistent with the ambient occlusion already present on the shirt
- Raised fabric areas must appear slightly brighter over the design, consistent with the highlights already present on the shirt
- Specular highlights on the fabric must appear on top of and over the printed design area
- On dark-colored shirts, white and light-colored elements of the design render as opaque ink; on light-colored shirts, dark ink may show very slight fabric undertone bleed consistent with real screen printing
- Ink colors must appear slightly muted and fabric-absorbed compared to their values on a backlit digital screen — this is the correct appearance of real printed ink
- The edges of the print must have the subtle natural diffusion of real screen-print ink registration — not perfectly sharp vector edges, not blurry smears
- For textured or mesh fabrics, ink visually integrates into the weave pattern of the fabric
- Transparent or empty areas of the design must reveal the shirt's base color beneath them — not white, not black, but the actual shirt color
- The design must not be tiled, repeated, or duplicated; it is applied once as a single unified print
- The design's original aspect ratio must be preserved exactly — do not stretch or compress it

SHADOW AND OCCLUSION:
- Any shadows cast by the model's arms, hands, or body onto the shirt must remain visible over the printed design
- Shadows cast by the shirt collar or neckline onto the upper chest area must remain visible over the top of the print
- The printed design does not cast any shadows of its own onto the fabric

PLACEMENT AND SCALE:
- Position the design in a standard front chest-print location, horizontally centered on the shirt
- Scale proportionally to a realistic DTG or screen-print size as seen in real-world fashion photography
- The design must not extend beyond the printable surface of the shirt front, and must not overlap sleeves, collar, or seams

FINAL OUTPUT QUALITY:
- The final image must exactly match the original photo's resolution, noise level, film grain, JPEG compression character, and overall rendering style
- Noise and grain must be uniformly distributed across the entire image — including over the composited print area — with zero visible seam, mask edge, or transition boundary between the original photo and the composited area
- Do not sharpen, smooth, upscale, denoise, or color-correct any part of the image
- The result must be completely photorealistic and indistinguishable from a real photograph of a person wearing a shirt with that design printed on it
- A professional retoucher examining the image at full resolution must not be able to detect any digital compositing was performed
`.trim();
