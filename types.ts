
export interface UserInput {
  projectName: string;
  description: string;
  frontendTech: string;
  backendTech: string;
  databaseTech: string;
  advancedFeatures: string;
}

export interface FileNode {
  type: 'file';
  name: string;
  content: string;
}

export interface FolderNode {
  type: 'folder';
  name: string;
  children: (FileNode | FolderNode)[];
}

export type FileSystemNode = FileNode | FolderNode;

export interface ProjectData {
  projectName: string;
  fileTree: FileSystemNode[];
}
