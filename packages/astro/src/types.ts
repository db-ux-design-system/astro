/**
 * The front matter of a page.
 */
export interface FrontMatter {
  /**
   * The title of the page.
   */
  title: string;
  /**
   * The author of the page.
   */
  author: string;
  /**
   * The description of the page.
   */
  description?: string;
  /**
   * The creation date of the page.
   */
  date?: Date;
  /**
   * The path to the layout the page should use.
   */
  layout?: string;
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

/**
 * A navigation item that can be used to build the navigation of the application.
 */
export interface NavigationItem {
  /**
   * The title of the navigation item.
   */
  title: string;
  /*
   * An optional icon that can be used to represent the navigation item.
   */
  icon?: string;
  /**
   * An optional path that the navigation item should link to. If none is provided,
   * the navigation item will be rendered as a group of sub-items.
   */
  path?: string;
  /**
   * An optional list of sub-items that will be rendered as a group of navigation
   * items if a path is not provided.
   */
  children?: NavigationItem[];
}
