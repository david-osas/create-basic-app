import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

// check for r+w access
const access = promisify(fs.access)
// recursive file copy
const copy = promisify(ncp);

function rest(feature, options){
  const currentFileUrl = import.meta.url;
  // Fix for the double C:/C:/
  //currentFileUrl = currentFileUrl.replace('file:///', '');
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

  const baseTemplate = path.join(
      new URL(currentFileUrl).pathname,
      '../../templates/rest',
      restPath
  );

  try {
    await access(baseTemplate, fs.constants.R_OK);
  }
  catch (err) {
    console.log(baseTemplate);
    console.error('%s Invalid template name', chalk.red.bold("Error"));
    process.exit(1);
  }

  return copyRestTemplates(options, baseTemplate);
}

async function copyRestTemplates(options, baseTemplate){
  // Create App Folder
  const newPath = `${options.targetDirectory}\\${options.projectName}`

  try {
    fs.mkdirSync(newPath)
    console.log('App %s has been created!', chalk.bold.green(`${options.projectName}`))
  } catch (err) {
    console.log(err)
  }

  options.targetDirectory = newPath
  await copy(baseTemplate, newPath, {
    // Prevent file overwrite when copying
    clobber: false
  });
}

export {rest}
