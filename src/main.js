import chalk from 'chalk';
import path from 'path';
import execa from 'execa'
import Listr from 'listr'
import { projectInstall } from 'pkg-install'
import {rest} from './copy/rest.js';
import {fullstack} from './copy/fullstack.js';

async function initGit(options, newPath) {
    const result = await execa('git', ['init'], {
        cwd: newPath,
    })
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize Git'));
    }
    return;
}

export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),

    }
    const newPath =  path.join(options.targetDirectory, options.projectName);

    const tasks = new Listr([
        {
            title: 'Copying Project files',
            task: () => copyTemplateFiles(options)
        },
        {
            title: 'Initialize Git',
            task: () => initGit(options, newPath),
            enabled: () => options.git
        },
        {
            title: 'Install dependecies',
            task: () => projectInstall({
                cwd: newPath,
            }),
            skip: () => !options.runInstall ? 'Pass --install or --i to automatically install dependecies'
                : undefined
        }

    ]);

    await tasks.run()

    console.log('%s Project ready', chalk.green.bold('DONE'))
    return true;

}
