import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

// check for read + write access
const access = promisify(fs.access)
// recursive file copy
const copy = promisify(ncp);

//main rest api generation function
async function django(feature, options, newPath){

  //set flask path based on the desired feature
  let flaskPath = '';
  switch(feature){

    case 'sql':
    flaskPath = '/django-sql';
    break;

    case 'python-rest':
    flaskPath = '/djangoRest';
    break;

    default:
    flaskPath = '/django-sql';
  }

  //set absolute path flask base templates
  const baseTemplate = path.join(
      __dirname,
      '../../templates/django',
      flaskPath
  );

  //set absolute path to rest api gitignore file
  const gitignoreTemplate = path.join(
      __dirname,
      '../../templates/django/git'
  );

  //checks to make sure the template directories are accessable
  try {
    await access(baseTemplate, fs.constants.R_OK);
    await access(gitignoreTemplate, fs.constants.R_OK)
  }
  catch (err) {
    console.log(baseTemplate);
    console.log(gitignoreTemplate);
    console.error('%s Invalid template name', chalk.red.bold("Error"));
    console.log(err);
    process.exit(1);
  }

  return copyRestTemplates(options, baseTemplate, newPath, gitignoreTemplate);
}

//function to carry out the actual copy of templates
async function copyRestTemplates(options, baseTemplate, newPath, gitignoreTemplate){

  //make new app directory
  try {
    fs.mkdirSync(newPath)
    console.log('App %s has been created!', chalk.bold.green(`${options.projectName}`))
  } catch (err) {
    console.log(err)
  }

  //copy flask base templates
  await copy(baseTemplate, newPath, {
    // Prevent file overwrite when copying
    clobber: false
  });

  //copy gitignore file if requested
  if(options.git){
    await copy(gitignoreTemplate, newPath, {
      // Prevent file overwrite when copying
      clobber: false
    });
  }
}

export {django}
