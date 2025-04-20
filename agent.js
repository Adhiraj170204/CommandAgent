// This file contains the main functioning of the agent that uses the generateCommands function to create and execute git bash commands based on user input. It uses inquirer for user interaction and child_process for command execution.
import generateCommands from './ai-service.js';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const { prompt } = inquirer;

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
            console.log(`Executing: ${cmd.command}`);

            if (cmd.command.startsWith('mkdir ') && cmd.command.includes('&& cd ')) {
                const match = cmd.command.match(/mkdir\s+([^\s]+)\s+&&\s+cd\s+([^\s]+)/);
                if (match) {
                    const folder = match[2];
                    if (!fs.existsSync(folder)) {
                        fs.mkdirSync(folder);
                        console.log(`Created directory: ${folder}`);
                    } else {
                        console.log(`Directory already exists: ${folder}`);
                    }
                    currentDir = require('path').join(currentDir, folder);
                    continue; 
                }
            }

            try {
                const { stdout, stderr } = await execPromise(cmd.command, currentDir);
                console.log('Output:', stdout);
                if (stderr) console.error('Error:', stderr);
            } catch (error) {
                console.error('Execution failed:', error.message);
                const { continueExecution } = await prompt([
                    {
                        type: 'confirm',
                        name: 'continueExecution',
                        message: 'Do you want to continue executing the remaining commands?',
                        default: false,
                    },
                ]);
                if (!continueExecution) break;
            }
        }
    } else {
        console.log('Execution cancelled.');
    }
}

function execPromise(command, cwd) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({ stdout, stderr });
        });
    });
}

runAgent();
