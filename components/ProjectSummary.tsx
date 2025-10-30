import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProjectSummaryProps {
  markdown: string;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({ markdown }) => {
  return (
    <div className="prose prose-slate max-w-none p-2 prose-headings:text-slate-800 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 prose-a:text-orange-600 hover:prose-a:text-orange-700 prose-code:bg-slate-200 prose-code:rounded prose-code:px-1.5 prose-code:py-1 prose-code:font-mono prose-code:text-sm prose-code:text-orange-800 prose-pre:bg-slate-800 prose-pre:text-slate-100">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
