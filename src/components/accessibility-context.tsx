import React, { createContext, useContext, useEffect, useState } from "react";

export type AccessibilityMode = "default" | "protanopia" | "deuteranopia" | "tritanopia" | "monochromacy";

type AccessibilityContextType = {
  accessibilityMode: AccessibilityMode;
  setAccessibilityMode: (mode: AccessibilityMode) => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [accessibilityMode, setAccessibilityModeState] = useState<AccessibilityMode>("default");

  useEffect(() => {
    const saved = localStorage.getItem("accessibility-mode") as AccessibilityMode;
    if (saved && ["default", "protanopia", "deuteranopia", "tritanopia", "monochromacy"].includes(saved)) {
      setAccessibilityModeState(saved);
      if (saved !== "default") {
        document.documentElement.setAttribute("data-accessibility", saved);
      } else {
        document.documentElement.removeAttribute("data-accessibility");
      }
    } else {
      setAccessibilityModeState("default");
      document.documentElement.removeAttribute("data-accessibility");
    }
  }, []);

  const setAccessibilityMode = (mode: AccessibilityMode) => {
    setAccessibilityModeState(mode);
    localStorage.setItem("accessibility-mode", mode);
    if (mode === "default") {
      document.documentElement.removeAttribute("data-accessibility");
    } else {
      document.documentElement.setAttribute("data-accessibility", mode);
    }
  };

  return (
    <AccessibilityContext.Provider value={{ accessibilityMode, setAccessibilityMode }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
