import { useEffect } from "react";

function isTypingInInput() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}

export function useHotkeys({ onToggleTimer }) {
  useEffect(() => {
    function onKeyDown(e) {
      // Space toggles timer (avoid while typing)
      if (e.code === "Space" && !isTypingInInput()) {
        e.preventDefault();
        onToggleTimer?.();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onToggleTimer]);
}
