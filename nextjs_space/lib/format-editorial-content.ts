/**
 * Global editorial content formatter.
 * 
 * Handles both plain text and HTML content:
 * - If content already has HTML block tags (<p>, <h2>, <div>, etc.), it's returned as-is
 * - If content is plain text, it converts it to semantic HTML:
 *   - Double newlines → paragraph breaks (<p>)
 *   - ALL-CAPS lines → <h2> subheadings
 *   - Lines starting with quotes → <blockquote>
 *   - Single newlines within a block → <br>
 */

const HTML_BLOCK_TAGS = /<(p|h[1-6]|div|section|article|blockquote|ul|ol|li|table|figure|pre)([\s>])/i;

function isHtmlContent(content: string): boolean {
  return HTML_BLOCK_TAGS.test(content);
}

function isAllCapsHeading(line: string): boolean {
  const trimmed = line.trim();
  // Must be at least 4 chars, mostly uppercase letters, no period at end
  if (trimmed.length < 4) return false;
  if (trimmed.endsWith('.')) return false;
  const letters = trimmed.replace(/[^a-zA-Z]/g, '');
  if (letters.length < 3) return false;
  const upperCount = letters.replace(/[^A-Z]/g, '').length;
  return upperCount / letters.length > 0.75;
}

function isQuoteLine(line: string): boolean {
  const trimmed = line.trim();
  return (
    (trimmed.startsWith('"') || trimmed.startsWith('\u201c') || trimmed.startsWith('\u2018')) &&
    trimmed.length > 20
  );
}

export function formatEditorialContent(content: string): string {
  if (!content || !content.trim()) return '';
  
  // If already HTML with block-level tags, return as-is
  if (isHtmlContent(content)) {
    return content;
  }
  
  // Split into blocks by double newline (paragraph separator)
  const blocks = content.split(/\n\s*\n/).filter(b => b.trim());
  
  const htmlParts: string[] = [];
  
  for (const block of blocks) {
    const trimmed = block.trim();
    
    if (!trimmed) continue;
    
    // Check if it's an all-caps heading
    if (isAllCapsHeading(trimmed) && trimmed.length < 120) {
      // Convert to title case for the heading
      const titleCase = trimmed
        .toLowerCase()
        .replace(/(?:^|\s|[-—])\w/g, c => c.toUpperCase());
      htmlParts.push(`<h2>${titleCase}</h2>`);
      continue;
    }
    
    // Check if it's a quote
    if (isQuoteLine(trimmed)) {
      htmlParts.push(`<blockquote><p>${trimmed}</p></blockquote>`);
      continue;
    }
    
    // Regular paragraph - preserve single line breaks as <br>
    const withBreaks = trimmed.replace(/\n/g, '<br />');
    htmlParts.push(`<p>${withBreaks}</p>`);
  }
  
  return htmlParts.join('\n');
}
