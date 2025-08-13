# Contributing to Command Agent

Thank you for your interest in contributing to Command Agent! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn
- Git
- Perplexity API key for testing

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/command-agent.git
   cd command-agent
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Add your Perplexity API key to .env
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## 🛠️ Development Guidelines

### Code Style

- Use ES6+ features and modules
- Follow consistent naming conventions
- Add JSDoc comments for functions
- Use meaningful variable and function names
- Keep functions small and focused

### Project Structure

```
command-agent/
├── agent.js              # Main interactive agent
├── ai-service.js          # AI API integration  
├── cli.js                 # Command-line interface
├── config/               # Configuration files
├── utils/                # Utility functions
├── tests/                # Test files
└── docs/                 # Documentation
```

### Commit Messages

Use conventional commit format:
```
type(scope): description

feat(ai): add support for new AI model
fix(validation): handle edge case in command parsing
docs(readme): update installation instructions
test(agent): add integration tests
```

## 🧪 Testing

### Running Tests

```bash
# All tests
npm test

# Integration tests
npm run test:integration

# Specific test files
npm run test:java
```

### Writing Tests

- Add tests for new features
- Test both success and failure cases
- Use descriptive test names
- Mock external dependencies

### Test Structure

```javascript
runner.test('feature description - specific case', () => {
    // Arrange
    const input = 'test input';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    runner.assertEqual(result, expectedOutput);
});
```

## 🐛 Bug Reports

### Before Submitting

1. Check existing issues
2. Test with latest version
3. Reproduce the bug consistently

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 10, macOS 12]
- Node.js version: [e.g., 18.0.0]
- Agent version: [e.g., 1.0.0]

**Additional Context**
Any other relevant information
```

## ✨ Feature Requests

### Before Submitting

1. Check if feature already exists
2. Search existing feature requests
3. Consider if it fits the project scope

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other approaches you've considered

**Additional Context**
Any other relevant information
```

## 🔧 Pull Requests

### Before Submitting

1. Create an issue first (for major changes)
2. Fork the repository
3. Create a feature branch
4. Make your changes
5. Add/update tests
6. Update documentation
7. Test your changes

### PR Guidelines

- **Title**: Clear, descriptive title
- **Description**: Explain what and why
- **Testing**: Describe how you tested
- **Breaking Changes**: Highlight any breaking changes
- **Documentation**: Update relevant docs

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🎯 Areas for Contribution

### High Priority
- Additional AI model support
- More programming language templates
- Enhanced error handling
- Performance optimizations

### Medium Priority
- Web interface
- Plugin system
- Command history
- Configuration presets

### Documentation
- API documentation
- Tutorial videos
- Example projects
- Best practices guide

## 📞 Getting Help

- **Questions**: Use GitHub Discussions
- **Bugs**: Create GitHub Issues
- **Chat**: Join our community (link TBD)

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Invited to maintainer team (for significant contributions)

Thank you for contributing to Command Agent! 🚀