import type { FrontMatter } from '.';

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
