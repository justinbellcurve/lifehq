import { widgets } from "@/widgets/registry";
import type { WidgetSize } from "@/widgets/types";

// Desktop "wall": a 12-column grid. Phone "glance": one column, onPhone widgets only.
const SPAN: Record<WidgetSize, string> = {
  full: "lg:col-span-12",
  wide: "lg:col-span-8",
  half: "lg:col-span-6",
  third: "lg:col-span-4",
};

export function Dashboard() {
  return (
    <main className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-4 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:gap-5 lg:py-8">
      {widgets.map(({ id, title, size, onPhone, Component }) => (
        <section
          key={id}
          aria-label={title || undefined}
          className={`${SPAN[size]} ${onPhone ? "" : "hidden lg:block"} ${
            size === "full" ? "py-2" : "card"
          }`}
        >
          {title && <h2 className="mb-4 font-display text-lg font-bold">{title}</h2>}
          <Component />
        </section>
      ))}
    </main>
  );
}
