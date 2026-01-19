import type { MarkdownHeading } from 'astro';
import type { FrontMatter } from 'src/types';

/**
 * Front matter properties specific to the default layout.
 * @see {@link FrontMatter}
 */
export interface DefaultLayoutFrontMatter extends FrontMatter {
  /**
   * Whether the page should render a table of contents.
   * @default true
   */
  toc?: boolean;
  /**
   * Whether the page should render a navigation sidebar. Not visible on mobile devices and not visible
   * if the page does not have any sibling pages.
   * @default true
   */
  nav?: boolean;
}

export interface DefaultLayoutProps {
  headings?: MarkdownHeading[];
  frontmatter?: DefaultLayoutFrontMatter;
}
