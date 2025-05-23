# Node.js Project Automation Agent

This project is an **AI-powered automation agent** for Node.js project setup and management. It uses an AI model to convert natural language tasks into executable shell commands, then runs those commands to automate project scaffolding, dependency installation, file creation, and more.

---

## Features

- **Natural Language to Commands:**  
  Enter a plain English task (e.g., “Set up a new Node.js project with Express and Mongoose, add a /status route, and initialize git”), and the agent generates the necessary shell commands.

- **AI-Driven Command Generation:**  
  Uses an AI model to generate a sequence of commands as a JSON array, each with a description.

- **Safe File Creation:**  
  For file creation, the agent uses Node.js’s `fs` module via `node -e` commands, never `echo`, to avoid shell quoting issues and ensure cross-platform compatibility.

- **Interactive Execution:**  
  Prompts the user for approval before executing each command.

- **Directory Management:**  
  Handles `mkdir` and `cd` logic to ensure commands execute in the correct directory context.

- **Error Handling:**  
  Gracefully handles invalid or incomplete AI responses and command execution errors.

---

## How It Works

1. **User Input:**  
   The agent prompts you for a task description.

2. **AI Command Generation:**  
   The description is sent to an AI model, which returns a JSON array of commands and descriptions.

3. **Command Parsing:**  
   The agent parses the JSON, validates the commands, and displays an execution plan.

4. **Interactive Execution:**  
   For each command, the agent asks for your approval before running it.  
   Special handling is included for directory changes (`mkdir ... && cd ...`).

5. **Execution & Feedback:**  
   Commands are executed sequentially. Output and errors are displayed after each command.

---

## Example Usage

```
$ node agent.js
✔ What task would you like me to perform? Set up a new Node.js project in a new folder named test1 with Express and Mongoose, initialize a Git repository, create a .gitignore file to ignore node_modules and .env, create a README.md, set up a MongoDB connection, add a /status route, create a .env file, install nodemon as a dev dependency, and make an initial commit.
Generating execution plan...
1. Create a new folder named test1 and navigate into it.
2. Initialize a new Node.js project with default settings.
3. Install Express and Mongoose as project dependencies.
4. Initialize a new Git repository in the current directory.
5. Create a .gitignore file to ignore node_modules and .env.
6. Create a README.md file with the project title and description.
7. Create app.js with Express setup, MongoDB connection, and a /status route.
8. Create a .env file with PORT=3000.
9. Install nodemon as a dev dependency.
10. Make an initial commit.
...
```

---

## .gitignore Example

```
node_modules
.env
.DS_Store
npm-debug.log
dist
```

---

## How to Push to GitHub

1. Initialize git (if not already):
   ```
   git init
   ```
2. Add all files:
   ```
   git add .
   ```
3. Commit:
   ```
   git commit -m "Initial commit"
   ```
4. Create a new repo on GitHub and add it as remote:
   ```
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   ```
5. Push:
   ```
   git push -u origin master
   ```

---

## Security Note

- **Review all generated commands before execution.**  
  The agent executes shell commands generated by an AI model. Always check for safety and correctness.

---

## Requirements

- Node.js v16 or higher
- npm
- Access to an AI API (e.g., DeepSeek, OpenAI, etc.)
- [Optional] MongoDB for database-related tasks

---

## Project Structure

- `agent.js` — Main agent logic, user interaction, and command execution.
- `ai-service.js` — Handles communication with the AI model.
- `index.js` — Example/test runner and utility functions.
- `.gitignore` — Standard Node.js ignores.

---

## License

MIT

---

## Contributing

Pull requests and suggestions are welcome!
