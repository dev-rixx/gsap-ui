"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import Image from "next/image";
import type { ProductCardProps } from "./ProductCard.types";
import styles from "./ProductCard.module.css";

const FAN_CONFIG = [
  { x: -280, rotate: -12, scale: 0.78, z: 1, opacity: 0.5 }, // far left
  { x: -150, rotate: -6, scale: 0.88, z: 2, opacity: 0.7 }, // left
  { x: 0, rotate: 0, scale: 1, z: 5, opacity: 1 }, // center
  { x: 150, rotate: 6, scale: 0.88, z: 2, opacity: 0.7 }, // right
  { x: 280, rotate: 12, scale: 0.78, z: 1, opacity: 0.5 }, // far right
];

function getWrappedIndex(i: number, active: number, total: number) {
  let diff = i - active;
  if (diff > Math.floor(total / 2)) diff -= total;
  if (diff < -Math.floor(total / 2)) diff += total;
  return diff;
}

export default function ProductCard({ products }: ProductCardProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const activeRef = useRef(0);
  const isAnimating = useRef(false);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = products[active];

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const layoutCards = useCallback(
    (activeIdx: number, animate = true) => {
      products.forEach((_, i) => {
        const card = cardsRef.current[i];
        if (!card) return;

        const diff = getWrappedIndex(i, activeIdx, products.length);
        const slotIdx = diff + 2; // map -2..2 to 0..4

        if (slotIdx < 0 || slotIdx > 4) {
          gsap.to(card, {
            opacity: 0,
            duration: animate ? 0.4 : 0,
            ease: "power3.out",
          });
          return;
        }

        const config = FAN_CONFIG[slotIdx];

        if (animate) {
          gsap.to(card, {
            x: config.x,
            rotation: config.rotate,
            scale: config.scale,
            zIndex: config.z,
            opacity: config.opacity,
            duration: 0.7,
            ease: "power3.out",
          });
        } else {
          gsap.set(card, {
            x: config.x,
            rotation: config.rotate,
            scale: config.scale,
            zIndex: config.z,
            opacity: config.opacity,
          });
        }
      });
    },
    [products],
  );

  const switchTo = useCallback(
    (idx: number) => {
      if (idx === activeRef.current || isAnimating.current) return;
      isAnimating.current = true;

      const tl = gsap.timeline();

      tl.to([infoRef.current, stripRef.current], {
        opacity: 0,
        y: 8,
        duration: 0.25,
        ease: "power2.in",
      });

      tl.to(
        bgRef.current,
        { opacity: 0.4, duration: 0.25, ease: "power2.in" },
        0,
      );

      tl.add(() => {
        setActive(idx);
        activeRef.current = idx;
        setAdded(false);
        layoutCards(idx, true);
      });

      tl.add(() => {}, "+=0.05");

      // Background back
      tl.to(bgRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });

      tl.fromTo(
        [infoRef.current, stripRef.current],
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.06 },
        "-=0.35",
      );

      tl.add(() => {
        isAnimating.current = false;
      });
    },
    [layoutCards],
  );

  // Auto carousel
  const resetAutoTimer = useCallback(() => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => {
      const next = (activeRef.current + 1) % products.length;
      switchTo(next);
      resetAutoTimer();
    }, 2000);
  }, [switchTo, products.length]);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      resetAutoTimer();
    }, 1000);
    return () => {
      clearTimeout(startDelay);
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, [resetAutoTimer]);

  const handlePrev = useCallback(() => {
    const prev =
      activeRef.current > 0 ? activeRef.current - 1 : products.length - 1;
    switchTo(prev);
    resetAutoTimer();
  }, [switchTo, products.length, resetAutoTimer]);

  const handleNext = useCallback(() => {
    const next =
      activeRef.current < products.length - 1 ? activeRef.current + 1 : 0;
    switchTo(next);
    resetAutoTimer();
  }, [switchTo, products.length, resetAutoTimer]);

  const handleCardClick = useCallback(
    (i: number) => {
      if (i === activeRef.current) return;
      switchTo(i);
      resetAutoTimer();
    },
    [switchTo, resetAutoTimer],
  );

  const handleDot = useCallback(
    (i: number) => {
      switchTo(i);
      resetAutoTimer();
    },
    [switchTo, resetAutoTimer],
  );

  useEffect(() => {
    layoutCards(0, false);
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card) => {
        if (!card) return;
        const currentX = gsap.getProperty(card, "x") as number;
        const currentRotation = gsap.getProperty(card, "rotation") as number;
        const currentScale = gsap.getProperty(card, "scale") as number;
        const currentOpacity = gsap.getProperty(card, "opacity") as number;

        gsap.fromTo(
          card,
          {
            y: 80,
            opacity: 0,
            scale: currentScale * 0.8,
            x: currentX,
            rotation: currentRotation,
          },
          {
            y: 0,
            opacity: currentOpacity,
            scale: currentScale,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.15,
          },
        );
      });

      gsap.fromTo(
        [infoRef.current, stripRef.current],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.6,
          stagger: 0.08,
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, [layoutCards]);

  return (
    <div ref={pageRef} className={styles.page}>
      <div ref={bgRef} className={styles.bg}>
        <Image
          src={current.background}
          alt=""
          fill
          className={styles.bgImg}
          sizes="100vw"
          priority
        />
        <div className={styles.bgOverlay} />
      </div>

      <span className={styles.brand}>RIXX.DEV</span>

      <div className={styles.arrows}>
        <button
          className={styles.arrowBtn}
          onClick={handlePrev}
          aria-label="Previous"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          className={styles.arrowBtn}
          onClick={handleNext}
          aria-label="Next"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className={styles.carouselWrap}>
        <div className={styles.carousel}>
          {products.map((product, i) => (
            <div
              key={i}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={i === active ? styles.cardActive : styles.card}
              onClick={() => handleCardClick(i)}
            >
              <div className={styles.imageArea}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className={styles.productImg}
                  sizes="270px"
                />
                <div className={styles.imageOverlay} />
                <h2 className={styles.productName}>
                  {product.name.split(" ").map((word, wi) => (
                    <span key={wi} style={{ display: "block" }}>
                      {word}
                    </span>
                  ))}
                </h2>
              </div>
            </div>
          ))}
        </div>

        <div ref={infoRef} className={styles.activeInfo} style={{ opacity: 0 }}>
          <h3 className={styles.activeTitle}>{current.name}</h3>
          <p className={styles.activeSubtitle}>Premium Collection</p>
        </div>

        <div
          ref={stripRef}
          className={styles.priceStrip}
          style={{ opacity: 0 }}
        >
          <span className={styles.price}>${current.price.toFixed(2)}</span>
          <button
            className={added ? styles.toggleActive : styles.toggle}
            onClick={() => {
              setAdded(!added);
              resetAutoTimer();
            }}
            aria-label="Add to cart"
          >
            <span className={styles.toggleKnob} />
          </button>
        </div>

        <div className={styles.dots}>
          {products.map((_, i) => (
            <button
              key={i}
              className={i === active ? styles.dotActive : styles.dot}
              onClick={() => handleDot(i)}
              aria-label={`Product ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
