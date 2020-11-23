import arg from "arg"
import inquirer from "inquirer";
import {createProject} from './main'

// Take arguments from command line and process them into options
function parseArgumentsIntoOptions(rawArgs){
    const args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--install': Boolean,
            '--pip' : Boolean,
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install',
            '-p':'--pip'
        },
        {
            argv: rawArgs.slice(2),

        }
    )

    return {
        skipPrompts : args['--yes'] || false,
        git : args['--git'] || false,
        template: args._[0],
        runInstall : args['--install'] || false,
        projectName : args._[1],
        runPipInstall : args['--pip'] || false

    }
}

//function to ask for app generation inputs from user
async function promptForMissingOptions(options){
    const defaultTemplate = 'Fullstack';
    const defaultName = 'my-app';

    //skips questions to ask the user if specified in command line arguments
    if (options.skipPrompts){
        return{
            ...options,
            template: options.template || defaultTemplate,
            projectName : options.projectName || defaultName
        }
    }

    //initializes argument questions to ask the user in the command line
    const questions = []
    if (!options.template){
        questions.push({
            type : 'list',
            name : 'template',
            message : 'Please Choose which Project Template to use',
            // Add Templates here
            choices :['express-fullstack', 'express-fullstack-with-sql', 'express-fullstack-with-nosql',
             'express-rest-api', 'express-rest-api-with-sql', 'express-rest-api-with-nosql', 
             'django-sql','djangoRest', 'flask-sql', 'flaskRest'],
            default : defaultTemplate,
        })
    }
    if(!options.projectName){
        questions.push({
            name : 'projectName',
            message: 'Enter your project name: ',
            default : defaultName
        })
    }

    if (!options.git){
        questions.push({
            type: 'confirm',
            name: 'git',
            message : 'Initialize a git repository',
            default : false,
        })
    }
    if (!options.runInstall){
        questions.push({
            type: 'confirm',
            name: 'runInstall',
            message : 'Automatically install npm dependecies',
            default : false,
        })
    }
    if (!options.runPipInstall){
        questions.push({
            type: 'confirm',
            name: 'runPipInstall',
            message : 'Automatically install python dependecies',
            default : false,
        })
    }

    const answers = await inquirer.prompt(questions)

    //updates and returns options variable based on answers from the user
    return{
        ...options,
        template : options.template || answers.template,
        projectName: options.projectName || answers.projectName,
        git : options.git || answers.git,
        runInstall : options.runInstall || answers.runInstall,
        runPipInstall : options.runPipInstall || answers.runPipInstall
    }
}

//main function called by cli command
export async function cli(args){
    let options = parseArgumentsIntoOptions(args);

    options = await promptForMissingOptions(options)
    await createProject(options)
}
