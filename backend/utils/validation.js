// Input validation and sanitization utilities

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

export function validateTaskDescription(task) {
    if (!task || typeof task !== 'string') {
        throw new ValidationError('Task description must be a non-empty string');
    }

    if (task.trim().length === 0) {
        throw new ValidationError('Task description cannot be empty');
    }

    if (task.length > 1000) {
        throw new ValidationError('Task description is too long (max 1000 characters)');
    }

    // Check for potentially dangerous patterns
    const dangerousPatterns = [
        /rm\s+-rf/i,
        /del\s+\/[sq]/i,
        /format\s+[a-z]:/i,
        /shutdown/i,
        /reboot/i,
        />\s*\/dev\/null/i
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(task)) {
            throw new ValidationError('Task description contains potentially dangerous commands');
        }
    }

    return task.trim();
}

export function validateCommand(command) {
    if (!command || typeof command !== 'object') {
        throw new ValidationError('Command must be an object');
    }

    if (!command.command || typeof command.command !== 'string') {
        throw new ValidationError('Command must have a valid command string');
    }

    if (!command.description || typeof command.description !== 'string') {
        throw new ValidationError('Command must have a valid description');
    }

    // Additional command validation
    const cmd = command.command.trim();
    
    if (cmd.length === 0) {
        throw new ValidationError('Command cannot be empty');
    }

    // Block dangerous commands
    const dangerousCommands = [
        /^rm\s+-rf\s+\//,
        /^del\s+\/[sq]\s+\*/,
        /^format\s+[a-z]:/,
        /^shutdown/,
        /^reboot/,
        /^halt/
    ];

    for (const pattern of dangerousCommands) {
        if (pattern.test(cmd)) {
            throw new ValidationError(`Dangerous command blocked: ${cmd}`);
        }
    }

    return command;
}

export function sanitizeFilePath(filePath) {
    if (!filePath || typeof filePath !== 'string') {
        throw new ValidationError('File path must be a string');
    }

    // Remove dangerous path traversal attempts
    const sanitized = filePath
        .replace(/\.\.\//g, '')
        .replace(/\.\.\\/g, '')
        .replace(/[<>:"|?*]/g, '');

    if (sanitized !== filePath) {
        throw new ValidationError('File path contains invalid characters');
    }

    return sanitized;
}