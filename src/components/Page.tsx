import type { PropsWithChildren } from "react";
import type { Side } from "./types";

interface PageProps extends PropsWithChildren {
  side: Side;
  title?: string;
  turning?: boolean; // small tilt cue
  onEdgeClick?: () => void;
  hidden?: boolean; // hide when a sheet is on top during drag
}

export default function Page({
  side,
  title,
  turning,
  onEdgeClick,
  hidden,
  children,
}: PageProps) {
  const isLeft = side === "left";
  return (
    <div
      className={[
        "absolute top-0 h-full w-1/2 p-6 md:p-10",
        isLeft ? "left-0 origin-right" : "right-0 origin-left",
        "[transform-style:preserve-3d]",
        hidden ? "opacity-0" : "opacity-100",
      ].join(" ")}
      style={{
        transform: turning
          ? `rotateY(${isLeft ? 3 : -3}deg) translateZ(0)`
          : `rotateY(${isLeft ? -1.2 : 1.2}deg) translateZ(0)`,
        transition: "transform 220ms ease, opacity 120ms ease",
      }}
    >
      <div
        className={[
          "relative h-full w-full rounded-[1.1rem] border",
          "bg-[conic-gradient(at_120%_120%,#faf7f2,#ffffff_25%,#fdfbf8_50%,#ffffff_75%,#faf7f2)]",
          "border-stone-300 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.6)]",
        ].join(" ")}
      >
        {/* Transparent edge to click */}
        <button
          onClick={onEdgeClick}
          className={[
            "absolute inset-y-0 w-8 opacity-0",
            isLeft ? "left-0" : "right-0",
          ].join(" ")}
          title={isLeft ? "Previous" : "Next"}
        />

        {/* Spine gradient */}
        <div
          className={[
            "absolute inset-y-0 w-16 pointer-events-none",
            isLeft
              ? "right-0 bg-gradient-to-l from-stone-300/30"
              : "left-0 bg-gradient-to-r from-stone-300/30",
          ].join(" ")}
        />

        {/* Content */}
        <div className="h-full w-full overflow-auto no-scrollbar">
          <header className="flex items-center justify-between gap-4 pt-2 pb-4 mb-4 border-b border-stone-200">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-stone-700">
              {title}
            </h2>
            <div className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600">
              Portfolio Book
            </div>
          </header>
          <main className="prose prose-stone max-w-none">{children}</main>
        </div>
      </div>
    </div>
  );
}
