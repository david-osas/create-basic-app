import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

// check for r+w access
const access = promisify(fs.access)
// recursive file copy
const copy = promisify(ncp);

async function fullstack(feature, options, newPath){
  let currentFileUrl = import.meta.url;
  // Fix for the double C:/C:/
  //currentFileUrl = currentFileUrl.replace('file:///', '');
  currentFileUrl = new URL(currentFileUrl).pathname;
  currentFileUrl = currentFileUrl.substring(1);
  //currentFileUrl = __dirname;
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

  const baseTemplate = path.join(
      currentFileUrl,
      '../../../templates/fullstack/fullstack-app'
  );
  const serverTemplate = path.join(
      currentFileUrl,
      '../../../templates/fullstack',
      serverPath
  );

  const gitignoreTemplate = path.join(
      currentFileUrl,
      '../../../templates/fullstack/.gitignore'
  );

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

async function copyFullstackTemplates(options, baseTemplate, serverTemplate, newPath, gitignoreTemplate){

  try {
    fs.mkdirSync(newPath)
    console.log('App %s has been created!', chalk.bold.green(`${options.projectName}`))
  } catch (err) {
    console.log(err)
  }

  await copy(baseTemplate, newPath, {
    // Prevent file overwrite when copying
    clobber: false
  });

  const serverNewPath = path.join(newPath, '/server');

  await copy(serverTemplate, serverNewPath, {
    // Prevent file overwrite when copying
    clobber: false
  });

  if(options.git){
    await copy(gitignoreTemplate, newPath, {
      // Prevent file overwrite when copying
      clobber: false
    });
  }
}

export {fullstack}
