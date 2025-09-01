# 🚀 Setup Guide

## Quick Setup for GitHub

### 1. Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: AI-powered command agent"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `command-agent` (or your preferred name)
3. Don't initialize with README (we already have one)
4. Copy the repository URL

### 3. Connect and Push

```bash
# Add GitHub remote
git remote add origin https://github.com/command-agent/command-agent.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4. Set Up API Key

1. Get your Perplexity API key from [Perplexity AI](https://www.perplexity.ai/)
2. Copy `.env.example` to `.env`
3. Add your API key to `.env`

### 5. Test Installation

```bash
# Install dependencies
npm install

# Run tests
npm test

# Try the agent
npm start
```

## Repository Settings

### Branch Protection (Recommended)

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date

### Secrets (For CI/CD)

1. Go to Settings → Secrets and variables → Actions
2. Add repository secret:
   - Name: `API_SECRET_KEY`
   - Value: Your Perplexity API key

### Topics (For Discoverability)

Add these topics to your repository:
- `ai`
- `automation`
- `cli`
- `nodejs`
- `project-setup`
- `code-generation`
- `perplexity`

## Ready to Go! 🎉

Your repository is now ready for:
- ✅ Public release
- ✅ Collaboration
- ✅ CI/CD workflows
- ✅ Issue tracking
- ✅ Community contributions