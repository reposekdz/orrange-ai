import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileNode } from '../types';
import { getFileExtension } from '../utils/fileUtils';

interface CodePreviewProps {
    file: FileNode | null;
}

const languageMap: { [key: string]: string } = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    css: 'css',
    html: 'html',
    json: 'json',
    md: 'markdown',
    mjs: 'javascript',
    cjs: 'javascript',
    // Add other mappings as needed
};

export const CodePreview: React.FC<CodePreviewProps> = ({ file }) => {
    if (!file || file.children) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] text-slate-400">
                <p className="text-lg">Select a file to view its content</p>
                <p className="text-sm mt-2">You can see the generated code here.</p>
            </div>
        );
    }

    const extension = getFileExtension(file.name);
    const language = extension ? languageMap[extension] || 'plaintext' : 'plaintext';

    return (
        <div className="h-full bg-[#1e1e1e] flex flex-col">
             <div className="p-3 bg-slate-800 text-slate-300 border-b border-slate-700">
                {file.path}
             </div>
             <div className="flex-grow overflow-auto">
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, height: '100%', width: '100%', backgroundColor: 'transparent' }}
                    codeTagProps={{ style: { fontFamily: "'Fira Code', 'Dank Mono', monospace" } }}
                    showLineNumbers
                >
                    {file.content || ''}
                </SyntaxHighlighter>
             </div>
        </div>
    );
};
