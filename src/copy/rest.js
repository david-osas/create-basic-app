import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

// check for r+w access
const access = promisify(fs.access)
// recursive file copy
const copy = promisify(ncp);

async function rest(feature, options, newPath){
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
      __dirname,
      '../../templates/rest',
      restPath
  );

  const gitignoreTemplate = path.join(
      __dirname,
      '../../templates/rest/.gitignore'
  );

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

async function copyRestTemplates(options, baseTemplate, newPath, gitignoreTemplate){

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

  if(options.git){
    await copy(gitignoreTemplate, newPath, {
      // Prevent file overwrite when copying
      clobber: false
    });
  }
}

export {rest}
