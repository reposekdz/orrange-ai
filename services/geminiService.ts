import { GoogleGenAI, Type } from "@google/genai";
import { Message, ProjectFile } from '../types';

// Fix: Initialize GoogleGenAI with API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Fix: Use a powerful model suitable for code generation.
const model = 'gemini-2.5-pro';

const GENERATE_PROMPT = `
You are an expert web developer specializing in React, TypeScript, and Tailwind CSS.
Your task is to generate the code for a web component based on a user's prompt.

You must follow these rules:
1.  Always generate a complete, self-contained, and runnable project.
2.  Use React with TypeScript (.tsx files) and functional components with hooks.
3.  Use Tailwind CSS for styling. A \`tailwind.config.js\` and an input CSS file with \`@tailwind\` directives should be included.
4.  The project structure should be logical. At a minimum, include:
    *   \`package.json\` with necessary dependencies (react, react-dom, tailwindcss, etc.) and devDependencies (typescript, vite, etc.). Use Vite as the build tool.
    *   \`vite.config.ts\`
    *   \`tsconfig.json\`
    *   \`tailwind.config.js\`
    *   \`postcss.config.js\`
    *   \`index.html\`
    *   \`src/\` directory containing:
        *   \`main.tsx\` (the entry point)
        *   \`App.tsx\` (the root component)
        *   \`index.css\` (with tailwind directives)
        *   \`components/\` directory for the generated components.
5.  Provide a short, one-sentence summary of the generated project.
6.  The response MUST be a single JSON object. Do not wrap it in markdown backticks.
7.  The JSON object must have two keys: "summary" (a string) and "files" (an array of objects, where each object has "path" and "content" string properties).
8.  File paths should be relative to the project root (e.g., "src/components/Button.tsx").
9.  Do not include any explanations or conversational text outside of the JSON object.
`;

const ITERATE_PROMPT = `
You are an expert web developer specializing in React, TypeScript, and Tailwind CSS.
Your task is to modify an existing web component project based on a user's request.

You will be given the current project files and a user prompt with the requested changes.

You must follow these rules:
1.  Modify the files as requested. You can add, delete, or update files.
2.  Ensure the project remains complete and runnable.
3.  Provide a short, one-sentence summary of the changes made.
4.  The response MUST be a single JSON object. Do not wrap it in markdown backticks.
5.  The JSON object must have two keys: "summary" (a string) and "files" (an array of objects, where each object has "path" and "content" string properties).
6.  The "files" array must contain ALL files for the project, not just the changed ones.
7.  File paths should be relative to the project root (e.g., "src/components/Button.tsx").
8.  Do not include any explanations or conversational text outside of the JSON object.
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A short, one-sentence summary of the generated project or changes made." },
        files: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    path: { type: Type.STRING, description: "File path relative to the project root." },
                    content: { type: Type.STRING, description: "The full content of the file." },
                },
                required: ['path', 'content'],
            },
        },
    },
    required: ['summary', 'files'],
};

export const generateComponent = async (prompt: string) => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                systemInstruction: GENERATE_PROMPT,
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.1,
            },
        });

        const jsonText = response.text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating component:", error);
        throw new Error("Failed to generate component. The AI model may have returned an invalid response. Please try again or check the console for details.");
    }
};

export const iterateComponent = async (prompt: string, files: ProjectFile[], conversationHistory: Message[]) => {
    try {
        const fileContent = files.map(f => `// File: ${f.path}\n\n${f.content}`).join('\n\n---\n\n');
        
        const fullPrompt = `
        User request: "${prompt}"

        Current project files:
        ---
        ${fileContent}
        ---
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: [{ parts: [{ text: fullPrompt }] }],
            config: {
                systemInstruction: ITERATE_PROMPT,
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error iterating on component:", error);
        throw new Error("Failed to update component. The AI model may have returned an invalid response. Please try again or check the console for details.");
    }
};
