# ⚙ Create-basic-app

Create-basic-app is a **CLI** tool for you to quickly bootstrap a new project  boilerplate. By inputting different commands to the create-basic-app CLI in your terminal you can generate different starter codes for JavaScript based or Python based applications. This CLI was created to help developers quickly get started with their amazing and important tasks at hand and reduce the initial boilerplate code developers need to write.

***This CLI was created using Node.Js and as such you need to have Node.Js installed on your computer***


### 🔧 Install 
To use the create-basic-app CLI locally clone the github repo and in your terminal change directory into the cloned repo or use the npm package.

**npm package**  
```
npm i @nkosi-tauro/create-basic-app
```

**Local CLI**
```
git clone https://github.com/david-osas/create-basic-app.git
cd create-basic-app
```

To run the CLI without installing globally run (for testing or development)

```
npm link
```

### ✏ Usage 

**`create-basic-app <Template_Name> <Project_Name> [options]`** 

*Example Usage*

*`create-basic-app flask-sql myFlaskApp --git --install --yes`*

```
[options] available :

--git : Initialize git 
--install : Install app dependencies
--yes: Skip template option prompts
--help: Show commands and options information about the CLI
-g : same as --git
-i : same as --install
-y : same as --yes
-h: same as --help

```
### 📺 Demo 
<br>

![CLI usage](project.gif?raw=true)


### 📒 Available Templates to Generate  
<br>

| ![JavaScript](https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)  | `<Template_Name>`|
| ------------- | ------------- |
| FullStack Express  | `fullstack`  |
| FullStack Express + PostgreSQL (sequelize ORM) | `fullstack-with-sql`  |
| FullStack Express + MongoDB (mongoose ODM) | `fullstack-with-nosql`  |
| Restful API  | `rest-api`  |
| Restful API + PostgreSQL (sequelize ORM) | `rest-api-with-sql`  |
| Restful API + MongoDB (mongoose ODM) | `rest-api-with-nosql`  |

<br>

| ![Python](https://img.shields.io/badge/python%20-%2314354C.svg?&style=for-the-badge&logo=python&logoColor=white) | `<Template_Name>`|
| ------------- | ------------- |
| Flask + SQL  | `flask-sql`  |
| Flask + Restful API  | `flaskRest`  |
| Django + SQL  | `django-sql`  |
| Django + Restful API  | `djangoRest`  |
  

<br>

## 📜 License

This project is licensed under the MIT License - see the LICENSE.md file for details
