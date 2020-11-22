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

    let [feature, installPath, primaryFunct] = preGenerationChecks(options, newPath);

    if(feature === null || primaryFunct === null || installPath === null){
      console.error('%s Invalid arguments passed', chalk.red.bold("Error"));
      return false;
    }

    const tasks = new Listr([
        {
            title: 'Generating Project files',
            task: () => primaryFunct(feature, options, newPath)
        },
        {
            title: 'Initialize Git',
            task: () => initGit(options, newPath),
            enabled: () => options.git
        },
        {
            title: 'Install dependecies',
            task: () => projectInstall({
                cwd: installPath,
            }),
            enabled: () => options.runInstall
        }

    ]);

    await tasks.run()

    console.log('%s Project ready', chalk.green.bold('DONE'))
    return true;

}

function preGenerationChecks(options, newPath){
  let feature = null;
  let installPath = null;
  let primaryFunct = null;

  if(options.template.includes('fullstack')){
    primaryFunct = fullstack;
    installPath = path.join(newPath, '/server');

  }else if(options.template.includes('rest')){
    primaryFunct = rest;
    installPath = newPath;
  }

  if(options.template === 'fullstack' || options.template === 'rest-api'){
    feature = 'default';
  }else if(options.template === 'fullstack-with-sql' || options.template === 'rest-api-with-sql'){
    feature = 'sql';
  }else if(options.template === 'fullstack-with-nosql' || options.template === 'rest-api-with-nosql'){
    feature  = 'no-sql';
  }

  return [feature, installPath, primaryFunct];
}
