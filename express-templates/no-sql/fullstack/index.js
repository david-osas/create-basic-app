// import server modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

//initialze server app
const app = express();

//set middlewares to send static files and parse data being exchanged between front and back ends
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json(), express.urlencoded({extended: false}));

//connect mongoose ODM to your MongoDB database
const mongoDBLink = 'enter your database url here'
try{
  mongoose.connect(mongoDBLink, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}catch(e){
  console.log(e);
}


//default user schema definition
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String
});

//initialze a User model
const User = mongoose.model('User', userSchema);


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
