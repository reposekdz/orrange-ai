import React, { useState } from 'react';
import type { FileSystemNode, FileNode } from '../types';
import { FolderIcon } from './icons/FolderIcon';
import { FileIcon } from './icons/FileIcon';

interface FileTreeProps {
  fileTree: FileSystemNode[];
  onFileSelect: (file: FileNode) => void;
  selectedFile: FileNode | null;
}

const FileSystemNodeComponent: React.FC<{
  node: FileSystemNode;
  onFileSelect: (file: FileNode) => void;
  selectedFile: FileNode | null;
  level: number;
}> = ({ node, onFileSelect, selectedFile, level }) => {
  const [isOpen, setIsOpen] = useState(true);
  const indentStyle = { paddingLeft: `${level * 1.5}rem` };

  if (node.type === 'folder') {
    return (
      <div>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center p-1.5 rounded-md hover:bg-slate-200 cursor-pointer text-slate-700"
          style={indentStyle}
        >
          <FolderIcon isOpen={isOpen} />
          <span className="ml-2 font-medium">{node.name}</span>
        </div>
        {isOpen && (
          <div>
            {node.children.map((child, index) => (
              <FileSystemNodeComponent
                key={`${child.name}-${index}`}
                node={child}
                onFileSelect={onFileSelect}
                selectedFile={selectedFile}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    // It's a file
    const isSelected = selectedFile?.name === node.name && selectedFile?.content === node.content;
    return (
      <div
        onClick={() => onFileSelect(node)}
        className={`flex items-center p-1.5 rounded-md hover:bg-slate-200 cursor-pointer ${isSelected ? 'bg-orange-100 text-orange-800 font-semibold' : 'text-slate-600'}`}
        style={indentStyle}
      >
        <FileIcon />
        <span className="ml-2">{node.name}</span>
      </div>
    );
  }
};


export const FileTree: React.FC<FileTreeProps> = ({ fileTree, onFileSelect, selectedFile }) => {
  return (
    <div className="text-sm">
      {fileTree.map((node, index) => (
        <FileSystemNodeComponent 
            key={`${node.name}-${index}`} 
            node={node} 
            onFileSelect={onFileSelect} 
            selectedFile={selectedFile}
            level={0}
        />
      ))}
    </div>
  );
};
