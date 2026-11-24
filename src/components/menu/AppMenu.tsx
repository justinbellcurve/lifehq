"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { menuItems } from "./menuItems";

/*
 * Hamburger button + slide-in panel. Built on <dialog> + showModal(): the page behind
 * becomes inert (focus stays in the panel) and Esc closes it natively.
 */
export function AppMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());

  const [open, setOpen] = useState(false);
  // panelId keeps the sub-panel's content mounted while it slides back out.
  const [panelId, setPanelId] = useState<string | null>(null);
  const [subOpen, setSubOpen] = useState(false);
  const panel = menuItems.find((i) => i.id === panelId);

  function openMenu() {
    setSubOpen(false);
    dialogRef.current?.showModal();
    setOpen(true);
    closeRef.current?.focus();
  }

  function closeMenu() {
    dialogRef.current?.close(); // fires "close", handled below
  }

  // Runs for every way of closing: close button, backdrop, Esc.
  function onClose() {
    setOpen(false);
    openerRef.current?.focus();
  }

  function onBackdropClick(e: MouseEvent<HTMLDialogElement>) {
    if (e.target !== e.currentTarget) return;
    const r = e.currentTarget.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) closeMenu();
  }

  // Move focus into the sub-panel when it opens, and back to its row when it closes.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!dialogRef.current?.open) return;
    if (subOpen) backRef.current?.focus();
    else if (panelId) itemRefs.current.get(panelId)?.focus();
  }, [subOpen, panelId]);

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        className="icon-btn"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="app-menu"
        onClick={openMenu}
      >
        <MenuIcon />
      </button>

      <dialog
        ref={dialogRef}
        id="app-menu"
        aria-labelledby="app-menu-title"
        className="menu-panel"
        onClose={onClose}
        onClick={onBackdropClick}
      >
        <div className="relative h-full overflow-hidden">
          {/* Main list */}
          <div className="absolute inset-0 flex flex-col" inert={subOpen}>
            <header className="flex items-center justify-between gap-2 px-4 py-3">
              <h2 id="app-menu-title" className="font-display text-xl font-bold">
                Menu
              </h2>
              <button ref={closeRef} type="button" className="icon-btn" aria-label="Close menu" onClick={closeMenu}>
                <CloseIcon />
              </button>
            </header>
            <nav aria-label="Settings" className="flex-1 overflow-y-auto px-2 pb-4">
              <ul className="grid gap-1">
                {menuItems.map(({ id, label, Icon, Value }) => (
                  <li key={id}>
                    <button
                      ref={(el) => {
                        if (el) itemRefs.current.set(id, el);
                        else itemRefs.current.delete(id);
                      }}
                      type="button"
                      className="menu-row"
                      onClick={() => {
                        setPanelId(id);
                        setSubOpen(true);
                      }}
                    >
                      <Icon className="text-muted" />
                      <span className="flex-1 font-medium">{label}</span>
                      {Value && (
                        <span className="text-sm text-muted">
                          <Value />
                        </span>
                      )}
                      <ChevronRightIcon className="text-muted" width={18} height={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Sub-panel, slides in on top */}
          <section
            className={`menu-subpanel absolute inset-0 flex flex-col bg-bg ${subOpen ? "translate-x-0" : "translate-x-full"}`}
            inert={!subOpen}
            aria-labelledby="app-menu-subtitle"
          >
            <header className="flex items-center gap-1 px-2 py-3">
              <button
                ref={backRef}
                type="button"
                className="icon-btn"
                aria-label="Back to menu"
                onClick={() => setSubOpen(false)}
              >
                <ChevronLeftIcon />
              </button>
              <h3 id="app-menu-subtitle" className="font-display text-xl font-bold">
                {panel?.label}
              </h3>
            </header>
            <div className="flex-1 overflow-y-auto px-2 pb-4">{panel && <panel.Panel />}</div>
          </section>
        </div>
      </dialog>
    </>
  );
}
