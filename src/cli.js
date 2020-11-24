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
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install'
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
        projectName : args._[1]
    }
}

//function to ask for app generation inputs from user
async function promptForMissingOptions(options){
    const defaultTemplate = 'express-fullstack';
    const defaultName = 'my-app';
    const defaultCategory = 'javascript';

    //skips questions to ask the user if specified in command line arguments
    if (options.skipPrompts){
        return{
            ...options,
            template: options.template || defaultTemplate,
            projectName : options.projectName || defaultName,
            category: options.category || defaultCategory
        }
    }

    //initializes argument questions to ask the user in the command line
    const javascript = ['express-fullstack', 'express-fullstack-with-sql', 'express-fullstack-with-nosql',
     'express-rest-api', 'express-rest-api-with-sql', 'express-rest-api-with-nosql'];

    const python = ['django-sql','djangoRest', 'flask-sql', 'flaskRest'];

    const initialQuestion = [{
        type : 'list',
        name : 'category',
        message : 'Please choose which language to use',
        choices :['javascript', 'python'],
        default : defaultCategory,
    }];

    const initialAnswer = await inquirer.prompt(initialQuestion);
    const templateChoices = initialAnswer.category === 'javascript'? javascript : python;

    const secondaryQuestions = []
    if (!options.template){
        secondaryQuestions.push({
            type : 'list',
            name : 'template',
            message : 'Please choose which project template to generate',
            // Add Templates here
            choices : templateChoices,
            default : defaultTemplate,
        })
    }
    if(!options.projectName){
        secondaryQuestions.push({
            name : 'projectName',
            message: 'Enter your project name: ',
            default : defaultName
        })
    }

    if (!options.git){
        secondaryQuestions.push({
            type: 'confirm',
            name: 'git',
            message : 'Initialize a git repository',
            default : false,
        })
    }
    if (!options.runInstall){
        secondaryQuestions.push({
            type: 'confirm',
            name: 'runInstall',
            message : 'Automatically install app dependecies',
            default : false,
        })
    }

    const answers = await inquirer.prompt(secondaryQuestions);

    //updates and returns options variable based on answers from the user
    return{
        ...options,
        template : options.template || answers.template,
        projectName: options.projectName || answers.projectName,
        git : options.git || answers.git,
        runInstall : options.runInstall || answers.runInstall,
        category: options.category || initialAnswer.category
    }
}

//main function called by cli command
export async function cli(args){
    let options = parseArgumentsIntoOptions(args);

    options = await promptForMissingOptions(options)
    await createProject(options)
}
