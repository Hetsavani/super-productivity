export type FocusDirection = 'prev' | 'next';

/**
 * Returns the previous or next element matching `selector` in document order,
 * relative to `from`. Used for keyboard arrow-navigation across a mixed list
 * of focusable elements (e.g. group headers and task rows in the work view).
 *
 * If `from` itself matches the selector, walks one step in `direction`.
 * Otherwise (e.g. the caller passes its host element) finds the closest match
 * before/after `from` via `compareDocumentPosition`.
 *
 * Visibility is determined by DOM presence — Angular structural directives
 * (`@if`, `@for` filters) keep hidden elements out of the document, so this
 * will only return currently-rendered targets.
 */
export const findAdjacentFocusable = (
  from: HTMLElement,
  direction: FocusDirection,
  selector: string,
): HTMLElement | null => {
  const all = Array.from(document.querySelectorAll<HTMLElement>(selector));
  const idx = all.indexOf(from);
  if (idx >= 0) {
    return direction === 'next' ? (all[idx + 1] ?? null) : (all[idx - 1] ?? null);
  }
  const wantedBit =
    direction === 'next'
      ? Node.DOCUMENT_POSITION_FOLLOWING
      : Node.DOCUMENT_POSITION_PRECEDING;
  const ordered = direction === 'next' ? all : all.slice().reverse();
  return ordered.find((el) => from.compareDocumentPosition(el) & wantedBit) ?? null;
};
