import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "T-Shirt Mockup Generator",
  description:
    "Upload your design, choose a brand model style, and generate a professional product mockup in seconds.",
  openGraph: {
    title: "T-Shirt Mockup Generator",
    description: "AI-powered product mockup generation for apparel brands.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full min-h-screen">{children}</body>
    </html>
  );
}
