// import server modules
const express = require('express');
const path = require('path');
const { Sequelize } = require('sequelize');

//initialze server app
const app = express();

//set middlewares to send static files and parse data being exchanged between front and back ends
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json(), express.urlencoded({extended: false}));

//sequelize ORM variable
let sequelize;

//default check to initialze sequelize whether in a development or production environment
if(app.get('env') === 'production'){
  const postgresURI = 'enter your postgres database URI'
  sequelize = new Sequelize(postgresURI);

}else{
  const dbName = 'enter your postgres database name';
  const username = 'enter your postgres database username';
  const password = 'enter your postgres database password';

  sequelize = new Sequelize(dbName, username, password, {
    host: 'localhost',
    dialect: 'postgres'
  });
}


//home route to send default html file
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));

});



//set port variable for either production or development environments
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

//listen to http requests made to server
app.listen(port, () => {
  console.log('server started on port 5000');
})
