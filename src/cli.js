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
            '-i': '--install',
        },
        {
            argv: rawArgs.slice(2),

        }
    )
    // // For Testing remove
    // console.log(rawArgs)
    return {
        skipPrompts : args['--yes'] || false,
        git : args['--git'] || false,
        template: args._[0],
        runInstall : args['--install'] || false,
        projectName : args._[1]


    }
}

async function promptForMissingOptions(options){
    const defaultTemplate = 'Test';
    const defaultName = 'my-app';
    if (options.skipPrompts){
        return{
            ...options,
            template: options.template || defaultTemplate,
            projectName : options.projectName || defaultName
        }
    }

    const questions = []
    if (!options.template){
        questions.push({
            type : 'list',
            name : 'template',
            message : 'Please Choose which Project Template to use',
            // Add Templates here
            choices :['Test'],
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

    const answers = await inquirer.prompt(questions)
    // For Testing remove
    // console.log(answers)
    return{
        ...options,
        template : options.template || answers.template,
        projectName: options.projectName || answers.projectName,
        git : options.git || answers.git,
    }
}

export async function cli(args){
    let options = parseArgumentsIntoOptions(args);
    // For Testing remove
    // console.log(options)
    options = await promptForMissingOptions(options)
    await createProject(options)
    // // For Testing remove
    // console.log(options)
}
