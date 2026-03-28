import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-display-brand",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-sans-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Blackboard",
  description: "Campus-scoped boards—trade on what happens at your school.",
};

/** Clerk reads auth from the request; static prerender can break on some hosts without this. */
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#e6e4df",
          colorText: "#e6e4df",
          colorTextSecondary: "#9b9da8",
          colorBackground: "#16181f",
          colorInputBackground: "#1e212b",
          colorNeutral: "#2a2d38",
        },
      }}
    >
      <html
        lang="en"
        className={`${syne.variable} ${dmSans.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans">{children}</body>
      </html>
    </ClerkProvider>
  );
}
