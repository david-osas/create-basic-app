import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa'
import Listr from 'listr'
import { projectInstall } from 'pkg-install'

// check for r+w access
const access = promisify(fs.access)
// recursive file copy
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    // Create App Folder 
    const newPath = `${options.targetDirectory}\\${options.projectName}`

    try {
        fs.mkdirSync(newPath)
        console.log('App %s has been created!', chalk.bold.green(`${options.projectName}`))
    } catch (err) {
        console.log(err)
    }
    
    options.targetDirectory = newPath
    return copy(options.templateDirectory, options.targetDirectory, {
        // Prevent file overwrite when copying
        clobber: false
    })
}

async function initGit(options) {
    const result = await execa('git', ['init'], {
        cwd: options.targetDirectory,
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


    let currentFileUrl = import.meta.url
    // Fix for the double C:/C:/
    currentFileUrl = currentFileUrl.replace('file:///', '');
    const templateDir = path.resolve(
        new URL(currentFileUrl).pathname,
        '../../templates',
        options.template.toLowerCase()
    );
    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK)
    }
    catch (err) {
        console.log(templateDir)
        console.error('%s Invalid template name', chalk.red.bold("Error"))
        process.exit(1)
    }

    const tasks = new Listr([
        {
            title: 'Copying Project files',
            task: () => copyTemplateFiles(options)
        },
        {
            title: 'Initialize Git',
            task: () => initGit(options),
            enabled: () => options.git
        },
        {
            title: 'Install dependecies',
            task: () => projectInstall({
                cwd: options.targetDirectory,
            }),
            skip: () => !options.runInstall ? 'Pass --install or --i to automatically install dependecies'
                : undefined
        }

    ]);

    await tasks.run()

    console.log('%s Project ready', chalk.green.bold('DONE'))
    return true;

}