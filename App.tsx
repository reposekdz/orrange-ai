import React, { useState, useCallback } from 'react';
import { InputPanel } from './components/InputPanel';
import { FileTree } from './components/FileTree';
import { CodePreview } from './components/CodePreview';
import { ProjectSummary } from './components/ProjectSummary';
import { generateProject } from './services/geminiService';
import type { FileNode, ProjectData, UserInput } from './types';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { downloadProjectAsZip } from './utils/zipUtils';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    projectName: 'my-blog-app',
    description: 'A simple blog application with posts and comments.',
    frontendTech: 'React with TypeScript and Tailwind CSS',
    backendTech: 'Node.js with Express and TypeScript',
    databaseTech: 'MongoDB with Mongoose',
    advancedFeatures: 'User authentication with JWT. REST API for posts. Include Dockerfiles and a basic GitHub Actions CI workflow.',
  });
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'files'>('summary');


  const handleGenerateClick = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProjectData(null);
    setSelectedFile(null);
    setActiveTab('summary');
    try {
      const data = await generateProject(userInput);
      setProjectData(data);
    } catch (err) {
      setError(err instanceof Error ? `Failed to generate project: ${err.message}` : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  const handleFileSelect = useCallback((file: FileNode) => {
    setSelectedFile(file);
  }, []);

  const handleDownload = () => {
    if (projectData) {
      downloadProjectAsZip(projectData.projectName, projectData.fileTree);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200 p-4 shadow-sm z-10">
        <h1 className="text-2xl font-bold text-orange-600 tracking-wider">
          Nexus Coder <span className="text-slate-500 font-light">AI Full-Stack Architect</span>
        </h1>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-[30rem] xl:w-[34rem] p-6 border-r border-slate-200 bg-white overflow-y-auto">
          <InputPanel 
            userInput={userInput} 
            setUserInput={setUserInput} 
            onGenerate={handleGenerateClick}
            isLoading={isLoading}
          />
        </div>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden">
          <div className="bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto p-4">
             {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <SpinnerIcon className="w-12 h-12 animate-spin text-orange-500" />
                <p className="mt-4 text-lg">Architecting your application...</p>
                <p className="text-sm text-slate-400">This may take a moment.</p>
              </div>
            )}
            {error && (
              <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                <h3 className="font-bold">Generation Error</h3>
                <p>{error}</p>
              </div>
            )}
            {projectData && !isLoading && (
              <>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                    <div className="flex items-center space-x-1">
                        <button onClick={() => setActiveTab('summary')} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${activeTab === 'summary' ? 'bg-orange-100 text-orange-700' : 'text-slate-500 hover:bg-slate-200'}`}>Summary</button>
                        <button onClick={() => setActiveTab('files')} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${activeTab === 'files' ? 'bg-orange-100 text-orange-700' : 'text-slate-500 hover:bg-slate-200'}`}>File Structure</button>
                    </div>
                    <button onClick={handleDownload} className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-transform transform hover:scale-105">
                        <DownloadIcon className="w-5 h-5" />
                        <span>Download .ZIP</span>
                    </button>
                </div>
                {activeTab === 'summary' && <ProjectSummary markdown={projectData.projectSummary} />}
                {activeTab === 'files' && (
                    <FileTree 
                        fileTree={projectData.fileTree} 
                        onFileSelect={handleFileSelect}
                        selectedFile={selectedFile}
                    />
                )}
              </>
            )}
            {!projectData && !isLoading && !error && (
                <div className="text-center text-slate-400 p-8 flex-grow flex items-center justify-center">
                    <p>Your generated project will appear here.</p>
                </div>
            )}
          </div>

          <div className="bg-slate-100 overflow-y-auto p-4">
            <h2 className="text-lg font-semibold mb-3 text-slate-700 border-b border-slate-200 pb-2">Code Preview</h2>
            <CodePreview file={selectedFile} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
