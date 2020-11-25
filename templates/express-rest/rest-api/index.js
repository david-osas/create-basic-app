// import server modules
const express = require('express');
const {router} = require('./routes');

//initialze server app
const app = express();

//set middleware to parse data being exchanged between front and back ends
app.use(express.json(), express.urlencoded({extended: false}));

//use default routes
app.use('/',router);



//set port variable for either production or development environments
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

//listen to http requests made to server
app.listen(port, () => {
  console.log('server started on port 5000');
})
