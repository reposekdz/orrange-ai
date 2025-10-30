import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileNode } from '../types';

function addFilesToZip(zip: JSZip, files: FileNode[]) {
    files.forEach(file => {
        if (file.children) {
            // It's a directory
            const dir = zip.folder(file.name);
            if (dir) {
                addFilesToZip(dir, file.children);
            }
        } else {
            // It's a file
            zip.file(file.name, file.content || '');
        }
    });
}

export async function downloadProjectAsZip(projectName: string, files: FileNode[]) {
    const zip = new JSZip();
    addFilesToZip(zip, files);

    try {
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `${projectName}.zip`);
    } catch(e) {
        console.error("Error creating zip file", e);
        alert("Could not download project. See console for details.");
    }
}
