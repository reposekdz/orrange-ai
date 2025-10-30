
import { GoogleGenAI } from "@google/genai";
import type { UserInput, ProjectData } from '../types';

const buildPrompt = (userInput: UserInput): string => {
  const { projectName, description, frontendTech, backendTech, databaseTech, advancedFeatures } = userInput;

  return `
You are an expert full-stack software architect and senior developer. Your task is to generate a complete, functional, and well-structured full-stack application based on the user's requirements.

**User Requirements:**
- Project Name: ${projectName}
- Description: ${description}
- Frontend: ${frontendTech}
- Backend: ${backendTech}
- Database: ${databaseTech}
- Additional Features: ${advancedFeatures}

**Your Output MUST be a single, valid JSON object with the following structure:**

{
  "projectName": "The name of the project",
  "fileTree": [
    // Array of file and folder objects
  ]
}

**The \`fileTree\` array contains objects with these properties:**
- \`type\`: "file" or "folder"
- \`name\`: The name of the file or folder (e.g., "index.js", "src")
- \`content\`: (for files only) A string containing the full code for the file. Escape all special characters, especially backticks (\`), newlines (\\n), and quotes (\\").
- \`children\`: (for folders only) An array of file and folder objects, recursively representing the folder's contents.

**Example of a single file object:**
{
  "type": "file",
  "name": "README.md",
  "content": "# Project Title\\n\\nThis is the readme."
}

**Example of a folder object:**
{
  "type": "folder",
  "name": "src",
  "children": [
    { "type": "file", "name": "index.js", "content": "console.log(\\"Hello, World!\\");" }
  ]
}

**Instructions:**
1.  Analyze the user's requirements carefully.
2.  Create a logical and standard directory structure for the specified technologies.
3.  Generate complete and runnable code for each file, including package.json, configuration files, server entry points, frontend components, etc.
4.  Ensure all generated code is syntactically correct and follows best practices for the chosen technologies.
5.  Provide placeholder environment variables (e.g., in a .env.example file) where necessary.
6.  The final output MUST be only the JSON object, with no other text, explanation, or markdown formatting before or after it.
  `;
};


export const generateProject = async (userInput: UserInput): Promise<ProjectData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = buildPrompt(userInput);

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
    });
    
    const jsonString = response.text;
    const parsedData: ProjectData = JSON.parse(jsonString);
    
    // Basic validation
    if (!parsedData.projectName || !Array.isArray(parsedData.fileTree)) {
        throw new Error("Invalid JSON structure received from API.");
    }

    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the response from the AI. The format was invalid.");
    }
    throw new Error(`An error occurred while communicating with the Gemini API: ${error instanceof Error ? error.message : String(error)}`);
  }
};
