// This file contains the generateCommands function that uses the Hugging Face Inference API to generate git bash commands based on a task description. Currently using the DeepSeek-V3-0324 model.

import { InferenceClient } from '@huggingface/inference';
import dotenv from 'dotenv';
dotenv.config();

const client = new InferenceClient(process.env.API_SecretKey);

async function generateCommands(taskDescription) {
    const userPrompt = `
You are a helpful assistant that converts user tasks into executable git bash commands.

Instructions:
- For the given task, respond ONLY with a valid JSON array of objects.
- Each object must have:
  1. "command": The actual git bash command to execute.
  2. "description": A brief explanation of what the command does.
- Do NOT use the echo command to create or write files.
- If file creation or writing is needed, use the Node.js 'fs' module (e.g., node -e "require('fs').writeFileSync(...)").
- Do NOT include any explanations, markdown, or text outside the JSON array.
- Only include commands that are necessary and safe to run in a typical development environment.

Task: ${taskDescription}

Example output format:
[
  {
    "command": "git init",
    "description": "Initialize a new Git repository in the current directory."
  },
  {
    "command": "git add .",
    "description": "Stage all changes in the current directory for the next commit."
  },
  {
    "command": "node -e \\"require('fs').writeFileSync('file.txt', 'Hello World!');\\"",
    "description": "Create a file named file.txt with 'Hello World!' using Node.js fs module."
  }
 ]

Respond ONLY with the JSON array for the task: ${taskDescription}.
`;

    try {
        const result = await client.chatCompletion({
            provider: 'nebius',
            model: 'deepseek-ai/DeepSeek-V3-0324',
            messages: [{ role: 'user', content: userPrompt }],
            max_tokens: 512,
            temperature: 0.6,
        });
        return (result.choices[0].message.content);
    } catch (error) {
        console.error('Error generating commands:', error);
        return null;
    }
}

export default generateCommands;
