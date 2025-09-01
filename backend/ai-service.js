

import config from './config/config.js';
import logger from './utils/logger.js';

async function generateCommands(taskDescription) {

  try {
    config.validate();
  } catch (error) {
    logger.error('Configuration validation failed', { error: error.message });
    throw error;
  }

  logger.info('Generating commands for task', { task: taskDescription });
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
- NEVER use cd commands - directory changes are handled automatically after mkdir.
- Do NOT chain commands with & or &&. Each command should be separate.
- After mkdir command, all following commands will execute in that new directory.
- For npm installs, always use --save or --save-dev to update package.json properly.
- For MERN stack: install backend dependencies first, then create client folder, then setup React app.
- Use proper file creation with formatted code, not minified code.
- When creating React app, use "npx create-react-app ." to create in current directory after mkdir client.

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
    "command": "npm install --save express mongoose",
    "description": "Install and save Express and Mongoose to package.json."
  },
  {
    "command": "npm install --save-dev nodemon",
    "description": "Install nodemon as development dependency."
  },
  {
    "command": "node -e \\"require('fs').writeFileSync('server.js', 'const express = require(\\\\'express\\\\');\\\\nconst app = express();\\\\nconst PORT = 5000;\\\\napp.listen(PORT, () => console.log(\\\\'Server running on port \\\\' + PORT));')\\"",
    "description": "Create a basic Express server file."
  },
  {
    "command": "mkdir client",
    "description": "Create client folder for React frontend."
  },
  {
    "command": "npx create-react-app .",
    "description": "Create React app in current directory (client folder)."
  }
]

Respond ONLY with the JSON array for the task: ${taskDescription}.
`;

  try {
    const requestBody = {
      model: config.api.model,
      messages: [{ role: 'user', content: userPrompt }],
      max_tokens: config.api.maxTokens,
      temperature: config.api.temperature
    };

    if (config.debug) {
      logger.info('API Request', { requestBody });
    }

    const response = await fetch(config.api.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.api.key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('API request failed', { 
        status: response.status, 
        statusText: response.statusText,
        error: errorText 
      });

      if (response.status === 401) {
        throw new Error('Invalid Perplexity API key - check your .env file');
      } else if (response.status === 429) {
        throw new Error('API rate limit exceeded - please wait before trying again');
      } else if (response.status === 400) {
        throw new Error(`Bad request: ${errorText}`);
      } else {
        throw new Error(`API error ${response.status}: ${errorText}`);
      }
    }

    const data = await response.json();
    
    if (config.debug) {
      logger.info('API Response', { data });
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid API response structure');
    }

    logger.success('Commands generated successfully');
    return data.choices[0].message.content;
  } catch (error) {
    logger.error('Error generating commands', { error: error.message, stack: error.stack });
    return null;
  }
}

export default generateCommands;
