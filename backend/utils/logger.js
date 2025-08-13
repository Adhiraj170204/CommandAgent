// Enhanced logging utility
import fs from 'fs';
import path from 'path';

class Logger {
    constructor() {
        this.logDir = 'logs';
        this.ensureLogDir();
    }

    ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data
        };

        // Console output with colors
        const colors = {
            INFO: '\x1b[36m',    // Cyan
            SUCCESS: '\x1b[32m', // Green
            WARNING: '\x1b[33m', // Yellow
            ERROR: '\x1b[31m',   // Red
            RESET: '\x1b[0m'     // Reset
        };

        console.log(`${colors[level] || ''}[${level}] ${timestamp}: ${message}${colors.RESET}`);
        
        if (data) {
            console.log(JSON.stringify(data, null, 2));
        }

        // File logging
        const logFile = path.join(this.logDir, `agent-${new Date().toISOString().split('T')[0]}.log`);
        fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    }

    info(message, data) { this.log('INFO', message, data); }
    success(message, data) { this.log('SUCCESS', message, data); }
    warning(message, data) { this.log('WARNING', message, data); }
    error(message, data) { this.log('ERROR', message, data); }
}

export default new Logger();