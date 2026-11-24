import type { ReactNode, SVGProps } from "react";

/** Inline stroke icons (24px grid, currentColor). Decorative: label the button, not the icon. */
export type Icon = (props: SVGProps<SVGSVGElement>) => ReactNode;

function make(paths: ReactNode): Icon {
  function StrokeIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={22}
        height={22}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        {paths}
      </svg>
    );
  }
  return StrokeIcon;
}

export const SunIcon = make(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </>,
);
export const MoonIcon = make(<path d="M20.5 14.1A8.5 8.5 0 1 1 9.9 3.5a6.6 6.6 0 0 0 10.6 10.6Z" />);
export const MenuIcon = make(<path d="M4 7h16M4 12h16M4 17h16" />);
export const CloseIcon = make(<path d="M6 6l12 12M18 6 6 18" />);
export const ChevronLeftIcon = make(<path d="m15 6-6 6 6 6" />);
export const ChevronRightIcon = make(<path d="m9 6 6 6-6 6" />);
export const CheckIcon = make(<path d="m5 12.5 4.5 4.5L19 7.5" />);
export const ContrastIcon = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 3.5v17a8.5 8.5 0 0 0 0-17Z" fill="currentColor" stroke="none" />
  </>,
);
