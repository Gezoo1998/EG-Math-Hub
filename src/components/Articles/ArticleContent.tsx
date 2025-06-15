import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface ArticleContentProps {
  content: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  // Simple function to render content with LaTeX support
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Handle block math ($$...$$)
      if (line.trim().startsWith('$$') && line.trim().endsWith('$$')) {
        const math = line.trim().slice(2, -2);
        return (
          <div key={index} className="my-4 text-center">
            <BlockMath math={math} />
          </div>
        );
      }

      // Handle headers
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">
            {line.slice(2)}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-semibold text-white mt-6 mb-3">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-white mt-4 mb-2">
            {line.slice(4)}
          </h3>
        );
      }

      // Handle empty lines
      if (line.trim() === '') {
        return <div key={index} className="my-2"></div>;
      }

      // Handle regular paragraphs with inline math
      const renderInlineMath = (text: string) => {
        const parts = text.split(/(\$[^$]+\$)/);
        return parts.map((part, partIndex) => {
          if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
            const math = part.slice(1, -1);
            return <InlineMath key={partIndex} math={math} />;
          }
          return part;
        });
      };

      return (
        <p key={index} className="text-white/90 leading-relaxed mb-4">
          {renderInlineMath(line)}
        </p>
      );
    });
  };

  return (
    <div className="prose prose-invert max-w-none">
      {renderContent(content)}
    </div>
  );
};

export default ArticleContent;