import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { SendIcon } from './icons/SendIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface PromptInputProps {
    onSend: (prompt: string) => void;
    isLoading: boolean;
    placeholder?: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSend, isLoading, placeholder }) => {
    const [prompt, setPrompt] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (prompt.trim() && !isLoading) {
            onSend(prompt);
            setPrompt('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [prompt]);

    return (
        <div className="p-2 bg-slate-800 border-t border-slate-700">
            <div className="relative flex items-center">
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || "Describe the changes you want to make..."}
                    className="w-full bg-slate-700 text-white rounded-lg p-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={1}
                    disabled={isLoading}
                    style={{ maxHeight: '150px' }}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !prompt.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : <SendIcon className="w-5 h-5 text-white" />}
                </button>
            </div>
        </div>
    );
};
