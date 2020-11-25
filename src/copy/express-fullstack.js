import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

// check for read + write access
const access = promisify(fs.access)
// recursive file copy
const copy = promisify(ncp);

//main fullstack generation function
async function expressFullstack(feature, options, newPath){

  //set fullstack server path based on the desired feature
  let serverPath = '';
  switch(feature){

    case 'sql':
    serverPath = '/with-database/sql';
    break;

    case 'no-sql':
    serverPath = '/with-database/no-sql';
    break;

    default:
    serverPath = '/without-database';
  }

  //set absolute path to fullstack base templates
  const baseTemplate = path.join(
      __dirname,
      '../../templates/express-fullstack/fullstack-app'
  );

  //set abolsute path to fullstack server templates
  const serverTemplate = path.join(
      __dirname,
      '../../templates/express-fullstack',
      serverPath
  );

  //set absolute path to fullstack gitignore file
  const gitignoreTemplate = path.join(
      __dirname,
      '../../templates/express-fullstack/gitFolder'
  );

  //checks to make sure the template directories are accessable
  try {
      await access(baseTemplate, fs.constants.R_OK);
      await access(serverTemplate, fs.constants.R_OK);
      await access(gitignoreTemplate, fs.constants.R_OK);
  }
  catch (err) {
    console.log(baseTemplate);
    console.log(serverTemplate);
    console.log(gitignoreTemplate);
    console.error('%s Invalid template name', chalk.red.bold("Error"));
    console.log(err);
    process.exit(1);
  }

  return copyFullstackTemplates(options, baseTemplate, serverTemplate, newPath, gitignoreTemplate);
}

//function to carry out the actual copy of templates
async function copyFullstackTemplates(options, baseTemplate, serverTemplate, newPath, gitignoreTemplate){

  //make new app directory
  try {
    fs.mkdirSync(newPath)
    console.log('App %s has been created!', chalk.bold.green(`${options.projectName}`))
  } catch (err) {
    console.log(err)
  }

  //copy fullstack base templates
  await copy(baseTemplate, newPath, {
    // Prevent file overwrite when copying
    clobber: false
  });

  //sets server path for new app generated
  const serverNewPath = path.join(newPath, '/server');

  //copy fullstack server templates
  await copy(serverTemplate, serverNewPath, {
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

export {expressFullstack}
