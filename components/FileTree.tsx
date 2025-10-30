import React, { useState } from 'react';
import { FileNode } from '../types';
import { FileIcon } from './icons/FileIcon';
import { FolderIcon } from './icons/FolderIcon';

interface FileTreeProps {
    files: FileNode[];
    onFileSelect: (file: FileNode) => void;
    selectedFile: FileNode | null;
}

const FileTreeNode: React.FC<{ node: FileNode; onFileSelect: (file: FileNode) => void; selectedFile: FileNode | null; level?: number }> = ({ node, onFileSelect, selectedFile, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isDirectory = !!node.children;

    const handleSelect = () => {
        if (!isDirectory) {
            onFileSelect(node);
        } else {
            setIsOpen(!isOpen);
        }
    };

    const isSelected = !isDirectory && selectedFile?.path === node.path;

    return (
        <div>
            <div
                onClick={handleSelect}
                className={`flex items-center p-1 cursor-pointer rounded text-sm ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'}`}
                style={{ paddingLeft: `${level * 1.25 + 0.25}rem` }}
            >
                {isDirectory ? <FolderIcon isOpen={isOpen} className="w-4 h-4 mr-2 text-orange-400 flex-shrink-0" /> : <FileIcon className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />}
                <span className="truncate">{node.name}</span>
            </div>
            {isDirectory && isOpen && node.children && (
                <div>
                    {node.children.map(child => (
                        <FileTreeNode key={child.path} node={child} onFileSelect={onFileSelect} selectedFile={selectedFile} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export const FileTree: React.FC<FileTreeProps> = ({ files, onFileSelect, selectedFile }) => {
    return (
        <div className="bg-slate-800 text-white p-2 h-full overflow-y-auto">
            {files.map(node => (
                <FileTreeNode key={node.path} node={node} onFileSelect={onFileSelect} selectedFile={selectedFile} />
            ))}
        </div>
    );
};
