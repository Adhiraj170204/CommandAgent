
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
    const { task } = await prompt([
        {
            type: 'input',
            name: 'task',
            message: 'What task would you like me to perform?',
        },
    ]);

    console.log('Generating execution plan...');

    let commands = await generateCommands(task);

    if (!commands || typeof commands !== 'string' || !commands.trim()) {
        console.log('Failed to generate valid commands. Please check your input or try again.');
        return;
    }
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
    } else if (Array.isArray(commands)) {
    } else {
        console.error('No valid commands array found in the AI response.');
        commands = null;
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

        for (const cmd of commands) {
            if (!cmd.command || typeof cmd.command !== 'string' || cmd.command.length === 0) {
                console.log('No valid command to execute.');
                continue;
            }
            console.log(`Executing: ${cmd.command} (in ${currentDir})`);


            if (cmd.command.startsWith('mkdir ')) {
                const folderMatch = cmd.command.match(/mkdir\s+([^\s&]+)/);
                if (folderMatch) {
                    const folder = folderMatch[1];
                    const fullPath = path.join(currentDir, folder);
                    if (!fs.existsSync(fullPath)) {
                        fs.mkdirSync(fullPath, { recursive: true });
                        console.log(`Created directory: ${fullPath}`);
                    } else {
                        console.log(`Directory already exists: ${fullPath}`);
                    }

                    currentDir = fullPath;
                    console.log(`📁 Current directory updated to: ${currentDir}`);
                    console.log('✅ Command completed successfully\n');
                    continue;
                }
            }


            if (cmd.command.startsWith('cd ')) {
                console.log('⏭️ Skipping cd command - directory changes are handled automatically');
                console.log('✅ Command completed successfully\n');
                continue;
            }


            let commandTimeout = 30000;
            if (cmd.command.includes('create-react-app')) {
                console.log('🚀 Creating React app - this may take a few minutes...');
                commandTimeout = 300000;
            }

            try {
                const { stdout, stderr } = await execPromise(cmd.command, currentDir, commandTimeout);
                console.log('Output:', stdout);
                if (stderr) console.error('Error:', stderr);
                console.log('✅ Command completed successfully\n');
            } catch (error) {
                console.error('❌ Execution failed:', error.message);
                try {
                    const { continueExecution } = await prompt([
                        {
                            type: 'confirm',
                            name: 'continueExecution',
                            message: 'Do you want to continue executing the remaining commands?',
                            default: false,
                        },
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
