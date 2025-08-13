#!/usr/bin/env node
// CLI interface for the command agent

import { program } from 'commander';
import generateCommands from './ai-service.js';
import config from './config/config.js';
import logger from './utils/logger.js';
import { validateTaskDescription } from './utils/validation.js';
import fs from 'fs';

program
  .name('command-agent')
  .description('AI-powered automation agent for project setup')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate commands for a task')
  .argument('<task>', 'Task description')
  .option('-o, --output <file>', 'Output commands to file')
  .option('-f, --format <format>', 'Output format (json|text)', 'text')
  .action(async (task, options) => {
    try {
      const validatedTask = validateTaskDescription(task);
      logger.info('Generating commands', { task: validatedTask });
      
      const commands = await generateCommands(validatedTask);
      
      if (!commands) {
        logger.error('Failed to generate commands');
        process.exit(1);
      }

      // Parse commands
      const match = commands.match(/\[\s*{[\s\S]*}\s*\]/);
      if (!match) {
        logger.error('No valid JSON array found in response');
        process.exit(1);
      }

      const parsedCommands = JSON.parse(match[0]);
      
      let output;
      if (options.format === 'json') {
        output = JSON.stringify(parsedCommands, null, 2);
      } else {
        output = parsedCommands.map((cmd, i) => 
          `${i + 1}. ${cmd.description}\n   Command: ${cmd.command}`
        ).join('\n\n');
      }

      if (options.output) {
        fs.writeFileSync(options.output, output);
        logger.success(`Commands saved to ${options.output}`);
      } else {
        console.log(output);
      }

    } catch (error) {
      logger.error('Command generation failed', { error: error.message });
      process.exit(1);
    }
  });

program
  .command('interactive')
  .description('Run in interactive mode')
  .action(async () => {
    const { runAgent } = await import('./agent.js');
    await runAgent();
  });

program
  .command('test')
  .description('Run test suite')
  .action(async () => {
    const { default: testRunner } = await import('./tests/agent.test.js');
    // Test runner is already executed in the import
  });

program.parse();