export interface MarkdownSection {
  heading: string;
  level: number;
  content: string[];
  path: string[];
}

export function parseSections(markdown: string): MarkdownSection[] {
  const lines = markdown.split(/\r?\n/);
  const sections: MarkdownSection[] = [];
  const stack: { level: number; title: string }[] = [];

  let current: MarkdownSection | null = null;

  for (const line of lines) {
    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line.trim());
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      stack.push({ level, title });

      const path = stack.map((s) => s.title);
      current = {
        heading: title,
        level,
        content: [],
        path
      };
      sections.push(current);
    } else if (current) {
      current.content.push(line);
    }
  }

  return sections;
}

