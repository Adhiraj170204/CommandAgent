# 🤖 Command Agent

**AI-Powered Project Automation Agent**

Transform natural language descriptions into executable commands for project setup, development workflows, and automation tasks.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

---

## ✨ Features

- 🧠 **AI-Powered Command Generation** - Uses OpenAI Chat Completions to convert natural language to executable commands
- 🛡️ **Safe Execution** - Interactive approval process with command validation and dangerous command detection
- 📁 **Smart Directory Management** - Automatic directory tracking and context switching
- 💬 **Continuous Chat in One Run** - After a task completes, continue with “Is there anything else?” in the same conversation
- ⏳ **Minimal Console UI** - Spinner-based "working..." interface with hidden command logs
- 🧾 **Terminal Context to AI** - Captures command outputs and adds summaries to the ongoing chat for better follow-ups
- 🎯 **Multi-Language Support** - Supports Node.js, Python, Java, HTML/CSS/JS, Docker, and more
- ⚡ **MERN Stack Specialist** - Optimized for full-stack JavaScript development
- 🔧 **Flexible Interface** - Both interactive CLI and programmatic API
- 📝 **Comprehensive Logging** - Detailed execution logs and error reporting

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/command-agent/command-agent.git
cd command-agent

# Install dependencies
npm install

# Create a .env file with your settings
echo OPENAI_API_KEY=your_openai_api_key_here > .env
echo API_MODEL=gpt-4o-mini >> .env
echo SILENT_CONSOLE=true >> .env
```

### Basic Usage

```bash
# Interactive mode
npm start

# CLI mode
npm run cli generate "Create a React app with TypeScript"

# Run tests
npm test
```

---

## 📖 Usage Examples

### MERN Stack Setup
```
What task would you like me to perform? 
> Create a MERN stack project with authentication

✅ Generated 8 commands:
1. Create project folder
2. Initialize Node.js project
3. Install Express and Mongoose
4. Create Express server with auth routes
5. Set up client folder
6. Create React app with login components
7. Configure proxy for development
8. Add authentication middleware
```

### Java Project Setup
```
What task would you like me to perform?
> Create a Java project with JUnit testing

✅ Generated 6 commands:
1. Create JavaProject folder
2. Set up src and test directories
3. Create Main.java with hello world
4. Create JUnit test file
5. Set up Gradle build configuration
6. Add JUnit dependencies
```

### Python Flask App
```
What task would you like me to perform?
> Create a Python Flask web application

✅ Generated 5 commands:
1. Create Flask project folder
2. Set up Python virtual environment
3. Install Flask dependencies
4. Create basic Flask app with routes
5. Add requirements.txt
```

---

## 🎯 Best Prompts for Different Technologies

### ✅ **Recommended Prompts**

**Node.js/JavaScript:**
- "Create a MERN stack project with authentication"
- "Set up Express API with MongoDB connection"
- "Create a React app with routing and state management"

**Java:**
- "Create a Java project with JUnit testing"
- "Set up a basic Java console application"
- "Create Java project with Gradle build"

**Python:**
- "Create a Python Flask web application"
- "Set up Python project with virtual environment"
- "Create Django project with basic models"

**Web Development:**
- "Create a responsive website with HTML, CSS, and JavaScript"
- "Set up a static site with modern CSS framework"
- "Create a portfolio website with contact form"

### ⚠️ **Avoid Complex Frameworks Initially**
- Spring Boot (too complex for initial setup)
- Complex Maven configurations
- Multi-module projects

---

## 🛠️ Configuration

### Environment Variables

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional
API_MODEL=gpt-4o-mini
API_ENDPOINT=https://api.openai.com/v1/chat/completions
API_MAX_TOKENS=512
API_TEMPERATURE=0.6
SILENT_CONSOLE=true
DEFAULT_TIMEOUT=30000
REACT_APP_TIMEOUT=300000
DEBUG=false
```

### API Configuration

The agent uses the OpenAI Chat Completions API. Provide `OPENAI_API_KEY` in your `.env`. Default model is `gpt-4o-mini` and can be overridden with `API_MODEL`.

---

## 📁 Project Structure

```
command-agent/
├── agent.js              # Main interactive agent
├── ai-service.js          # AI API integration
├── cli.js                 # Command-line interface
├── config/
│   └── config.js          # Configuration management
├── utils/
│   ├── logger.js          # Logging utilities
│   └── validation.js      # Input validation
├── tests/
│   └── agent.test.js      # Test suite
└── README.md              # This file
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run integration tests
npm run test:integration

# Run Java-specific tests
npm run test:java
```

---

## 🔒 Security Features

- **Input Validation** - Sanitizes and validates all user inputs
- **Dangerous Command Detection** - Blocks potentially harmful commands
- **Safe File Operations** - Uses Node.js fs module instead of shell commands
- **Interactive Approval** - User must approve each command before execution
- **Silent Console Option** - Set `SILENT_CONSOLE=true` to hide logs in console while writing to `logs/`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenAI](https://platform.openai.com/) for the Chat Completions API
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) for interactive CLI
- [Commander.js](https://github.com/tj/commander.js) for command-line interface

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/command-agent/command-agent/issues) page
2. Create a new issue with detailed information
3. Join our [Discussions](https://github.com/command-agent/command-agent/discussions)

---

**Made with ❤️ for developers who love automation**