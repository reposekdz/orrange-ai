import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { FileNode } from '../types';

interface CodePreviewProps {
  file: FileNode | null;
}

const getLanguage = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'js':
        case 'jsx':
            return 'javascript';
        case 'ts':
        case 'tsx':
            return 'typescript';
        case 'css':
            return 'css';
        case 'json':
            return 'json';
        case 'md':
            return 'markdown';
        case 'html':
            return 'html';
        case 'yml':
        case 'yaml':
            return 'yaml';
        case 'dockerfile':
            return 'dockerfile';
        default:
            if (fileName.toLowerCase().includes('dockerfile')) return 'dockerfile';
            return 'plaintext';
    }
};

export const CodePreview: React.FC<CodePreviewProps> = ({ file }) => {
  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p>Select a file to view its content.</p>
      </div>
    );
  }
  
  const language = getLanguage(file.name);

  return (
    <div className="h-full bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
      <div className="p-3 bg-slate-50 text-orange-700 font-mono text-sm border-b border-slate-200">
        {file.name}
      </div>
      <div className="overflow-auto h-[calc(100%-2.8rem)] w-full text-sm">
        <SyntaxHighlighter
          language={language}
          style={oneLight}
          customStyle={{
            margin: 0,
            padding: '1rem',
            height: '100%',
            backgroundColor: '#ffffff',
          }}
          codeTagProps={{
            style: {
                fontFamily: '"Fira Code", monospace',
                fontSize: '0.875rem'
            }
          }}
          showLineNumbers
        >
          {file.content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
