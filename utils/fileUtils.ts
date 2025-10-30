import { FileNode, ProjectFile } from '../types';

export const buildFileTree = (files: ProjectFile[]): FileNode[] => {
  const root: FileNode = { name: 'root', path: '', children: [] };

  files.forEach(file => {
    const parts = file.path.split('/');
    let currentNode = root;

    parts.forEach((part, index) => {
        if (!currentNode.children) {
            currentNode.children = [];
        }
      let childNode = currentNode.children.find(child => child.name === part);

      if (!childNode) {
        const isFile = index === parts.length - 1;
        childNode = {
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          ...(isFile ? { content: file.content } : { children: [] }),
        };
        currentNode.children.push(childNode);
      }
      currentNode = childNode;
    });
  });

  // Sort files and directories
  const sortNodes = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
        if (a.children && !b.children) return -1; // directories first
        if (!a.children && b.children) return 1;
        return a.name.localeCompare(b.name); // then sort by name
    });
    nodes.forEach(node => {
        if (node.children) {
            sortNodes(node.children);
        }
    });
  };
  
  if (root.children) {
      sortNodes(root.children);
  }

  return root.children || [];
};

export function getFileExtension(filename: string): string | null {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot === -1 || lastDot === 0) {
      return null;
    }
    return filename.substring(lastDot + 1);
}
