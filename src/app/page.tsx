import { MainContent } from "@/components/main-content";
import { parseMarkdownContent } from "@/lib/markdown-parser";
import path from "path";

// Force static generation where possible, or stick to server rendering
export const dynamic = "force-static";

export default function Home() {
  // Read from src/data/texts.md
  // In production (Vercel), process.cwd() might be root.
  // We moved texts.md to src/data/texts.md
  const filePath = path.join(process.cwd(), "src", "data", "texts.md");

  // Parse content
  const sections = parseMarkdownContent(filePath);

  return <MainContent sections={sections} />;
}
