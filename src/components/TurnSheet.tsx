import type { ReactNode } from "react";
import type { Side } from "./types";

interface TurnSheetProps {
  progress: number; // 0..1
  side: Side; // which side user is turning
  frontTitle?: string;
  backTitle?: string;
  frontContent?: ReactNode; // content currently turning away
  backContent?: ReactNode; // content being revealed
}

/**
 * A 3D sheet that flips from the selected side.
 * - The FRONT face shows the page currently being turned (right or left).
 * - The BACK face shows the upcoming/revealed page.
 */
export default function TurnSheet({
  progress,
  side,
  frontTitle,
  backTitle,
  frontContent,
  backContent,
}: TurnSheetProps) {
  if (progress <= 0) return null;

  const isRight = side === "right";
  // Rotate from 0 -> ~180deg depending on direction
  const rot = (isRight ? -1 : 1) * (180 * progress);
  const originClass = isRight ? "right-0 origin-left" : "left-0 origin-right";
  const containerSideClass = isRight ? "right-0" : "left-0";

  // Soft rim shadows
  const rimShadow = isRight
    ? "shadow-[40px_0_60px_-20px_rgba(0,0,0,0.35)]"
    : "shadow-[-40px_0_60px_-20px_rgba(0,0,0,0.35)]";

  return (
    <div className="absolute inset-0 [perspective:1600px] pointer-events-none">
      <div
        className={[
          "absolute top-0 h-full w-1/2",
          originClass,
          "[transform-style:preserve-3d]",
        ].join(" ")}
        style={{
          transform: `rotateY(${rot}deg)`,
          transition: "transform 40ms linear",
        }}
      >
        {/* FRONT face (face user) */}
        <div
          className={[
            "absolute inset-0 rounded-[1.1rem] border border-stone-300 bg-white/95",
            "backface-hidden",
            rimShadow,
          ].join(" ")}
          style={{
            backgroundImage:
              "conic-gradient(at 120% 120%, #faf7f2, #ffffff 25%, #fdfbf8 50%, #ffffff 75%, #faf7f2)",
          }}
        >
          <Face title={frontTitle}>{frontContent}</Face>
        </div>

        {/* BACK face (shows revealed page) */}
        <div
          className={[
            "absolute inset-0 rounded-[1.1rem] border border-stone-300 bg-white/95",
            "backface-hidden",
          ].join(" ")}
          style={{
            transform: "rotateY(180deg)",
            backgroundImage:
              "conic-gradient(at 120% 120%, #faf7f2, #ffffff 25%, #fdfbf8 50%, #ffffff 75%, #faf7f2)",
            boxShadow: isRight
              ? "inset -40px 0 60px -30px rgba(0,0,0,0.25)"
              : "inset 40px 0 60px -30px rgba(0,0,0,0.25)",
          }}
        >
          <Face title={backTitle}>{backContent}</Face>
        </div>

        {/* Fold highlights near spine for extra realism */}
        <div
          className={[
            "absolute inset-y-0 w-10 pointer-events-none",
            containerSideClass,
            "bg-gradient-to-r from-white/60 to-transparent",
          ].join(" ")}
          style={{ opacity: 0.6 + progress * 0.2 }}
        />
      </div>
    </div>
  );
}

function Face({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="h-full w-full flex flex-col">
        <header className="flex items-center justify-between gap-4 pt-2 pb-4 mb-4 border-b border-stone-200 px-6 md:px-10">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-stone-700">
            {title}
          </h2>
          <div className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600">
            Portfolio Book
          </div>
        </header>
        <main className="prose prose-stone max-w-none px-6 md:px-10 pb-8 overflow-auto no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
