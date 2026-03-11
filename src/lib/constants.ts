/**
 * Handler record stored in a WeakMap for magnetic-button cleanup (typed alternative to `(el as any)._handlers`).
 */
export interface MagneticHandlerRecord {
  handleBtnEnter: () => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseLeave: () => void;
  handleResize: () => void;
}

/** WeakMap that associates an HTMLElement with its magnetic-button event handlers. */
export const magneticHandlers = new WeakMap<HTMLElement, MagneticHandlerRecord>();
