export interface FileNode {
  name: string;
  path: string;
  content?: string;
  children?: FileNode[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
}

export interface ProjectFile {
    path: string;
    content: string;
}

export interface Project {
  summary: string;
  files: ProjectFile[];
}
