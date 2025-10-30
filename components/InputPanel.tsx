import React from 'react';
import type { UserInput } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface InputPanelProps {
  userInput: UserInput;
  setUserInput: React.Dispatch<React.SetStateAction<UserInput>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const InputField: React.FC<{ label: string; id: keyof UserInput; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }> = ({ label, id, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input
            type="text"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
    </div>
);

const TextareaField: React.FC<{ label: string; id: keyof UserInput; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number; placeholder?: string }> = ({ label, id, value, onChange, rows = 3, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className="w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
    </div>
);


export const InputPanel: React.FC<InputPanelProps> = ({ userInput, setUserInput, onGenerate, isLoading }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserInput(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Project Configuration</h2>
            
            <InputField label="Project Name" id="projectName" value={userInput.projectName} onChange={handleChange} placeholder="e.g., my-awesome-app" />
            <TextareaField label="Application Description" id="description" value={userInput.description} onChange={handleChange} rows={4} placeholder="Describe the core functionality of your application." />
            <InputField label="Frontend Technology" id="frontendTech" value={userInput.frontendTech} onChange={handleChange} placeholder="e.g., React, Next.js, Vue" />
            <InputField label="Backend Technology" id="backendTech" value={userInput.backendTech} onChange={handleChange} placeholder="e.g., Node.js/Express, Python/Django" />
            <InputField label="Database" id="databaseTech" value={userInput.databaseTech} onChange={handleChange} placeholder="e.g., PostgreSQL, MongoDB" />
            <TextareaField label="Advanced Features / Details" id="advancedFeatures" value={userInput.advancedFeatures} onChange={handleChange} rows={4} placeholder="e.g., JWT authentication, websockets, specific API endpoints." />
            
            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
            >
                {isLoading ? (
                    <>
                        <SpinnerIcon className="w-5 h-5 mr-3 animate-spin" />
                        Generating...
                    </>
                ) : (
                    'Architect Full-Stack App'
                )}
            </button>
        </div>
    );
};
