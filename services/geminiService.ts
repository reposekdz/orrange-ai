import { GoogleGenAI } from "@google/genai";
import type { UserInput, ProjectData } from '../types';

const buildPrompt = (userInput: UserInput): string => {
  const { projectName, description, frontendTech, backendTech, databaseTech, advancedFeatures } = userInput;

  return `
You are Nexus Coder, a world-class AI full-stack software architect. Your task is to generate a complete, functional, and production-ready full-stack application based on the user's requirements.

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
  "projectSummary": "A detailed summary in Markdown format. Include sections for 'Architecture Overview', 'Tech Stack', 'Setup & Installation', and 'Running the Application'.",
  "fileTree": [
    // Array of file and folder objects
  ]
}

**The \`fileTree\` array contains objects with these properties:**
- \`type\`: "file" or "folder"
- \`name\`: The name of the file or folder (e.g., "index.js", "src")
- \`content\`: (for files only) A string containing the full code for the file. Escape all special characters, especially backticks (\`), newlines (\\n), and quotes (\\").
- \`children\`: (for folders only) An array of file and folder objects, recursively representing the folder's contents.

**Instructions & Best Practices:**
1.  **Project Summary:** Start by writing a comprehensive \`projectSummary\` in Markdown. This is crucial.
2.  **Directory Structure:** Create a logical and standard monorepo or separate directory structure (e.g., \`/client\`, \`/server\`) for the specified technologies.
3.  **Production-Ready Code:** Generate complete, runnable, and well-commented code for every file. This includes \`package.json\`, configuration files (\`tsconfig.json\`, \`.eslintrc\`), server entry points, frontend components, API routes, database models, etc.
4.  **Containerization:** If it's a web application, include a \`Dockerfile\` for both the frontend and backend services to ensure easy containerization.
5.  **CI/CD:** Include a basic CI/CD pipeline configuration file (e.g., \`.github/workflows/main.yml\`) that details steps to build and test the application.
6.  **Testing:** Set up a standard testing framework (e.g., Jest with Testing Library for React; Jest or Mocha/Chai for Node.js). Include sample unit or integration tests to demonstrate usage.
7.  **Environment Variables:** Provide placeholder environment variables in a \`.env.example\` file. DO NOT include a \`.env\` file.
8.  **Final Output:** The final output MUST be only the JSON object, with no other text, explanation, or markdown formatting before or after it. Ensure the JSON is perfectly valid.
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
    
    // Validation for the new, more complex structure
    if (!parsedData.projectName || !parsedData.projectSummary || !Array.isArray(parsedData.fileTree)) {
        throw new Error("Invalid JSON structure received from API. Essential fields are missing.");
    }

    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the response from the AI. The generated JSON was malformed.");
    }
    throw new Error(`An error occurred while communicating with the Gemini API: ${error instanceof Error ? error.message : String(error)}`);
  }
};
