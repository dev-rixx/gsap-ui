"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function BirthdayPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      const plate = cakeRef.current?.querySelector(".plate");
      const layers = cakeRef.current?.querySelectorAll(".cake-layer");
      const frostings = cakeRef.current?.querySelectorAll(".frosting-drip");
      const candles = cakeRef.current?.querySelectorAll(".candle");
      const flames = cakeRef.current?.querySelectorAll(".flame");
      const decorations = cakeRef.current?.querySelectorAll(".decoration");
      const hearts = cakeRef.current?.querySelectorAll(".heart-deco");

      gsap.set(cakeRef.current!, { opacity: 1 });
      gsap.set(plate!, { scaleX: 0, scaleY: 0, opacity: 0 });
      gsap.set(layers!, {
        y: -120,
        scaleX: 0.8,
        opacity: 0,
        transformOrigin: "center center",
      });
      gsap.set(frostings!, {
        scaleY: 0,
        opacity: 0,
        transformOrigin: "center top",
      });
      gsap.set(candles!, {
        scaleY: 0,
        opacity: 0,
        transformOrigin: "center bottom",
      });
      gsap.set(flames!, {
        scale: 0,
        opacity: 0,
        transformOrigin: "center bottom",
      });
      gsap.set(decorations!, { scale: 0, opacity: 0 });
      gsap.set(hearts!, { scale: 0, opacity: 0, rotation: -20 });

      tl.to(
        plate!,
        {
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        0.1,
      );

      if (layers && frostings) {
        const frostingArr = Array.from(frostings);
        layers.forEach((layer, i) => {
          tl.to(
            layer,
            {
              y: 0,
              scaleX: 1,
              opacity: 1,
              duration: 0.3,
              ease: "power3.out",
            },
            i === 0 ? undefined : `-=0.1`,
          );
          if (frostingArr[i]) {
            tl.to(
              frostingArr[i],
              {
                scaleY: 1,
                opacity: 1,
                duration: 0.35,
                ease: "power1.out",
              },
              "-=0.05",
            );
          }
        });
      }

      tl.to(
        decorations!,
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          stagger: 0.02,
          ease: "power2.out",
        },
        "-=0.2",
      );

      tl.to(
        hearts!,
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: "back.out(1.4)",
        },
        "-=0.2",
      );

      tl.to(
        candles!,
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.08,
          ease: "power2.out",
        },
        "-=0.1",
      );

      tl.to(flames!, {
        scale: 1,
        opacity: 1,
        duration: 0.05,
        ease: "power1.out",
      });

      tl.add(() => {
        if (flames) {
          flames.forEach((flame) => {
            gsap.to(flame, {
              scaleX: 0.75,
              scaleY: 1.15,
              x: "random(-1.5, 1.5)",
              duration: "random(0.3, 0.6)",
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });
        }
      });

      const letters = textRef.current?.querySelectorAll(".letter");
      if (letters) {
        gsap.set(letters, {
          opacity: 0,
          y: 40,
          scale: 0.3,
          filter: "blur(8px)",
        });

        tl.to(
          letters,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.35,
            stagger: 0.025,
            ease: "power2.out",
          },
          "-=0.1",
        );

        tl.to(
          textRef.current!,
          {
            textShadow:
              "0 0 30px rgba(255,182,193,0.9), 0 0 60px rgba(255,105,180,0.4), 0 0 100px rgba(255,20,147,0.2)",
            duration: 0.6,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1,
          },
          "-=0.2",
        );
      }

      tl.add(() => {
        createConfetti();
      });

      tl.add(() => {
        if (letters) {
          gsap.to(letters, {
            color: gsap.utils.wrap([
              "#ff69b4",
              "#fff0f5",
              "#ff1493",
              "#ffe4e1",
              "#ffb6c1",
              "#ffffff",
              "#f8c8dc",
              "#ff85a2",
            ]),
            duration: 2.5,
            stagger: {
              each: 0.18,
              repeat: -1,
              yoyo: true,
            },
            ease: "sine.inOut",
          });
        }
      });

      tl.add(() => {
        if (hearts) {
          hearts.forEach((heart) => {
            gsap.to(heart, {
              y: "random(-3, 3)",
              rotation: "random(-8, 8)",
              duration: "random(1.5, 2.5)",
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  function createConfetti() {
    const container = confettiRef.current;
    if (!container) return;

    const colors = [
      "#ffb6c1",
      "#ff69b4",
      "#ff1493",
      "#fff0f5",
      "#ffffff",
      "#ffc0cb",
      "#f8c8dc",
      "#ffe4e1",
      "#ff85a2",
      "#ffd1dc",
    ];

    for (let i = 0; i < 70; i++) {
      const piece = document.createElement("div");
      const isCircle = Math.random() > 0.4;
      const isHeart = !isCircle && Math.random() > 0.5;
      const size = Math.random() * 8 + 4;

      piece.style.position = "absolute";
      piece.style.pointerEvents = "none";
      piece.style.left = "50%";
      piece.style.top = "35%";
      piece.style.opacity = "0";

      if (isHeart) {
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.fontSize = `${size + 4}px`;
        piece.style.lineHeight = "1";
        piece.textContent = "\u2665";
        piece.style.color = colors[Math.floor(Math.random() * colors.length)];
      } else {
        piece.style.width = `${size}px`;
        piece.style.height = isCircle ? `${size}px` : `${size * 2}px`;
        piece.style.borderRadius = isCircle ? "50%" : "2px";
        piece.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
      }

      container.appendChild(piece);

      gsap.to(piece, {
        x: (Math.random() - 0.5) * 700,
        y: (Math.random() - 0.7) * 500 + 150,
        rotation: Math.random() * 540 - 270,
        opacity: 0.9,
        duration: 0.4,
        delay: Math.random() * 0.4,
        ease: "power2.out",
      });

      gsap.to(piece, {
        y: "+=350",
        rotation: "+=180",
        opacity: 0,
        duration: 2.5 + Math.random() * 2,
        delay: 0.8 + Math.random() * 0.5,
        ease: "power1.in",
        onComplete: () => piece.remove(),
      });
    }
  }

  const happyText = "Happy";
  const birthdayText = "Birthday!";

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 20%, #fff5f7 0%, #ffe4ec 25%, #ffd1dc 50%, #ffc0cb 75%, #ffb0c0 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 30 + 10,
              height: Math.random() * 30 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.2 + 0.05,
              background:
                i % 3 === 0
                  ? "rgba(255,255,255,0.6)"
                  : i % 3 === 1
                    ? "rgba(255,105,180,0.15)"
                    : "rgba(255,182,193,0.25)",
              animation: `floatBubble ${4 + Math.random() * 6}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`spark-${i}`}
            className="absolute"
            style={{
              width: 4,
              height: 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 0 6px 2px rgba(255,182,193,0.6)",
              opacity: 0,
              animation: `sparkle ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div ref={confettiRef} className="pointer-events-none absolute inset-0" />

      <div ref={cakeRef} className="relative z-10 opacity-0">
        <svg viewBox="0 0 400 360" width="400" height="360">
          <ellipse
            className="plate"
            cx="200"
            cy="318"
            rx="175"
            ry="18"
            fill="url(#plateGradient)"
          />
          <ellipse
            cx="200"
            cy="318"
            rx="175"
            ry="18"
            fill="url(#plateShine)"
            className="plate"
          />

          <g className="cake-layer">
            <rect
              x="75"
              y="245"
              width="250"
              height="72"
              rx="12"
              fill="url(#layer1Gradient)"
            />
            <rect
              x="75"
              y="295"
              width="250"
              height="22"
              rx="0"
              fill="rgba(200,100,130,0.15)"
            />
          </g>
          <path
            className="frosting-drip"
            d="M75,255 Q75,245 87,245 L313,245 Q325,245 325,255 L325,253 Q316,268 306,255 Q296,270 286,255 Q276,270 266,257 Q256,272 246,257 Q236,272 226,257 Q216,272 206,257 Q196,272 186,257 Q176,270 166,255 Q156,270 146,255 Q136,268 126,255 Q116,268 106,255 Q96,265 86,255 Q80,262 75,255Z"
            fill="rgba(255,255,255,0.85)"
          />

          <g className="cake-layer">
            <rect
              x="108"
              y="185"
              width="184"
              height="60"
              rx="10"
              fill="url(#layer2Gradient)"
            />
            <rect
              x="108"
              y="225"
              width="184"
              height="20"
              rx="0"
              ry="0"
              fill="rgba(200,100,130,0.1)"
              clipPath="inset(0)"
            />
            <rect
              x="110"
              y="185"
              width="180"
              height="4"
              rx="2"
              fill="rgba(255,255,255,0.4)"
            />
          </g>
          <path
            className="frosting-drip"
            d="M108,195 Q108,185 118,185 L282,185 Q292,185 292,195 L292,193 Q285,208 278,193 Q271,210 264,195 Q257,210 250,195 Q243,210 236,195 Q229,210 222,195 Q215,208 208,195 Q201,210 194,195 Q187,210 180,195 Q173,208 166,193 Q159,208 152,195 Q145,208 138,193 Q131,206 124,195 Q117,206 110,195 Q109,198 108,195Z"
            fill="rgba(255,255,255,0.85)"
          />

          <g className="cake-layer">
            <rect
              x="132"
              y="132"
              width="136"
              height="58"
              rx="10"
              fill="url(#layer3Gradient)"
            />
            <ellipse
              cx="200"
              cy="134"
              rx="68"
              ry="9"
              fill="rgba(255,255,255,0.9)"
            />
          </g>
          <path
            className="frosting-drip"
            d="M132,142 Q132,132 142,132 L258,132 Q268,132 268,142 L268,140 Q260,156 254,142 Q248,158 242,143 Q236,159 230,143 Q224,159 218,143 Q212,158 205,143 Q198,158 192,143 Q186,158 180,143 Q174,156 168,142 Q162,156 156,142 Q150,154 144,142 Q138,154 132,142Z"
            fill="rgba(255,255,255,0.85)"
          />

          {[95, 125, 155, 185, 215, 245, 275, 305].map((x, i) => (
            <text
              key={`d1-${i}`}
              className="decoration"
              x={x}
              y={282}
              fontSize="10"
              fill={
                i % 2 === 0 ? "rgba(255,255,255,0.8)" : "rgba(255,150,180,0.7)"
              }
              textAnchor="middle"
            >
              &#9829;
            </text>
          ))}
          {[125, 155, 185, 215, 245, 275].map((x, i) => (
            <circle
              key={`d2-${i}`}
              className="decoration"
              cx={x}
              cy={220}
              r="3.5"
              fill={
                i % 2 === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,182,193,0.9)"
              }
            />
          ))}
          {[150, 172, 194, 216, 238, 260].map((x, i) => (
            <circle
              key={`d3-${i}`}
              className="decoration"
              cx={x}
              cy={162}
              r="2.5"
              fill={i % 2 === 0 ? "#fff" : "rgba(255,105,180,0.5)"}
            />
          ))}

          {[
            { x: 55, y: 200, size: 14 },
            { x: 345, y: 210, size: 12 },
            { x: 65, y: 155, size: 10 },
            { x: 335, y: 160, size: 11 },
            { x: 50, y: 270, size: 9 },
            { x: 350, y: 265, size: 10 },
          ].map((h, i) => (
            <text
              key={`heart-${i}`}
              className="heart-deco"
              x={h.x}
              y={h.y}
              fontSize={h.size}
              fill={i % 2 === 0 ? "#ff69b4" : "#ffb6c1"}
              textAnchor="middle"
              opacity="0.7"
            >
              &#9829;
            </text>
          ))}

          <g>
            <rect
              className="candle"
              x={196}
              y={95}
              width="8"
              height="40"
              rx="4"
              fill="#ff85a2"
              stroke="rgba(255,182,193,0.4)"
              strokeWidth="0.5"
            />
            <rect
              className="candle"
              x={196}
              y={106}
              width="8"
              height="2.5"
              fill="rgba(255,255,255,0.6)"
            />
            <rect
              className="candle"
              x={196}
              y={117}
              width="8"
              height="2.5"
              fill="rgba(255,255,255,0.6)"
            />
            <line
              className="candle"
              x1={200}
              y1={95}
              x2={200}
              y2={86}
              stroke="#8b6f6f"
              strokeWidth="1.2"
            />
            <g className="flame">
              <ellipse
                cx={200}
                cy={79}
                rx="6"
                ry="10"
                fill="url(#flameGradient)"
              />
              <ellipse
                cx={200}
                cy={81}
                rx="2.8"
                ry="5"
                fill="#fff8f0"
                opacity="0.95"
              />
              <ellipse
                cx={200}
                cy={79}
                rx="16"
                ry="18"
                fill="url(#flameGlow)"
              />
            </g>
          </g>

          <defs>
            <linearGradient
              id="layer1Gradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffb6c1" />
              <stop offset="100%" stopColor="#f8a4b8" />
            </linearGradient>
            <linearGradient
              id="layer2Gradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f9a8c9" />
              <stop offset="100%" stopColor="#f08cba" />
            </linearGradient>
            <linearGradient
              id="layer3Gradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ff85a2" />
              <stop offset="100%" stopColor="#ff6b8a" />
            </linearGradient>
            <linearGradient
              id="plateGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0e6ea" />
            </linearGradient>
            <radialGradient id="plateShine" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <radialGradient id="flameGradient" cx="50%" cy="70%" r="50%">
              <stop offset="0%" stopColor="#fff8f0" />
              <stop offset="35%" stopColor="#ffd1a0" />
              <stop offset="100%" stopColor="#ff8fa0" />
            </radialGradient>
            <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,200,180,0.25)" />
              <stop offset="100%" stopColor="rgba(255,200,180,0)" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div
        ref={textRef}
        className="relative z-10 mt-4 select-none text-center"
        style={{ perspective: "800px" }}
      >
        <div className="mb-1 flex justify-center gap-1">
          {happyText.split("").map((char, i) => (
            <span
              key={`h-${i}`}
              className="letter inline-block text-5xl font-black tracking-wider md:text-7xl"
              style={{
                color: "#ff1493",
                textShadow:
                  "0 0 10px rgba(255,105,180,0.4), 0 2px 4px rgba(0,0,0,0.08)",
                fontFamily: "'Georgia', serif",
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <div className="flex justify-center gap-1">
          {birthdayText.split("").map((char, i) => (
            <span
              key={`b-${i}`}
              className="letter inline-block text-5xl font-black tracking-wider md:text-7xl"
              style={{
                color: "#ff69b4",
                textShadow:
                  "0 0 10px rgba(255,182,193,0.5), 0 2px 4px rgba(0,0,0,0.06)",
                fontFamily: "'Georgia', serif",
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes floatBubble {
          0% {
            transform: translateY(0) scale(1);
          }
          100% {
            transform: translateY(-20px) scale(1.1);
          }
        }
        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
