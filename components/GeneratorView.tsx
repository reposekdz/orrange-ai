import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import { FileTree } from './FileTree';
import { CodePreview } from './CodePreview';
import { PreviewPanel } from './PreviewPanel';
import { ConversationPanel } from './ConversationPanel';
import { PromptInput } from './PromptInput';
import { FileNode, Message, Project, ProjectFile } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { downloadProjectAsZip } from '../utils/zipUtils';
import { buildFileTree } from '../utils/fileUtils';
import { iterateComponent } from '../services/geminiService';

import { DesktopIcon } from './icons/DesktopIcon';
import { TabletIcon } from './icons/TabletIcon';
import { MobileIcon } from './icons/MobileIcon';

interface GeneratorViewProps {
    initialProject: Project;
    initialMessages: Message[];
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({ initialProject, initialMessages }) => {
    const [project, setProject] = useState<Project>(initialProject);
    const [fileTree, setFileTree] = useState<FileNode[]>(buildFileTree(initialProject.files));
    const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    useEffect(() => {
        // Auto-select the main App file on initial load
        const appFile = initialProject.files.find(f => f.path.endsWith('App.tsx'));
        if (appFile) {
            setSelectedFile({ name: 'App.tsx', path: appFile.path, content: appFile.content });
        }
    }, [initialProject.files]);


    const handleFileSelect = (file: FileNode) => {
        if (!file.children) {
            setSelectedFile(file);
        }
    };

    const handleSend = async (prompt: string) => {
        setIsLoading(true);
        setError(null);

        const userMessage: Message = { id: Date.now().toString(), text: prompt, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        try {
            const result = await iterateComponent(prompt, project.files, messages);

            const newProject = { summary: result.summary, files: result.files as ProjectFile[] };
            setProject(newProject);
            setFileTree(buildFileTree(newProject.files));

            const botMessage: Message = { id: (Date.now() + 1).toString(), text: result.summary, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);

            if (selectedFile) {
                const updatedFile = newProject.files.find((f: ProjectFile) => f.path === selectedFile.path);
                if (updatedFile) {
                    setSelectedFile({ ...selectedFile, content: updatedFile.content });
                } else {
                    setSelectedFile(null);
                }
            }
        } catch (e: any) {
            const errorMessageText = e.message || "An unknown error occurred.";
            setError(errorMessageText);
            const errorMessage: Message = { id: (Date.now() + 1).toString(), text: errorMessageText, sender: 'system' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        const projectName = "gemini-generated-app";
        downloadProjectAsZip(projectName, fileTree);
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <Split
                sizes={[25, 45, 30]}
                minSize={[250, 300, 300]}
                gutterSize={8}
                className="flex flex-1 h-full"
                dragInterval={30}
                snapOffset={10}
            >
                {/* Left Panel: File Tree and Conversation */}
                <div className="flex flex-col bg-slate-800 overflow-hidden">
                    <div className="p-3 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                        <h2 className="text-lg font-bold truncate">Project Explorer</h2>
                        <button onClick={handleDownload} className="p-2 hover:bg-slate-700 rounded-lg" title="Download Project as ZIP">
                            <DownloadIcon className="w-5 h-5"/>
                        </button>
                    </div>
                    <Split direction="vertical" sizes={[50, 50]} minSize={150} className="flex-grow flex flex-col">
                        <div className="overflow-y-auto">
                           <FileTree files={fileTree} onFileSelect={handleFileSelect} selectedFile={selectedFile} />
                        </div>
                        <div className="flex flex-col border-t border-slate-700 bg-slate-900">
                            <ConversationPanel messages={messages} />
                            <PromptInput onSend={handleSend} isLoading={isLoading} />
                             {error && <div className="p-2 text-red-400 bg-red-900/50 text-xs text-center">{error}</div>}
                        </div>
                    </Split>
                </div>

                {/* Middle Panel: Code Preview */}
                <div className="bg-slate-900 overflow-hidden">
                     <CodePreview file={selectedFile} />
                </div>

                {/* Right Panel: Component Preview */}
                <div className="bg-slate-800 flex flex-col overflow-hidden">
                    <div className="p-2 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                        <h2 className="text-lg font-semibold">Preview</h2>
                        <div className="flex items-center space-x-1 bg-slate-700 p-1 rounded-md">
                             <button onClick={() => setViewport('desktop')} className={`p-1 rounded ${viewport === 'desktop' ? 'bg-blue-600' : 'hover:bg-slate-600'}`} title="Desktop View"><DesktopIcon className="w-5 h-5"/></button>
                            <button onClick={() => setViewport('tablet')} className={`p-1 rounded ${viewport === 'tablet' ? 'bg-blue-600' : 'hover:bg-slate-600'}`} title="Tablet View"><TabletIcon className="w-5 h-5"/></button>
                            <button onClick={() => setViewport('mobile')} className={`p-1 rounded ${viewport === 'mobile' ? 'bg-blue-600' : 'hover:bg-slate-600'}`} title="Mobile View"><MobileIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <PreviewPanel files={fileTree} viewport={viewport} />
                    </div>
                </div>
            </Split>
        </div>
    );
};
