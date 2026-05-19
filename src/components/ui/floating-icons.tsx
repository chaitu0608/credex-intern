"use client";

const ICONS = [
  { label: "OpenAI", style: "top-[18%] left-[8%] -rotate-12" },
  { label: "Claude", style: "top-[22%] right-[10%] rotate-6" },
  { label: "Cursor", style: "top-[42%] left-[5%] rotate-3" },
  { label: "Copilot", style: "top-[38%] right-[6%] -rotate-6" },
  { label: "Gemini", style: "bottom-[32%] left-[12%] -rotate-3" },
  { label: "AWS", style: "bottom-[28%] right-[14%] rotate-12" },
];

export function FloatingIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block" aria-hidden>
      {ICONS.map((icon) => (
        <div
          key={icon.label}
          className={`absolute flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200/80 bg-white/70 text-[10px] font-semibold text-stone-500 shadow-sm backdrop-blur-sm ${icon.style}`}
        >
          {icon.label.slice(0, 2)}
        </div>
      ))}
    </div>
  );
}
