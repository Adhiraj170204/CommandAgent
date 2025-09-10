
import fs from 'fs';
import path from 'path';

class Logger {
    constructor() {
        this.logDir = 'logs';
        this.ensureLogDir();
        this.silent = process.env.SILENT_CONSOLE === 'true';
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


        const colors = {
            INFO: '\x1b[36m',
            SUCCESS: '\x1b[32m',
            WARNING: '\x1b[33m',
            ERROR: '\x1b[31m',
            RESET: '\x1b[0m'
        };

        if (!this.silent) {
            console.log(`${colors[level] || ''}[${level}] ${timestamp}: ${message}${colors.RESET}`);
            if (data) {
                console.log(JSON.stringify(data, null, 2));
            }
        }


        const logFile = path.join(this.logDir, `agent-${new Date().toISOString().split('T')[0]}.log`);
        fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    }

    info(message, data) { this.log('INFO', message, data); }
    success(message, data) { this.log('SUCCESS', message, data); }
    warning(message, data) { this.log('WARNING', message, data); }
    error(message, data) { this.log('ERROR', message, data); }
}

export default new Logger();