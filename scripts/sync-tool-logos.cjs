#!/usr/bin/env node
/**
 * Regenerate public/assets/logos/*.svg paths in src/lib/tool-brand-icons.ts from simple-icons.
 * Run: node scripts/sync-tool-logos.cjs
 */
const fs = require("fs");
const path = require("path");
const {
  siAnthropic,
  siCursor,
  siGithubcopilot,
  siGooglegemini,
  siWindsurf,
} = require("simple-icons");

const root = path.join(__dirname, "..");
const logosDir = path.join(root, "public/assets/logos");

const openaiPath = fs
  .readFileSync(path.join(logosDir, "openai.svg"), "utf8")
  .match(/d="([^"]+)"/)?.[1];

if (!openaiPath) {
  console.error("openai.svg missing or invalid");
  process.exit(1);
}

const openaiIcon = { title: "OpenAI", path: openaiPath, hex: "10A37F" };

const files = {
  cursor: siCursor,
  anthropic: siAnthropic,
  githubcopilot: siGithubcopilot,
  googlegemini: siGooglegemini,
  windsurf: siWindsurf,
  openai: openaiIcon,
};

for (const [name, icon] of Object.entries(files)) {
  const svg = `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#${icon.hex}"><title>${icon.title}</title><path d="${icon.path}"/></svg>`;
  fs.writeFileSync(path.join(logosDir, `${name}.svg`), svg);
  console.log("wrote", `${name}.svg`);
}

const toolMap = {
  cursor: { icon: siCursor, src: "/assets/logos/cursor.svg" },
  "github-copilot": { icon: siGithubcopilot, src: "/assets/logos/githubcopilot.svg" },
  claude: { icon: siAnthropic, src: "/assets/logos/anthropic.svg" },
  chatgpt: { icon: openaiIcon, src: "/assets/logos/openai.svg" },
  "anthropic-api": { icon: siAnthropic, src: "/assets/logos/anthropic.svg" },
  "openai-api": { icon: openaiIcon, src: "/assets/logos/openai.svg" },
  gemini: { icon: siGooglegemini, src: "/assets/logos/googlegemini.svg" },
  windsurf: { icon: siWindsurf, src: "/assets/logos/windsurf.svg" },
};

let ts = `import type { AITool } from "@/types";

/** Official brand marks — SVG paths from Simple Icons (simpleicons.org). OpenAI blossom from vector set. */
export type ToolBrandIcon = {
  title: string;
  path: string;
  hex: string;
  src: string;
};

export const TOOL_BRAND: Record<AITool, ToolBrandIcon> = {
`;

for (const [tool, { icon, src }] of Object.entries(toolMap)) {
  ts += `  "${tool}": { title: ${JSON.stringify(icon.title)}, path: ${JSON.stringify(icon.path)}, hex: ${JSON.stringify(icon.hex)}, src: ${JSON.stringify(src)} },\n`;
}

ts += `};

export const BRAND_COLOR: Record<AITool, string> = Object.fromEntries(
  (Object.entries(TOOL_BRAND) as [AITool, ToolBrandIcon][]).map(([tool, b]) => [
    tool,
    \`#\${b.hex}\`,
  ])
) as Record<AITool, string>;
`;

fs.writeFileSync(path.join(root, "src/lib/tool-brand-icons.ts"), ts);
console.log("updated src/lib/tool-brand-icons.ts");
