import React, { useState, useEffect } from 'react';
import { FileNode } from '../types';

interface PreviewPanelProps {
    files: FileNode[];
    viewport: 'desktop' | 'tablet' | 'mobile';
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ files, viewport }) => {
    const [iframeContent, setIframeContent] = useState('');

    useEffect(() => {
        const srcDoc = `
            <html>
                <head>
                    <style>
                        body {
                            background-color: #1a202c;
                            color: #cbd5e0;
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            flex-direction: column;
                            text-align: center;
                        }
                        .container {
                            border: 1px dashed #4a5568;
                            padding: 2rem;
                            border-radius: 0.5rem;
                            background-color: #2d3748;
                        }
                        h2 {
                            color: #fff;
                            margin-top: 0;
                        }
                        code {
                            background-color: #1a202c;
                            padding: 0.25rem 0.5rem;
                            border-radius: 0.25rem;
                            font-family: 'Courier New', Courier, monospace;
                            color: #90cdf4;
                        }
                        a { color: #63b3ed; text-decoration: none; }
                        a:hover { text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Live Preview Not Available</h2>
                        <p>To see your component in action, please download the project.</p>
                        <p>Run <code>npm install</code> and then <code>npm run dev</code>.</p>
                        <p>For more info, visit <a href="https://vitejs.dev/guide/" target="_blank">Vite's documentation</a>.</p>
                    </div>
                </body>
            </html>
        `;
        setIframeContent(srcDoc);

    }, [files]);

    const viewportClasses = {
        desktop: 'w-full h-full',
        tablet: 'w-[768px] h-full max-w-full mx-auto shadow-2xl rounded-lg border-4 border-slate-600',
        mobile: 'w-[375px] h-[667px] max-w-full mx-auto shadow-2xl rounded-lg border-4 border-slate-600',
    };

    return (
        <div className="bg-slate-700 h-full p-4 flex items-center justify-center">
            <iframe
                title="Component Preview"
                srcDoc={iframeContent}
                className={`bg-white transition-all duration-300 ease-in-out transform ${viewportClasses[viewport]}`}
                sandbox="allow-scripts"
            />
        </div>
    );
};
