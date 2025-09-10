
import { validateTaskDescription, validateCommand, ValidationError } from '../utils/validation.js';
import generateCommands from '../ai-service.js';

class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('🧪 Running Agent Tests\n');
        
        for (const { name, testFn } of this.tests) {
            try {
                await testFn();
                console.log(`✅ ${name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${name}: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    assertThrows(fn, expectedError, message) {
        try {
            fn();
            throw new Error(message || 'Expected function to throw');
        } catch (error) {
            if (expectedError && !(error instanceof expectedError)) {
                throw new Error(message || `Expected ${expectedError.name}, got ${error.constructor.name}`);
            }
        }
    }
}

const runner = new TestRunner();


runner.test('validateTaskDescription - valid input', () => {
    const result = validateTaskDescription('Create a simple Node.js project');
    runner.assertEqual(result, 'Create a simple Node.js project');
});

runner.test('validateTaskDescription - empty input', () => {
    runner.assertThrows(
        () => validateTaskDescription(''),
        ValidationError,
        'Should throw ValidationError for empty input'
    );
});

runner.test('validateTaskDescription - dangerous command', () => {
    runner.assertThrows(
        () => validateTaskDescription('rm -rf /'),
        ValidationError,
        'Should block dangerous commands'
    );
});

runner.test('validateCommand - valid command', () => {
    const cmd = { command: 'npm init -y', description: 'Initialize npm project' };
    const result = validateCommand(cmd);
    runner.assertEqual(result.command, 'npm init -y');
});

runner.test('validateCommand - missing description', () => {
    runner.assertThrows(
        () => validateCommand({ command: 'npm init -y' }),
        ValidationError,
        'Should require description'
    );
});


runner.test('generateCommands - simple task', async () => {
    process.env.MOCK_AI = 'true';
    const result = await generateCommands('Create a simple HTML file');
    runner.assert(result !== null, 'Should generate commands');
    runner.assert(typeof result.content === 'string', 'content should be a string');
    runner.assert(result.content.trim().startsWith('['), 'content should look like JSON array');
});


runner.run().then(success => {
    process.exit(success ? 0 : 1);
});