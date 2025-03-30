// useScrollEffects.ts
import { useEffect, useRef } from "react";
// First, modify the useScrollEffects hook (in its file) to accept and update external states:
export function useScrollEffects(
  initialActiveSection: string,
  setActiveSection: React.Dispatch<React.SetStateAction<string>>,
  setAnimatedElements: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >
) {
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      // Determine which section is currently in view
      Object.entries(sectionsRef.current).forEach(([id, ref]) => {
        if (!ref) return;

        const rect = ref.getBoundingClientRect();
        const offset = window.innerHeight * 0.3;

        if (rect.top < offset && rect.bottom > offset) {
          setActiveSection(id);
        }
      });

      // Check for elements to animate
      document.querySelectorAll(".animate-on-scroll").forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;

        if (isVisible && !element.classList.contains("animated")) {
          element.classList.add("animated");
          setAnimatedElements((prev) => ({
            ...prev,
            [element.id]: true,
          }));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setActiveSection, setAnimatedElements]);

  // Function to register a section element
  const registerSection = (id: string, element: HTMLElement | null) => {
    if (element) {
      sectionsRef.current = { ...sectionsRef.current, [id]: element };
    }
  };

  return {
    registerSection,
  };
}
