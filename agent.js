
import generateCommands from './ai-service.js';

import inquirer from 'inquirer';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const { prompt } = inquirer;


process.on('SIGINT', () => {
    console.log('\n🛑 Process interrupted by user. Exiting...');
    process.exit(0);
});

async function runAgent() {
    let conversation = [];

    let { task } = await prompt([
        {
            type: 'input',
            name: 'task',
            message: 'What task would you like me to perform?',
        },
    ]);

    while (true) {
        console.log('Generating execution plan...');

        const result = await generateCommands(task, conversation);
        if (!result || !result.content || typeof result.content !== 'string' || !result.content.trim()) {
            console.log('Failed to generate valid commands. Please check your input or try again.');
            return;
        }

        conversation.push(result.userMessage, result.assistantMessage);

        let commands = result.content;
        if (typeof commands === 'string') {
            const match = commands.match(/\[\s*{[\s\S]*}\s*\]/);
            if (match) {
                try {
                    commands = JSON.parse(match[0]);
                } catch (e) {
                    console.error('Failed to parse commands JSON:', e.message);
                    commands = null;
                }
            } else {
                console.error('No JSON array found in the command string.');
                commands = null;
            }
        }

        if (!Array.isArray(commands)) {
            console.error('No valid commands array found in the AI response.');
            return;
        }

        console.log('\nHere is my execution plan:');
        commands.map((cmd, index) => { console.log(`${index + 1}. ${cmd.description}`) })

        const { approved } = await prompt([
            {
                type: 'confirm',
                name: 'approved',
                message: 'Do you approve this execution plan?',
                default: false,
            },
        ]);
        console.log('User approval:', approved);

        if (approved) {
            let currentDir = process.cwd();

            const frames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
            let spinnerInterval = null;
            let frameIndex = 0;
            const startSpinner = (text) => {
                process.stdout.write(`${frames[frameIndex]} ${text}`);
                spinnerInterval = setInterval(() => {
                    frameIndex = (frameIndex + 1) % frames.length;
                    process.stdout.write(`\r${frames[frameIndex]} ${text}`);
                }, 80);
            };
            const stopSpinner = (text, success = true) => {
                if (spinnerInterval) clearInterval(spinnerInterval);
                process.stdout.write(`\r${success ? '✔' : '✖'} ${text}\n`);
            };

            for (let i = 0; i < commands.length; i++) {
                const cmd = commands[i];
                if (!cmd.command || typeof cmd.command !== 'string' || cmd.command.length === 0) {
                    continue;
                }

                const stepText = `Step ${i + 1}/${commands.length}: ${cmd.description}`;
                startSpinner(stepText);

                if (cmd.command.startsWith('mkdir ')) {
                    try {
                        const folderMatch = cmd.command.match(/mkdir\s+([^\s&]+)/);
                        if (folderMatch) {
                            const folder = folderMatch[1];
                            const fullPath = path.join(currentDir, folder);
                            if (!fs.existsSync(fullPath)) {
                                fs.mkdirSync(fullPath, { recursive: true });
                            }
                            currentDir = fullPath;
                            stopSpinner(stepText, true);
                            conversation.push({ role: 'assistant', content: `Executed: ${cmd.command}\nResult: directory is ${fullPath}` });
                            continue;
                        }
                    } catch (e) {
                        stopSpinner(stepText, false);
                        const { continueExecution } = await prompt([
                            { type: 'confirm', name: 'continueExecution', message: 'Continue with remaining steps?', default: false }
                        ]);
                        if (!continueExecution) break;
                        continue;
                    }
                }

                if (cmd.command.startsWith('cd ')) {
                    stopSpinner(stepText, true);
                    conversation.push({ role: 'assistant', content: `Skipped: ${cmd.command}\nReason: directory changes handled automatically. CWD: ${currentDir}` });
                    continue;
                }

                let commandTimeout = 30000;
                if (cmd.command.includes('create-react-app')) {
                    commandTimeout = 300000;
                }

                try {
                    const { stdout, stderr } = await execPromise(cmd.command, currentDir, commandTimeout);
                    stopSpinner(stepText, true);
                    const combined = `${stdout || ''}${stderr ? `\n${stderr}` : ''}`.trim();
                    const truncated = combined.length > 1200 ? combined.slice(0, 1200) + '... [truncated]' : combined;
                    conversation.push({ role: 'assistant', content: `Executed: ${cmd.command}\nCWD: ${currentDir}\nOutput:\n${truncated || '[no output]'}` });
                } catch (error) {
                    stopSpinner(stepText, false);
                    const errMsg = (error && error.message) ? error.message : 'Unknown error';
                    conversation.push({ role: 'assistant', content: `Execution failed: ${cmd.command}\nCWD: ${currentDir}\nError: ${errMsg}` });
                    try {
                        const { continueExecution } = await prompt([
                            { type: 'confirm', name: 'continueExecution', message: 'Continue with remaining steps?', default: false }
                        ]);
                        if (!continueExecution) break;
                    } catch (promptError) {
                        console.log('\n🛑 Process interrupted by user. Exiting...');
                        process.exit(0);
                    }
                }
            }
        } else {
            console.log('Execution cancelled.');
        }

        const { more } = await prompt([
            { type: 'confirm', name: 'more', message: 'Is there anything else?', default: false }
        ]);
        if (!more) break;
        const next = await prompt([
            { type: 'input', name: 'task', message: 'What should I do next?' }
        ]);
        task = next.task;
    }
}

function execPromise(command, cwd, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const child = exec(command, {
            cwd,
            timeout: timeout,
            maxBuffer: 1024 * 1024 * 10 // 10MB buffer for large outputs
        }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({ stdout, stderr });
        });


        const timeoutId = setTimeout(() => {
            child.kill();
            reject(new Error(`Command timed out after ${timeout / 1000} seconds`));
        }, timeout);

        child.on('exit', () => {
            clearTimeout(timeoutId);
        });
    });
}

runAgent();
