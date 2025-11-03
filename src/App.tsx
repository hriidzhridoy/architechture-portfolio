import Book from "./components/Book";
import type { PortfolioPage } from "./components/types";

export default function App() {
  const pages: PortfolioPage[] = [
    {
      title: "Cover",
      content: (
        <div className="space-y-6">
          <h1 className="text-4xl font-black tracking-tight">Asif Hridoy</h1>
          <p className="text-lg opacity-80">
            Frontend Engineer · React · TypeScript · Tailwind
          </p>
          <p className="text-sm opacity-70">
            Swipe or use ←/→ to turn pages. Click the page edge to flip.
          </p>
        </div>
      ),
    },
    {
      title: "About",
      content: (
        <div className="space-y-4 leading-relaxed">
          <p>
            I build clean, accessible, high-performance web apps using React,
            Next.js, TypeScript, and Tailwind. I care about DX, a11y, and
            pixel-perfect UI.
          </p>
          <p>
            I enjoy component architecture, design systems, and solving tricky
            UX flows with simple, composable abstractions.
          </p>
        </div>
      ),
    },
    {
      title: "Projects · 1",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Interview Manager</strong> — multi-step Formik flows, data
            grids, modals, email/SMS integration.
          </li>
          <li>
            <strong>Job Post Builder</strong> — step validation, preview modal,
            draft/submit, custom date pickers.
          </li>
        </ul>
      ),
    },
    {
      title: "Projects · 2",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Sister Concern Editor</strong> — nested arrays, file
            uploads, Yup validation, REST integration.
          </li>
          <li>
            <strong>Posts & Reels</strong> — context providers, infinite lists,
            loaders, skeletons.
          </li>
        </ul>
      ),
    },
    {
      title: "Experience",
      content: (
        <div className="space-y-2">
          <p>
            <strong>Frontend React Developer</strong> — building internal tools
            & product UIs.
          </p>
          <p>
            <strong>Focus</strong>: DX, performance, a11y, testing, and smooth
            forms.
          </p>
        </div>
      ),
    },
    {
      title: "Contact",
      content: (
        <div className="space-y-4">
          <p>Open to roles and collabs.</p>
          <div className="space-y-1">
            <p>
              <span className="font-medium">Email:</span> your@email.com
            </p>
            <p>
              <span className="font-medium">GitHub:</span> github.com/yourhandle
            </p>
            <p>
              <span className="font-medium">Location:</span> Dhaka, BD
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-neutral-100 text-neutral-900 flex items-center justify-center p-4">
      <Book pages={pages} />
    </div>
  );
}
