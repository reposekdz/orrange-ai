import JSZip from 'jszip';
import saveAs from 'file-saver';
import { FileSystemNode } from '../types';

const addNodesToZip = (nodes: FileSystemNode[], zipFolder: JSZip) => {
  nodes.forEach(node => {
    if (node.type === 'folder') {
      // The `!` asserts that folder is not null, which is safe since jszip's folder method returns the new folder.
      const folder = zipFolder.folder(node.name)!; 
      addNodesToZip(node.children, folder);
    } else {
      // It's a file
      zipFolder.file(node.name, node.content);
    }
  });
};

export const downloadProjectAsZip = (projectName: string, fileTree: FileSystemNode[]): void => {
  const zip = new JSZip();
  addNodesToZip(fileTree, zip);

  zip.generateAsync({ type: 'blob' })
    .then(content => {
      saveAs(content, `${projectName}.zip`);
    })
    .catch(err => {
        console.error("Failed to generate zip file", err);
    });
};