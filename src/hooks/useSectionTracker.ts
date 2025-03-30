import { useState, useRef, useEffect } from "react";

interface UseSectionTrackerResult {
  activeSection: string;
  animatedElements: Record<string, boolean>;
  registerSectionRef: (id: string, ref: HTMLElement | null) => void;
}

/**
 * Custom hook for tracking active sections and animated elements on scroll
 * @param initialActiveSection The initially active section ID
 * @param animationThreshold Percentage of viewport height to trigger animations (0-1)
 * @param activeSectionOffset Percentage of viewport height to determine active section (0-1)
 * @returns Object containing activeSection, animatedElements, and registerSectionRef
 */
export const useSectionTracker = (
  initialActiveSection: string = "hero",
  animationThreshold: number = 0.8,
  activeSectionOffset: number = 0.3
): UseSectionTrackerResult => {
  const [activeSection, setActiveSection] =
    useState<string>(initialActiveSection);
  const [animatedElements, setAnimatedElements] = useState<
    Record<string, boolean>
  >({});
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});

  // Track scroll position to determine active section
  useEffect(() => {
    const handleScroll = () => {
      // Determine which section is currently in view
      Object.entries(sectionsRef.current).forEach(([id, ref]) => {
        if (!ref) return;

        const rect = ref.getBoundingClientRect();
        const offset = window.innerHeight * activeSectionOffset;

        if (rect.top < offset && rect.bottom > offset) {
          setActiveSection(id);
        }
      });

      // Check for elements to animate
      document.querySelectorAll(".animate-on-scroll").forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * animationThreshold;

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
  }, [activeSectionOffset, animationThreshold]);

  // Register section refs
  const registerSectionRef = (id: string, ref: HTMLElement | null) => {
    if (ref && !sectionsRef.current[id]) {
      sectionsRef.current = { ...sectionsRef.current, [id]: ref };
    }
  };

  return {
    activeSection,
    animatedElements,
    registerSectionRef,
  };
};
