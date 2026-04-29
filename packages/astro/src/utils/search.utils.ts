/**
 * Get a start and end index of a content string based on a search term
 */
export const getMarkedContent = (
  content: string,
  term: string,
  range: number = 50
): { start: number; termIndex: number; end: number } => {
  let start = 0;
  let end = content.length - 1;

  const termIndex = content.toLowerCase().indexOf(term.toLowerCase());
  if (termIndex - range > 0) {
    start = termIndex - range;
  }
  if (termIndex + range < end) {
    end = termIndex + range;
  }

  return { start, termIndex, end };
};
