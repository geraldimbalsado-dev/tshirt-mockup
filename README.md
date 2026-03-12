# T-Shirt Model Mockup Generator

A single-page AI-powered web app that lets users upload a T-shirt design, choose one of three brand model styles, and generate a professional product mockup photo using OpenAI's image generation API.

---

## Features

- Upload a design image (PNG, JPG, WEBP, GIF)
- Choose from 3 brand model styles:
  - **Model A** — Minimalist Streetwear
  - **Model B** — Athletic Activewear
  - **Model C** — Premium Casual Fashion
- AI-generated product mockup via OpenAI `gpt-image-1`
- Download the result as PNG
- Mobile-responsive, clean UI
- Secure: OpenAI API key stays server-side only

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | OpenAI Images API (`gpt-image-1`) |
| Deploy | Vercel |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/tshirt-mockup-generator.git
cd tshirt-mockup-generator
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-key-here
```

> Your API key must have access to the **Images API** with `gpt-image-1`.
> Get a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
tshirt-mockup/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # Server-side OpenAI API route
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main single-page app
├── components/
│   ├── DesignUploader.tsx         # File upload with drag-and-drop
│   ├── ModelPicker.tsx            # Brand model selection cards
│   ├── ResultPreview.tsx          # Generated image + states
│   └── ActionControls.tsx         # Generate button + checklist
├── lib/
│   └── models.ts                  # Model definitions + prompt templates
├── public/
│   └── models/
│       ├── model-a.svg            # Streetwear placeholder
│       ├── model-b.svg            # Activewear placeholder
│       └── model-c.svg            # Premium casual placeholder
├── types/
│   └── index.ts                   # Shared TypeScript types
├── .env.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Generation Logic & Prompt Strategy

The app uses the **OpenAI `gpt-image-1` image edit endpoint** (`POST /v1/images/edits`), which accepts an input image and a text prompt to guide the output.

### How it works

1. The user's design image is sent as the `image` parameter.
2. A model-specific prompt instructs the AI to place the design on a t-shirt worn by a model in the appropriate visual context.
3. The result is returned as a base64 PNG and displayed in the browser.

### Prompt strategy per model

**Model A — Minimalist Streetwear**
> Relaxed studio setting, white/light gray seamless background, soft diffused lighting. The design is screen-printed on the center chest of a white t-shirt, faithfully rendered on the fabric.

**Model B — Athletic Activewear**
> High-energy studio shoot, bright high-contrast lighting, athletic model in dynamic posture. The design is printed boldly on the front chest.

**Model C — Premium Casual Fashion**
> Editorial quality, warm-toned minimal interior, professional lighting. The design is artfully printed and presented in an upscale context.

---

## Deploying to Vercel

1. Push to GitHub
2. Import the repo on [vercel.com/new](https://vercel.com/new)
3. Add the environment variable `OPENAI_API_KEY` in the Vercel dashboard
4. Deploy

---

## Adding Supabase (Optional)

If you want to persist uploaded designs and generated results, add Supabase:

1. Create a project at [supabase.com](https://supabase.com)
2. Create two storage buckets: `designs` and `mockups`
3. Add keys to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
4. In the API route, upload the base64 image to the `designs` bucket before calling OpenAI, and store the result URL in the `mockups` bucket after generation.

---

## Notes

- Generated images are 1024×1024 PNG.
- Generation typically takes **10–30 seconds**.
- `gpt-image-1` billing is per-image; check [OpenAI pricing](https://openai.com/pricing) for current rates.
- The uploaded design image is sent to OpenAI's servers for processing. Ensure you have rights to any design you upload.
