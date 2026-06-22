import gsap from "gsap";

export function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function animateSelectionPress(element: HTMLElement) {
  if (prefersReducedMotion()) {
    return;
  }

  gsap.killTweensOf(element);
  gsap.fromTo(
    element,
    { scale: 1 },
    {
      scale: 1.02,
      duration: 0.14,
      ease: "power2.out",
      repeat: 1,
      yoyo: true,
      transformOrigin: "center center",
      overwrite: true,
    },
  );
}

export function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);

  if (!target) {
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - 88;

  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}
