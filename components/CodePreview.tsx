
import React from 'react';
import type { FileNode } from '../types';

interface CodePreviewProps {
  file: FileNode | null;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ file }) => {
  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Select a file to view its content.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-3 bg-gray-700 text-cyan-300 font-mono text-sm border-b border-gray-600">
        {file.name}
      </div>
      <pre className="p-4 text-sm text-gray-200 overflow-auto h-[calc(100%-2.75rem)] w-full">
        <code className="font-mono">{file.content}</code>
      </pre>
    </div>
  );
};
