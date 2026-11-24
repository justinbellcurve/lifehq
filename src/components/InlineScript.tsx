"use client";

/**
 * A script that runs during HTML parsing (before paint) on a full page load.
 * On the client it renders as text/plain, which avoids React's "script tag" dev warning;
 * suppressHydrationWarning covers the type mismatch. Pattern from Next's "preventing flash" guide.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
