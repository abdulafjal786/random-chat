import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RandomChat — Talk to Strangers",
  description: "Meet random people from around the world. Real-time anonymous chat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: "#0a0a0f" }}>
        {children}
      </body>
    </html>
  );
}
