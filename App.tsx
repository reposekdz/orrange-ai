
import React, { useState, useCallback } from 'react';
import { InputPanel } from './components/InputPanel';
import { FileTree } from './components/FileTree';
import { CodePreview } from './components/CodePreview';
import { generateProject } from './services/geminiService';
import type { FileNode, ProjectData, UserInput } from './types';
import { SpinnerIcon } from './components/icons/SpinnerIcon';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    projectName: 'my-blog-app',
    description: 'A simple blog application with posts and comments.',
    frontendTech: 'React with TypeScript and Tailwind CSS',
    backendTech: 'Node.js with Express',
    databaseTech: 'MongoDB with Mongoose',
    advancedFeatures: 'User authentication with JWT. REST API for posts.',
  });
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProjectData(null);
    setSelectedFile(null);
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

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-md z-10">
        <h1 className="text-2xl font-bold text-cyan-400 tracking-wider">
          Nexus Coder <span className="text-gray-400 font-light">AI Full-Stack Generator</span>
        </h1>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-1/3 xl:w-1/4 p-4 border-r border-gray-700 bg-gray-800 overflow-y-auto">
          <InputPanel 
            userInput={userInput} 
            setUserInput={setUserInput} 
            onGenerate={handleGenerateClick}
            isLoading={isLoading}
          />
        </div>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden">
          <div className="bg-gray-900 border-r border-gray-700 overflow-y-auto p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-300 border-b border-gray-700 pb-2">File Structure</h2>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <SpinnerIcon className="w-12 h-12 animate-spin text-cyan-500" />
                <p className="mt-4 text-lg">Generating project structure...</p>
                <p className="text-sm text-gray-500">This may take a moment.</p>
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-900/50 border border-red-700 rounded-md text-red-300">
                <h3 className="font-bold">Error</h3>
                <p>{error}</p>
              </div>
            )}
            {projectData && (
              <FileTree 
                fileTree={projectData.fileTree} 
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            )}
            {!projectData && !isLoading && !error && (
                <div className="text-center text-gray-500 p-8">
                    <p>Generated project structure will appear here.</p>
                </div>
            )}
          </div>

          <div className="bg-gray-900 overflow-y-auto p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-300 border-b border-gray-700 pb-2">Code Preview</h2>
            <CodePreview file={selectedFile} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
