import React from 'react';
import { PromptInput } from './PromptInput';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface LandingPageProps {
    onGenerate: (prompt: string) => void;
    isLoading: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGenerate, isLoading }) => {
    const examplePrompts = [
        "A simple 'like' button with a heart icon that fills when clicked.",
        "A responsive pricing card component with three tiers.",
        "A login form with email, password fields and a 'remember me' checkbox.",
        "A star rating component that allows users to select a rating from 1 to 5.",
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-800 text-white p-8 overflow-y-auto">
            <div className="text-center max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Web Component Generator</h1>
                <p className="text-lg text-slate-300 mb-8">
                    Describe the component you want to build, and let AI do the heavy lifting.
                    From a simple button to a complex data grid, just type your request below to get started.
                </p>
            </div>

            { isLoading && <div className="flex flex-col items-center justify-center my-8">
                <SpinnerIcon className="w-12 h-12 animate-spin text-blue-500" />
                <p className="mt-4 text-slate-300">Generating your component, please wait...</p>
            </div> }

            <div className="w-full max-w-3xl my-4">
                <PromptInput onSend={onGenerate} isLoading={isLoading} placeholder="e.g., a dark-themed login form with a show/hide password toggle" />
            </div>

            <div className="mt-10 w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-4 text-center">Or try an example:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {examplePrompts.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => onGenerate(prompt)}
                            disabled={isLoading}
                            className="bg-slate-700 p-4 rounded-lg text-left hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <p className="text-slate-200">{prompt}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
