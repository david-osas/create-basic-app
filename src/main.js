import chalk from 'chalk';
import path from 'path';
import execa from 'execa'
import Listr from 'listr'
import {expressRest} from './copy/express-rest.js';
import {expressFullstack} from './copy/express-fullstack.js';
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
async function appInstall(options, installPath) {
  let result = null;
  if(options.category === 'javascript'){
    result = await execa('npm', ['install'], {
        cwd: installPath,
    });

  }else{
    result = await execa('pip', ['install','-r', 'requirements.txt'], {
        cwd: installPath,
    });
  }

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
            title: 'Install app dependecies',
            task: () => appInstall(options, installPath),
            enabled: () => options.runInstall
        }

    ]);

    await tasks.run()

    //console logs final output
    console.log('%s Project ready', chalk.green.bold('DONE'));
    starterInstructions(primaryFunct);
    return true;

}

//function to display instructions on running newly generated apps
function starterInstructions(primaryFunct){
  switch(primaryFunct){
    case expressFullstack:
    console.log('\nTo start default app use the commands');
    console.log('%s',chalk.cyan.italic('cd <app-name>/server'));
    console.log('and then');
    console.log('%s', chalk.cyan.italic('node index.js'));
    break;

    case expressRest:
    console.log('\nTo start default app use the commands');
    console.log('%s',chalk.cyan.italic('cd <app-name>'));
    console.log('and then');
    console.log('%s', chalk.cyan.italic('node index.js'));
    break;

    case flaskgen:
    console.log('\nTo start default app use the commands');
    console.log('%s',chalk.cyan.italic('cd <app-name>'));
    console.log('and then');
    console.log('Create a virtual enviroment if needed');
    console.log('%s', chalk.cyan.italic('python -m venv env'));
    console.log('Set env variables and Initialise Database');
    console.log('%s', chalk.cyan.italic('set FLASK_APP=flaskr'));
    console.log('%s', chalk.cyan.italic('set FLASK_ENV=development'));
    console.log('%s', chalk.cyan.italic('flask init-db'));
    console.log('%s', chalk.cyan.italic('flask run'));
    break;

    case django:
    console.log('\nTo start default app use the commands');
    console.log('%s',chalk.cyan.italic('cd <app-name>'));
    console.log('and then');
    console.log('%s', chalk.cyan.italic('python manage.py runserver'));
    break;

    default:
    console.log('');

  }

}

//function to carry out pre-app generation checks on arguments gotten from command line
function preGenerationChecks(options, newPath){
  let feature = null;
  let installPath = null;
  let primaryFunct = null;

  if(options.template.includes('express-fullstack')){
    primaryFunct = expressFullstack;
    installPath = path.join(newPath, '/server');

  }else if(options.template.includes('express-rest')){
    primaryFunct = expressRest;
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

  if(options.template === 'express-fullstack' || options.template === 'express-rest-api'|| options.template === 'flask-sql' || options.template === 'django-sql'){
    feature = 'default';
  }else if(options.template === 'express-fullstack-with-sql' || options.template === 'express-rest-api-with-sql'|| options.template === 'flask-sql'|| options.template === 'django-sql'){
    feature = 'sql';
  }else if(options.template === 'express-fullstack-with-nosql' || options.template === 'express-rest-api-with-nosql'){
    feature  = 'no-sql';
  }
  else if(options.template === 'flaskRest' || options.template === 'djangoRest' ){
    feature ='python-rest';
  }



  return [feature, installPath, primaryFunct];
}
