import type { MarkdownHeading } from 'astro';

export interface AppContentProps {
  headings?: MarkdownHeading[];
  title?: string;
  toc?: boolean;
}
