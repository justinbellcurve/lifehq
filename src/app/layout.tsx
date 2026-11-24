import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { InlineScript } from "@/components/InlineScript";
import { themeScript } from "@/lib/themeScript";
import "./globals.css";

const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"], weight: ["500", "700"] });
const sans = IBM_Plex_Sans({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = IBM_Plex_Mono({ variable: "--font-code", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "LifeHQ",
  description: "Justin's personal home base: check-ins, travel, fitness, sports and more.",
  appleWebApp: { capable: true, title: "LifeHQ", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#13201e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script sets data-theme before React hydrates.
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme from the lifehq-theme cookie (or the device), applied before first paint. */}
        <InlineScript html={themeScript} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
