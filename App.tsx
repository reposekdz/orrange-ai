import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { GeneratorView } from './components/GeneratorView';
import { Message, Project } from './types';
import { generateComponent } from './services/geminiService';

const App: React.FC = () => {
    const [project, setProject] = useState<Project | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (prompt: string) => {
        setIsLoading(true);
        setError(null);
        setProject(null);
        const userMessage: Message = { id: Date.now().toString(), text: prompt, sender: 'user' };
        setMessages([userMessage]);

        try {
            const result = await generateComponent(prompt);
            const newProject = { summary: result.summary, files: result.files };
            setProject(newProject);
            const botMessage: Message = { id: (Date.now() + 1).toString(), text: result.summary, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (e: any) {
            const errorMessageText = e.message || "An unknown error occurred.";
            setError(errorMessageText);
             const errorMessage: Message = { id: (Date.now() + 1).toString(), text: errorMessageText, sender: 'system' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-slate-800 flex flex-col">
            <Header />
            <main className="flex-1 overflow-hidden">
                {!project ? (
                    <LandingPage onGenerate={handleGenerate} isLoading={isLoading} />
                ) : (
                    <GeneratorView initialProject={project} initialMessages={messages} />
                )}
                {error && !project && (
                     <div className="fixed bottom-4 right-4 bg-red-900 text-red-300 p-4 rounded-lg shadow-lg max-w-md">
                        <p className="font-bold">Error Generating Component</p>
                        <p>{error}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
