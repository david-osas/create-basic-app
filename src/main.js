import chalk from 'chalk';
import path from 'path';
import execa from 'execa'
import Listr from 'listr'
import { projectInstall } from 'pkg-install'
import {rest} from './copy/rest.js';
import {fullstack} from './copy/fullstack.js';
import { django } from './copy/django.js';
import { flaskgen } from './copy/flaskgen.js';

//function to initialize git if desired
async function initGit(options, newPath) {
    const result = await execa('git', ['init'], {
        cwd: newPath,
    })
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize Git'));
    }
    return;
}

//function to install python if desired
async function pipIntsall(options, installPath) {
  const result = await execa('pip', ['install','-r', 'requirements.txt'], {
      cwd: installPath,
  })
  if (result.failed) {
      return Promise.reject(new Error('Failed to install requirements'));
  }
  return;
}

//function to generate new app
export async function createProject(options) {

  //sets target directory property
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),

    }

    //sets directory for new app created
    const newPath =  path.join(options.targetDirectory, options.projectName);

    //gets output from pre-app generation checks
    let [feature, installPath, primaryFunct] = preGenerationChecks(options, newPath);

    //ends function execution if pre-generations checks return a null
    if(feature === null || primaryFunct === null || installPath === null){
      console.error('%s Invalid arguments passed', chalk.red.bold("Error"));
      return false;
    }

    //initializes generation tasks
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
            title: 'Install node dependecies',
            task: () => projectInstall({
                cwd: installPath,
            }),
            enabled: () => options.runInstall
        },
        {
          title: 'Install pip dependecies',
          task: () => pipIntsall(options, installPath),
          enabled: () => options.runPipInstall
      }

    ]);

    await tasks.run()

    //console logs final output
    console.log('%s Project ready', chalk.green.bold('DONE'))
    return true;

}

//function to carry out pre-app generation checks on arguments gotten from command line
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
  else if(options.template.includes('flask')){
    primaryFunct = flaskgen;
    installPath = newPath
  }

  else if(options.template.includes('django')){
    primaryFunct = django;
    installPath = newPath
  }

  if(options.template === 'fullstack' || options.template === 'rest-api'|| options.template === 'flask-sql' || options.template === 'django-sql'){
    feature = 'default';
  }else if(options.template === 'fullstack-with-sql' || options.template === 'rest-api-with-sql'|| options.template === 'flask-sql'|| options.template === 'django-sql'){
    feature = 'sql';
  }else if(options.template === 'fullstack-with-nosql' || options.template === 'rest-api-with-nosql'){
    feature  = 'no-sql';
  }
  else if(options.template === 'flaskRest' || options.template === 'djangoRest' ){
    feature ='python-rest';
  }



  return [feature, installPath, primaryFunct];
}
