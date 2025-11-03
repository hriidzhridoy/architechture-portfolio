import { useEffect, useMemo, useRef, useState } from "react";
import Page from "./Page";
import TurnSheet from "./TurnSheet";
import type { PortfolioPage } from "./types";

interface BookProps {
  pages: PortfolioPage[];
}

export default function Book({ pages }: BookProps) {
  const [spreadIndex, setSpreadIndex] = useState(0); // even index of left page
  const maxSpreadIndex = useMemo(
    () => Math.max(0, pages.length - 2),
    [pages.length]
  );

  // subtle tilt cue on key/click
  const [turning, setTurning] = useState<0 | -1 | 1>(0);

  // container + drag state for full sheet flip
  const containerRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    side: "right" as "left" | "right",
    progress: 0,
  });

  const goNext = () => {
    if (spreadIndex >= maxSpreadIndex) return;
    setTurning(1);
    setTimeout(() => {
      setSpreadIndex((i) => i + 2);
      setTurning(0);
    }, 220);
  };

  const goPrev = () => {
    if (spreadIndex <= 0) return;
    setTurning(-1);
    setTimeout(() => {
      setSpreadIndex((i) => i - 2);
      setTurning(0);
    }, 220);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreadIndex, maxSpreadIndex]);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const isRight = e.clientX >= bounds.left + bounds.width / 2;
    drag.current = {
      active: true,
      startX: e.clientX,
      side: isRight ? "right" : "left",
      progress: 0,
    };
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!drag.current.active || !containerRef.current) return;
    const { side, startX } = drag.current;
    const w = containerRef.current.getBoundingClientRect().width / 2; // page width
    const dx = e.clientX - startX;
    let p = 0;
    if (side === "right")
      p = Math.min(Math.max(-dx / w, 0), 1); // drag left to next
    else p = Math.min(Math.max(dx / w, 0), 1); // drag right to prev
    drag.current.progress = p;
    // re-render to update sheet
    setTurning((t) => t);
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = () => {
    if (!drag.current.active) return;
    const { side, progress } = drag.current;
    drag.current.active = false;
    const flipped = progress > 0.45; // finish threshold
    if (flipped) {
      side === "right" ? goNext() : goPrev();
    } else {
      setTurning(0);
    }
  };

  const leftPage = pages[spreadIndex] ?? null;
  const rightPage = pages[spreadIndex + 1] ?? null;

  // Compute what content goes on the sheet faces
  // NEXT (right drag): front = current right, back = next left (spreadIndex+2)
  const nextLeft = pages[spreadIndex + 2] ?? null;

  // PREV (left drag): front = current left, back = previous right (spreadIndex-1)
  const prevRight = pages[spreadIndex - 1] ?? null;

  // Hide the base page while dragging on that side for realism
  const hideLeft = drag.current.active && drag.current.side === "left";
  const hideRight = drag.current.active && drag.current.side === "right";

  return (
    <div
      ref={containerRef}
      className="w-full max-w-6xl aspect-[16/9] shadow-2xl rounded-xl bg-gradient-to-b from-stone-50 to-stone-200 border border-stone-300 relative overflow-hidden select-none touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* 3D stage */}
      <div className="absolute inset-0 [perspective:1600px]">
        {/* Center spine */}
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-stone-300/80 shadow-[inset_0_0_6px_rgba(0,0,0,0.06)]" />

        {/* Pages underneath */}
        <Page
          side="left"
          title={leftPage?.title}
          turning={turning === -1}
          onEdgeClick={goPrev}
          hidden={hideLeft}
        >
          {leftPage?.content}
        </Page>
        <Page
          side="right"
          title={rightPage?.title}
          turning={turning === 1}
          onEdgeClick={goNext}
          hidden={hideRight}
        >
          {rightPage?.content}
        </Page>

        {/* FULL content sheet on top while dragging */}
        {drag.current.active && drag.current.side === "right" && (
          <TurnSheet
            progress={drag.current.progress}
            side="right"
            frontTitle={rightPage?.title}
            frontContent={rightPage?.content}
            backTitle={nextLeft?.title}
            backContent={nextLeft?.content}
          />
        )}

        {drag.current.active && drag.current.side === "left" && (
          <TurnSheet
            progress={drag.current.progress}
            side="left"
            frontTitle={leftPage?.title}
            frontContent={leftPage?.content}
            backTitle={prevRight?.title}
            backContent={prevRight?.content}
          />
        )}

        {/* Controls */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-stone-600">
          <button
            onClick={goPrev}
            className="px-3 py-1.5 rounded-full border border-stone-300 bg-white/70 hover:bg-white transition"
          >
            ← Prev
          </button>
          <span className="opacity-70 select-none">
            {Math.floor(spreadIndex / 2) + 1} / {Math.ceil(pages.length / 2)}
          </span>
          <button
            onClick={goNext}
            className="px-3 py-1.5 rounded-full border border-stone-300 bg-white/70 hover:bg-white transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
