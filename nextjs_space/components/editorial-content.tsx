'use client';

import { formatEditorialContent } from '@/lib/format-editorial-content';
import { useMemo } from 'react';

interface EditorialContentProps {
  content: string;
  className?: string;
}

/**
 * Global editorial content renderer.
 * Automatically formats plain text into semantic HTML and applies
 * magazine-quality typography styles via Tailwind prose.
 */
export function EditorialContent({ content, className = '' }: EditorialContentProps) {
  const formattedHtml = useMemo(() => formatEditorialContent(content), [content]);

  if (!formattedHtml) return null;

  return (
    <div
      className={`editorial-body prose prose-lg max-w-none
        prose-headings:font-heading prose-headings:text-brand-purple prose-headings:font-bold
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-brand-purple/80 prose-p:leading-[1.85] prose-p:mb-6
        prose-blockquote:border-l-4 prose-blockquote:border-brand-neon prose-blockquote:bg-brand-gray
        prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
        prose-blockquote:text-brand-purple/90 prose-blockquote:italic prose-blockquote:my-8
        prose-blockquote:not-italic prose-blockquote:font-medium
        prose-strong:text-brand-purple prose-strong:font-bold
        prose-a:text-brand-purple prose-a:underline prose-a:decoration-brand-neon
        prose-ul:my-6 prose-ul:pl-6 prose-ol:my-6 prose-ol:pl-6
        prose-li:text-brand-purple/80 prose-li:mb-2
        prose-img:rounded-lg prose-img:my-8
        ${className}`}
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
}
