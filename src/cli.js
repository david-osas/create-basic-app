import arg from "arg"
import inquirer from "inquirer";
import { createProject } from './main'
import chalk from 'chalk'

// Take arguments from command line and process them into options
function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--install': Boolean,
            '--help': Boolean,
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install',
            '-h': '--help'
        },
        {
            argv: rawArgs.slice(2),

        }
    )

    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],
        runInstall: args['--install'] || false,
        projectName: args._[1],
        helpInfo: args['--help'] || false,

    }
}




//function to ask for app generation inputs from user
async function promptForMissingOptions(options) {
    const defaultTemplate = 'express-fullstack';
    const defaultName = 'my-app';
    const defaultCategory = 'javascript';

    // if help options == true call the helpDocumentation method
    if (options.helpInfo) {
        console.log(helpDocumentation())
        process.exit()
    }

    //skips questions to ask the user if specified in command line arguments
    if (options.skipPrompts) {
        return {
            ...options,
            template: options.template || defaultTemplate,
            projectName: options.projectName || defaultName,
            category: options.category || defaultCategory
        }
    }


    //initializes argument questions to ask the user in the command line
    const javascript = ['express-fullstack', 'express-fullstack-with-sql', 'express-fullstack-with-nosql',
        'express-rest-api', 'express-rest-api-with-sql', 'express-rest-api-with-nosql'];

    const python = ['django-sql', 'djangoRest', 'flask-sql', 'flaskRest'];



    const initialQuestion = [{
        type: 'list',
        name: 'category',
        message: 'Please choose which language to use',
        choices: ['javascript', 'python'],
        default: defaultCategory,
    }];



    const initialAnswer = await inquirer.prompt(initialQuestion);
    const templateChoices = initialAnswer.category === 'javascript' ? javascript : python;

    const secondaryQuestions = []
    if (!options.template) {
        secondaryQuestions.push({
            type: 'list',
            name: 'template',
            message: 'Please choose which project template to generate',
            // Add Templates here
            choices: templateChoices,
            default: defaultTemplate,
        })
    }
    if (!options.projectName) {
        secondaryQuestions.push({
            name: 'projectName',
            message: 'Enter your project name: ',
            default: defaultName
        })
    }

    if (!options.git) {
        secondaryQuestions.push({
            type: 'confirm',
            name: 'git',
            message: 'Initialize a git repository',
            default: false,
        })
    }
    if (!options.runInstall) {
        secondaryQuestions.push({
            type: 'confirm',
            name: 'runInstall',
            message: 'Automatically install app dependecies',
            default: false,
        })
    }

    const answers = await inquirer.prompt(secondaryQuestions);

    //updates and returns options variable based on answers from the user
    return {
        ...options,
        template: options.template || answers.template,
        projectName: options.projectName || answers.projectName,
        git: options.git || answers.git,
        runInstall: options.runInstall || answers.runInstall,
        category: options.category || initialAnswer.category
    }
}

//main function called by cli command
export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options)
    await createProject(options)
}

// Documentation for --help
function helpDocumentation() {
    let docs = `Welcome to Create-Basic-App : A CLI tool to quickly bootstrap starter code

${chalk.black.bgGreen.bold(" USAGE ")}

$ ${chalk.green.bold('create-basic-app')} ${chalk.red.bold('<template_name>')} ${chalk.blue.bold('<project_name>')} ${chalk.yellow.bold('[options]')}

${chalk.black.bgRed.bold(" TEMPLATE_NAME ")}
Available templates to generate : default ${chalk.red.bold('express-fullstack')}

${chalk.yellow.bold('JavaScript Templates :')}
${chalk.red.bold('express-fullstack')} - FullStack Express App
${chalk.red.bold('express-fullstack-with-sql')} - FullStack Express App + SQL
${chalk.red.bold('express-fullstack-with-nosql')} - FullStack Express App + MongoDB
${chalk.red.bold('express-rest-api')} - Restful API
${chalk.red.bold('express-rest-api-with-sql')} - Restful API + SQL
${chalk.red.bold('express-rest-api-with-nosql')} - Restful API + MongoDB

${chalk.blue.bold('Python Templates :')}
${chalk.red.bold('django-sql')} - Django + SQL
${chalk.red.bold('djangoRest')} - Django + Restful API
${chalk.red.bold('flask-sql')} - Flask + SQL
${chalk.red.bold('flaskRest')} - Flask + Restful API

${chalk.black.bgYellow.bold(" OPTIONS ")}

${chalk.yellow('--yes')} Skips all prompts Default : ${chalk.yellow('false')}
${chalk.yellow('--git')} Initializes git Default : ${chalk.yellow('false')}
${chalk.yellow('--install')} Installs app dependecies Default : ${chalk.yellow('false')}
${chalk.yellow('--help')} Project Information Default : ${chalk.yellow('false')}
`
    return docs;
}