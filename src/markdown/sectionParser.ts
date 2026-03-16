export interface SectionNode {
  title: string;
  level: number;
  path: string[];
  content: string[];
}

export function parseSections(markdown: string): SectionNode[] {
  const lines = markdown.split(/\r?\n/);
  const sections: SectionNode[] = [];
  let currentPath: string[] = [];
  let current: SectionNode | null = null;

  for (const line of lines) {
    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line.trim());
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      currentPath = currentPath.slice(0, level - 1);
      currentPath[level - 1] = title;
      current = {
        title,
        level,
        path: [...currentPath],
        content: []
      };
      sections.push(current);
    } else if (current) {
      current.content.push(line);
    }
  }

  return sections;
}

