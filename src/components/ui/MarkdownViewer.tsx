import React from 'react';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

/**
 * Safe, dependency-free Markdown renderer that formats standard markdown structures
 * (bold, italic, lists, quotes, inline code, headings) without raw HTML injection.
 */
export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = '' }) => {
  const lines = content.split('\n');

  const renderInlineFormatted = (text: string): React.ReactNode => {
    // Process bold (**text**) and code (`code`)
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-bold text-white">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code key={match.index} className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs text-[#60A5FA]">
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-gray-300">
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = match.index + token.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`space-y-2 text-xs sm:text-sm font-sans leading-relaxed ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Heading 3 or 4
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-sm font-bold text-white font-sans mt-3 mb-1 uppercase tracking-wider">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }

        // Heading 2
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-base font-bold text-white font-sans mt-3 mb-1">
              {trimmed.replace('## ', '')}
            </h3>
          );
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/[0.03] border-l-2 border-[#0070F3] text-xs font-sans text-gray-300 italic my-2"
            >
              {renderInlineFormatted(trimmed.replace('> ', ''))}
            </div>
          );
        }

        // Bullet point
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.replace(/^[•\-\*]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 text-gray-300 pl-1">
              <span className="text-[#0070F3] font-bold text-xs mt-0.5">•</span>
              <span className="flex-1">{renderInlineFormatted(bulletText)}</span>
            </div>
          );
        }

        // Numbered list
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 text-gray-300 pl-1">
              <span className="text-xs font-mono font-bold text-[#0070F3] shrink-0 mt-0.5">
                {numberedMatch[1]}.
              </span>
              <span className="flex-1">{renderInlineFormatted(numberedMatch[2])}</span>
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-gray-200">
            {renderInlineFormatted(line)}
          </p>
        );
      })}
    </div>
  );
};
