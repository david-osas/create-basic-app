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

    let feature = '';
    if(options.template === 'Fullstack' || options.template === 'Rest API'){
      feature = 'default';
    }else if(options.template === 'Fullstack with SQL' || options.template === 'Rest API with SQL'){
      feature = 'sql';
    }else{
      feature  = 'no-sql';
    }

    const tasks = new Listr([
        {
            title: 'Generating Project files',
            task: () => options.template.includes('Fullstack')? fullstack(feature, options, newPath) : rest(feature, options, newPath)
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
