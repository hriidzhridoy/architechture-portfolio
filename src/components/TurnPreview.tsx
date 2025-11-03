import type { Side } from "./types";

interface TurnPreviewProps {
  progress: number; // 0..1
  side: Side; // which side is being dragged
}

// A lightweight, real-ish page curl preview overlay using rotateY, skew, and soft masks.
export default function TurnPreview({ progress, side }: TurnPreviewProps) {
  if (progress <= 0) return null;

  const isRight = side === "right";
  const rot = (isRight ? -1 : 1) * (180 * progress * 0.9); // up to ~162deg
  const skew = (isRight ? -1 : 1) * (10 * progress);
  const translateZ = 0;

  // Soft mask for thin-paper feel
  const maskGradient = isRight
    ? "linear-gradient(to left, rgba(0,0,0,0.85), rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.0))"
    : "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.0))";

  // Shadow falling onto the opposite page
  const falloffShadow = isRight
    ? "shadow-[40px_0_60px_-20px_rgba(0,0,0,0.35)]"
    : "shadow-[-40px_0_60px_-20px_rgba(0,0,0,0.35)]";

  return (
    <div className="absolute inset-0 [perspective:1600px] pointer-events-none">
      <div
        className={[
          "absolute top-0 h-full w-1/2",
          isRight ? "right-0 origin-left" : "left-0 origin-right",
        ].join(" ")}
        style={{
          transform: `rotateY(${rot}deg) skewY(${skew}deg) translateZ(${translateZ}px)`,
          transition: "transform 40ms linear",
        }}
      >
        <div
          className={[
            "h-full w-full rounded-[1.1rem] border border-stone-300 bg-white/95",
            "[transform-style:preserve-3d]",
            falloffShadow,
          ].join(" ")}
          style={{
            backgroundImage:
              "conic-gradient(at 120% 120%, #faf7f2, #ffffff 25%, #fdfbf8 50%, #ffffff 75%, #faf7f2)",
            WebkitMaskImage: maskGradient as any,
            maskImage: maskGradient as any,
          }}
        >
          {/* Fold highlight */}
          <div
            className={[
              "absolute inset-y-0 w-10",
              isRight ? "left-0" : "right-0",
              "bg-gradient-to-r from-white/70 to-transparent",
            ].join(" ")}
            style={{ opacity: 0.6 + progress * 0.2 }}
          />
          {/* Rim shadow near fold */}
          <div
            className={[
              "absolute inset-y-0 w-8",
              isRight ? "right-0" : "left-0",
              "bg-gradient-to-l from-black/20 to-transparent",
            ].join(" ")}
            style={{ opacity: 0.25 + progress * 0.25 }}
          />
        </div>
      </div>
    </div>
  );
}
