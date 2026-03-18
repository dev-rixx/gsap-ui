"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";
import type { CardV1Props } from "./CardV1.types";
import styles from "./CardV1.module.css";

function getCardV1Props(depth: number) {
  if (depth === 0) {
    return { rotate: 0, x: 0, y: 0, opacity: 1, scale: 1 };
  }
  // All cards fan to the left
  const rotate = -(4 + depth * 5);
  const x = -(10 + depth * 14);
  const y = -(4 + depth * 4);
  const opacity = Math.max(0.3, 1 - depth * 0.22);
  const scale = Math.max(0.9, 1 - depth * 0.025);

  return { rotate, x, y, opacity, scale };
}

export default function CardV1({ slides }: CardV1Props) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const orderRef = useRef<number[]>([]);
  const isAnimating = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = slides.length;

  useEffect(() => {
    orderRef.current = slides.map((_, i) => i);
  }, [slides]);

  // ── Apply fan positions based on current order ──
  function applyFanLayout(animated = true, skipIdx = -1) {
    const order = orderRef.current;
    order.forEach((cardIdx, depth) => {
      const el = cardsRef.current[cardIdx];
      if (!el || cardIdx === skipIdx) return;
      const fan = getCardV1Props(depth);
      el.style.zIndex = String(count - depth);

      if (animated) {
        gsap.to(el, {
          rotation: fan.rotate,
          x: fan.x,
          y: fan.y,
          opacity: fan.opacity,
          scale: fan.scale,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        gsap.set(el, {
          rotation: fan.rotate,
          x: fan.x,
          y: fan.y,
          opacity: fan.opacity,
          scale: fan.scale,
        });
      }
    });
  }

  // ── Cycle: front card smoothly travels to the back (left) ──
  function cycleCards() {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const order = orderRef.current;
    const frontCardIdx = order[0];
    const frontEl = cardsRef.current[frontCardIdx];

    if (!frontEl) {
      isAnimating.current = false;
      return;
    }

    // Where the back position will be after reorder
    const backDepth = count - 1;
    const backFan = getCardV1Props(backDepth);

    // Update order: front goes to back
    orderRef.current = [...order.slice(1), frontCardIdx];

    // Drop the z-index of the departing card below others immediately
    frontEl.style.zIndex = String(0);

    // Smoothly animate front card traveling to the back-left position
    gsap.to(frontEl, {
      rotation: backFan.rotate,
      x: backFan.x,
      y: backFan.y,
      opacity: backFan.opacity,
      scale: backFan.scale,
      duration: 0.75,
      ease: "power2.inOut",
      onComplete: () => {
        // Set final z-index
        frontEl.style.zIndex = String(1);
        isAnimating.current = false;
      },
    });

    // Shift all other cards to their new fan positions (skip the departing one)
    applyFanLayout(true, frontCardIdx);
  }

  // ── Entrance animation + start auto-cycle ──────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial: all invisible stacked
      cardsRef.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, { rotation: 0, x: 0, y: 60, opacity: 0, scale: 0.9 });
      });

      // Pop out back→front
      const tl = gsap.timeline({ delay: 0.3 });

      for (let depth = count - 1; depth >= 0; depth--) {
        const el = cardsRef.current[depth];
        if (!el) continue;
        const fan = getCardV1Props(depth);
        el.style.zIndex = String(count - depth);

        tl.to(
          el,
          {
            rotation: fan.rotate,
            x: fan.x,
            y: fan.y,
            opacity: fan.opacity,
            scale: fan.scale,
            duration: 0.6,
            ease: "back.out(1.4)",
          },
          depth < count - 1 ? "-=0.35" : undefined,
        );
      }
    }, sceneRef);

    // Auto-cycle every 2s
    const startDelay = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        cycleCards();
      }, 2000);
    }, 2200);

    return () => {
      ctx.revert();
      clearTimeout(startDelay);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div ref={sceneRef} className={styles.scene}>
      {/* Render cards back→front so front card DOM is on top */}
      {[...slides].reverse().map((slide, reversedIdx) => {
        const originalIdx = count - 1 - reversedIdx;

        return (
          <div
            key={originalIdx}
            ref={(el) => {
              cardsRef.current[originalIdx] = el;
            }}
            className={styles.card}
            style={{ zIndex: count - originalIdx }}
          >
            <div className={styles.cardInner}>
              {/* Header */}
              <div className={styles.header}>
                <div className={styles.iconLeft}>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  </svg>
                </div>
                <div className={styles.iconRight}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className={styles.title}>
                {slide.title.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < slide.title.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </h2>

              {/* Image */}
              <div className={styles.imageWrap}>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className={styles.image}
                  sizes="300px"
                  priority={originalIdx === 0}
                />
                <span className={styles.tag}>{slide.tag}</span>
              </div>

              {/* Description */}
              <p className={styles.description}>{slide.description}</p>
            </div>
          </div>
        );
      })}

      {/* Reflection shadow */}
      <div className={styles.reflection} />
    </div>
  );
}
