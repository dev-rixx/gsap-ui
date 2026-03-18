import CardV1, { CardV1Slide } from "@/components/CardV1";

const slides: CardV1Slide[] = [
  {
    image: "/card/c1.jpeg",
    title: "SINDALAH\nISLAND",
    tag: "$$ Luxury",
    description:
      "Sindalah will become a global yachting hub and a sustainable luxury destination featuring world-class cuisine, shopping and wellness.",
  },
  {
    image: "/card/c2.jpeg",
    title: "TROJENA\nPEAKS",
    tag: "$$ Adventure",
    description:
      "A year-round mountain destination offering ski slopes, adventure trails and an outdoor lifestyle like no other in the region.",
  },
  {
    image: "/card/c3.jpeg",
    title: "THE LINE\nNEOM",
    tag: "$$$ Visionary",
    description:
      "A revolution in urban living — a linear city of 170km with zero cars, zero emissions and powered by 100% renewable energy.",
  },
  {
    image: "/card/c4.jpeg",
    title: "OXAGON\nPORT",
    tag: "$$ Innovation",
    description:
      "The world's largest floating industrial complex, reimagining manufacturing with clean energy and advanced automation.",
  },
];

export default function CardV1Page() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f0f0f5 0%, #e4e4ec 50%, #dddde8 100%)",
        position: "relative",
        fontFamily:
          "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
      }}
    >
      <CardV1 slides={slides} />
    </div>
  );
}
