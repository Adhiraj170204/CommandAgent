# Design Document

## Overview

This design outlines the migration from DeepSeek API (via Hugging Face Inference) to Perplexity Sonar API for generating git bash commands. The migration will replace the current AI service implementation while maintaining the same interface and functionality. The design focuses on minimal disruption to existing code while leveraging Perplexity's native API capabilities.

## Architecture

### Current Architecture
- **ai-service.js**: Contains `generateCommands()` function using Hugging Face Inference client
- **agent.js**: Main application logic that calls the AI service and handles user interaction
- **Environment**: Uses `API_SecretKey` for Hugging Face authentication

### Target Architecture
- **ai-service.js**: Updated to use Perplexity API directly via HTTP requests
- **agent.js**: No changes required (maintains same interface)
- **Environment**: New `PERPLEXITY_API_KEY` environment variable

## Components and Interfaces

### AI Service Module (ai-service.js)

#### Current Implementation
```javascript
// Uses Hugging Face Inference client
const client = new InferenceClient(process.env.API_SecretKey);
await client.chatCompletion({
    provider: 'nebius',
    model: 'deepseek-ai/DeepSeek-V3-0324',
    // ...
});
```

#### New Implementation
```javascript
// Direct HTTP requests to Perplexity API
const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{ role: 'user', content: userPrompt }],
        max_tokens: 512,
        temperature: 0.6
    })
});
```

### Interface Compatibility

The `generateCommands(taskDescription)` function will maintain the same:
- **Input**: String parameter containing task description
- **Output**: String containing JSON array of command objects
- **Error Handling**: Returns null on failure

### API Configuration

#### Environment Variables
- **Current**: `API_SecretKey` (Hugging Face token)
- **New**: `PERPLEXITY_API_KEY` (Perplexity API key)

#### Migration Strategy
1. Add new environment variable alongside existing one
2. Update ai-service.js to use Perplexity API
3. Remove Hugging Face dependency after testing
4. Update documentation for new environment variable

## Data Models

### Request Format (Perplexity API)
```javascript
{
    model: 'llama-3.1-sonar-small-128k-online',
    messages: [
        {
            role: 'user',
            content: 'prompt text'
        }
    ],
    max_tokens: 512,
    temperature: 0.6,
    stream: false
}
```

### Response Format (Perplexity API)
```javascript
{
    id: 'response-id',
    object: 'chat.completion',
    created: timestamp,
    model: 'llama-3.1-sonar-small-128k-online',
    choices: [
        {
            index: 0,
            message: {
                role: 'assistant',
                content: 'JSON array string'
            },
            finish_reason: 'stop'
        }
    ],
    usage: {
        prompt_tokens: number,
        completion_tokens: number,
        total_tokens: number
    }
}
```

### Command Object Structure (Unchanged)
```javascript
{
    command: 'git init',
    description: 'Initialize a new Git repository in the current directory.'
}
```

## Error Handling

### API Error Categories
1. **Authentication Errors**: Invalid or missing API key
2. **Network Errors**: Connection timeouts, DNS resolution failures
3. **Rate Limiting**: API quota exceeded
4. **Malformed Responses**: Invalid JSON or unexpected response structure
5. **Model Errors**: Model unavailable or processing errors

### Error Handling Strategy
```javascript
try {
    const response = await fetch(/* API call */);
    
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
    console.error('Error generating commands:', error);
    return null;
}
```

### Fallback Mechanisms
- Graceful degradation when API is unavailable
- Clear error messages for different failure scenarios
- Logging for debugging and monitoring

## Testing Strategy

### Unit Tests
1. **API Integration Tests**
   - Test successful API calls with valid responses
   - Test error handling for various failure scenarios
   - Test response parsing and validation

2. **Function Interface Tests**
   - Verify `generateCommands()` maintains same interface
   - Test with various task descriptions
   - Validate JSON output format

### Integration Tests
1. **End-to-End Workflow**
   - Test complete user interaction flow
   - Verify command generation and execution
   - Test error scenarios in full context

2. **Environment Configuration**
   - Test with valid API keys
   - Test with missing/invalid API keys
   - Test environment variable loading

### Performance Tests
1. **Response Time**: Measure API call latency
2. **Rate Limiting**: Test behavior under rate limits
3. **Memory Usage**: Monitor resource consumption

### Migration Testing
1. **Side-by-Side Comparison**: Compare outputs from both APIs
2. **Regression Testing**: Ensure no functionality is lost
3. **User Acceptance**: Validate user experience remains consistent

## Implementation Considerations

### Dependencies
- **Remove**: `@huggingface/inference` package
- **Add**: Native `fetch` API (Node.js 18+) or `node-fetch` for older versions
- **Keep**: All other existing dependencies

### Security
- API key stored in environment variables
- No sensitive data logged
- Secure HTTPS communication with Perplexity API

### Performance Optimizations
- Use appropriate model for task complexity
- Implement request timeout handling
- Consider response caching for repeated requests

### Monitoring and Logging
- Log API response times
- Track error rates and types
- Monitor token usage for cost optimization