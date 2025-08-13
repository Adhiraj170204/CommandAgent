// Configuration management
import dotenv from 'dotenv';
dotenv.config();

const config = {
    // API Configuration
    api: {
        key: process.env.API_SecretKey,
        model: process.env.API_MODEL || 'sonar',
        maxTokens: parseInt(process.env.API_MAX_TOKENS) || 512,
        temperature: parseFloat(process.env.API_TEMPERATURE) || 0.6,
        endpoint: process.env.API_ENDPOINT || 'https://api.perplexity.ai/chat/completions'
    },

    // Timeout Configuration
    timeouts: {
        default: parseInt(process.env.DEFAULT_TIMEOUT) || 30000,
        reactApp: parseInt(process.env.REACT_APP_TIMEOUT) || 300000,
        longRunning: parseInt(process.env.LONG_RUNNING_TIMEOUT) || 600000
    },

    // Buffer Configuration
    execution: {
        maxBuffer: parseInt(process.env.MAX_BUFFER) || 1024 * 1024 * 10, // 10MB
        encoding: process.env.ENCODING || 'utf8'
    },

    // Debug Configuration
    debug: process.env.DEBUG === 'true',

    // Validation
    validate() {
        if (!this.api.key) {
            throw new Error('API_SecretKey is required in .env file');
        }
        return true;
    }
};

export default config;