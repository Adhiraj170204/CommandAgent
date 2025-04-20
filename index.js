import { exec } from 'child_process';
import inquirer from 'inquirer';
import fs from 'fs';

const { prompt } = inquirer;

let commands = [
  {
    command: 'npm init -y',
    description: 'Initialize a new Node.js project with default settings.'
  },
  {
    command: 'npm install express mongoose',
    description: 'Install express and mongoose packages as project dependencies.'
  },
  {
    command: 'node -e "require(\'fs\').writeFileSync(\'server.js\', \'const express = require(\\\'express\\\');\\nconst mongoose = require(\\\'mongoose\\\');\\n\\nconst app = express();\\n\\n// Middleware\\napp.use(express.json());\\n\\n// Routes\\napp.get(\\\'/\\\', (req, res) => {\\n  res.send(\\\'Hello World!\\\');\\n});\\n\\n// Database connection\\nmongoose.connect(\\\'mongodb://localhost:27017/mydatabase\\\', { useNewUrlParser: true, useUnifiedTopology: true })\\n  .then(() => console.log(\\\'Connected to MongoDB...\\\'))\\n  .catch(err => console.error(\\\'Could not connect to MongoDB...\\\', err));\\n\\n// Start server\\nconst port = process.env.PORT || 3000;\\napp.listen(port, () => console.log(`Server running on port ${port}...`));\');"',
    description: 'Create a boilerplate server.js file with express and mongoose setup using Node.js fs module.'
  }
]

for (const cmd of commands) {
  cmd.command = cmd.command
    .replace(/\s*\+\s*/g, '') // Remove `+` signs and surrounding whitespace
}

console.log(commands[2].command);

function executeCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        reject(error); // Reject the Promise on error
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`); // Log the output
      resolve(stdout); // Resolve the Promise when the command finishes
    });
  });
}

// Example usage
let cmd = commands[2].command;

executeCommand(cmd)
  .then(() => console.log('Command executed successfully'))
  .catch((error) => console.error('Command execution failed:', error));

// console.log('Transformed Commands:', commands);

// let execution = (cmd) => {
//   return new Promise((resolve, reject) => {
//     console.log(`Executing: ${cmd}`); // Log the full command for debugging
//     exec(cmd, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error executing command: ${error.message}`);
//         reject(error);
//         return;
//       }
//       if (stderr) {
//         console.error(`stderr: ${stderr}`);
//       }
//       console.log(`stdout: ${stdout}`);
//       resolve(); // Resolve the promise when the command finishes
//     });
//   });
// };

// console.log('Here is my execution plan:');
// commands.map((cmd, index) => { console.log(`${index + 1}. ${cmd.description}`) })

// const { approved } = await prompt([
//   {
//     type: 'confirm',
//     name: 'approved',
//     message: 'Do you approve this execution plan?',
//     default: false,
//   },
// ]);

// if (approved) {
//   console.log('Executing commands...');
//   for (const cmd of commands) {
//     const { approved } = await prompt([
//       {
//         type: 'confirm',
//         name: 'approved',
//         message: `Do you want to execute ${cmd.description}?`,
//         default: false,
//       },
//     ]);
//     if (approved) {
//       await execution(cmd.command); // Execute the transformed command
//     }
//   }
// }
// // 


//set up a new Node.js project in a new folder name as test1 with Express and Mongoose, create a .gitignore file to ignore node_modules and .env, create a README.md with the project title and description, set up a MongoDB connection in a js file of name app.  

