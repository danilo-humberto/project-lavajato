import { RefObject, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../utils/animation";

gsap.registerPlugin(ScrollTrigger);

export function useLandingAnimations(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root || prefersReducedMotion()) {
      return;
    }

    const context = gsap.context(() => {
      const clearProps = (targets: gsap.TweenTarget, props = "opacity,visibility,transform") => {
        gsap.set(targets, { clearProps: props });
      };

      gsap.fromTo(
        "[data-animate='header']",
        { y: -24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: "power3.out",
          onComplete: () => clearProps("[data-animate='header']"),
        },
      );

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
        onComplete: () => {
          clearProps(
            "[data-animate='hero-image'], [data-animate='hero-eyebrow'], [data-animate='hero-title'], [data-animate='hero-description'], [data-animate='hero-button'], [data-animate='benefit-card']",
          );
        },
      });

      heroTimeline
        .fromTo(
          "[data-animate='hero-image']",
          { x: 70, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.9,
          },
        )
        .fromTo(
          "[data-animate='hero-eyebrow'], [data-animate='hero-title']",
          { x: -44, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.82,
            stagger: 0.08,
          },
          0.12,
        )
        .fromTo(
          "[data-animate='hero-description']",
          { x: -28, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.74,
          },
          0.34,
        )
        .fromTo(
          "[data-animate='hero-button']",
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.62,
          },
          0.48,
        )
        .fromTo(
          "[data-animate='benefit-card']",
          { y: 26, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.62,
            stagger: 0.12,
          },
          0.78,
        );

      let servicesAnimated = false;
      const serviceTargets =
        "[data-animate='services-heading'], [data-animate='vehicle-card'], [data-animate='wash-card'], [data-animate='extra-card'], [data-animate='order-summary']";

      clearProps(serviceTargets);

      const animateServices = () => {
        if (servicesAnimated) {
          return;
        }

        servicesAnimated = true;

        const servicesTimeline = gsap.timeline({
          defaults: {
            duration: 0.62,
            ease: "power3.out",
          },
          onComplete: () => clearProps(serviceTargets, "opacity,visibility"),
        });

        servicesTimeline
          .fromTo(
            "[data-animate='services-heading']",
            { y: 28, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
            },
          )
          .fromTo(
            "[data-animate='vehicle-card']",
            { y: 26, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.08,
            },
            "-=0.26",
          )
          .fromTo(
            "[data-animate='wash-card']",
            { y: 24, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.1,
            },
            "-=0.28",
          )
          .fromTo(
            "[data-animate='extra-card']",
            { y: 22, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.08,
            },
            "-=0.26",
          )
          .fromTo(
            "[data-animate='order-summary']",
            { x: 32, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
            },
            "-=0.38",
          );
      };

      ScrollTrigger.create({
        trigger: "[data-animate='services-section']",
        start: "top 78%",
        once: true,
        onEnter: animateServices,
      });

      gsap.delayedCall(1.4, () => {
        clearProps("[data-animate='hero-button']");
      });

      ScrollTrigger.refresh();
    }, root);

    return () => context.revert();
  }, [rootRef]);
}
