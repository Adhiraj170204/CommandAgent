// This file contains the generateCommands function that uses the Perplexity Sonar API to generate git bash commands based on a task description.

import dotenv from 'dotenv';
dotenv.config();

async function generateCommands(taskDescription) {
  const userPrompt = `
You are a helpful assistant that converts user tasks into executable commands for Windows CMD.

Instructions:
- For the given task, respond ONLY with a valid JSON array of objects.
- Each object must have:
  1. "command": The actual Windows CMD command to execute (NOT PowerShell).
  2. "description": A brief explanation of what the command does.
- Use ONLY CMD commands: mkdir (not New-Item), dir (not Get-ChildItem), copy (not Copy-Item), etc.
- If file creation is needed, use Node.js 'fs' module with node -e command.
- Do NOT use PowerShell commands like New-Item, Get-ChildItem, Copy-Item, etc.
- Do NOT include any explanations, markdown, or text outside the JSON array.
- Only include commands that are necessary and safe to run in a Windows CMD environment.
- IMPORTANT: When creating folders, use separate commands. First "mkdir foldername", then subsequent commands will run inside that folder automatically.
- Do NOT use cd commands or chain commands with &. Each command should be separate.

Task: ${taskDescription}

Example output format:
[
  {
    "command": "mkdir test",
    "description": "Create a new folder named test."
  },
  {
    "command": "npm init -y",
    "description": "Initialize a new Node.js project with default settings."
  },
  {
    "command": "npm install express",
    "description": "Install Express.js framework."
  },
  {
    "command": "node -e \\"require('fs').writeFileSync('app.js', 'console.log(\\\\'Hello World!\\\\');')\\"",
    "description": "Create an app.js file with Hello World code."
  }
]

Respond ONLY with the JSON array for the task: ${taskDescription}.
`;

  try {
    const requestBody = {
      model: 'sonar',
      messages: [{ role: 'user', content: userPrompt }],
      max_tokens: 512,
      temperature: 0.6
    };

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_SecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid Perplexity API key');
      } else if (response.status === 429) {
        throw new Error('API rate limit exceeded');
      } else {
        throw new Error(`API error: ${response.status}`);
      }
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('❌ Error generating commands:', error);
    return null;
  }
}

export default generateCommands;
