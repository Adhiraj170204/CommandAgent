
import dotenv from 'dotenv';
dotenv.config();

const config = {

    api: {
        key: process.env.OPENAI_API_KEY || process.env.API_SecretKey,
        model: process.env.API_MODEL || 'gpt-4o-mini',
        maxTokens: parseInt(process.env.API_MAX_TOKENS) || 512,
        temperature: parseFloat(process.env.API_TEMPERATURE) || 0.6,
        endpoint: process.env.API_ENDPOINT || 'https://api.openai.com/v1/chat/completions'
    },


    timeouts: {
        default: parseInt(process.env.DEFAULT_TIMEOUT) || 30000,
        reactApp: parseInt(process.env.REACT_APP_TIMEOUT) || 300000,
        longRunning: parseInt(process.env.LONG_RUNNING_TIMEOUT) || 600000
    },


    execution: {
        maxBuffer: parseInt(process.env.MAX_BUFFER) || 1024 * 1024 * 10,
        encoding: process.env.ENCODING || 'utf8'
    },


    debug: process.env.DEBUG === 'true',


    validate() {
        if (!this.api.key) {
            throw new Error('Missing OpenAI API key. Set OPENAI_API_KEY in .env');
        }
        return true;
    }
};

export default config;