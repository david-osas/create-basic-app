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
async function rest(feature, options, newPath){

  //set rest api server path based on the desired feature
  let restPath = '';
  switch(feature){

    case 'sql':
    restPath = '/rest-api-sql';
    break;

    case 'no-sql':
    restPath = '/rest-api-no-sql';
    break;

    default:
    restPath = '/rest-api';
  }

  //set absolute path to rest api base templates
  const baseTemplate = path.join(
      __dirname,
      '../../templates/rest',
      restPath
  );

  //set absolute path to rest api gitignore file
  const gitignoreTemplate = path.join(
      __dirname,
      '../../templates/rest/git'
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

  //copy rest api base templates
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

export {rest}
