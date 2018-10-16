const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const routes = require('./routes/posts')
const app = express();

mongoose.connect('mongodb+srv://sanjay:amma@cluster0-veuqi.mongodb.net/node-angluar?retryWrites=true')
   .then(() => {
      console.log('connected to mognodb successfully...')
   })
   .catch(() => {
      console.log('mongodb connection failed...')
   })
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))


app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader(
     "Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content-Type, Accept"
   );
   res.setHeader(
     "Access-Control-Allow-Methods",
     "GET, POST, PUT, PATCH, DELETE, OPTIONS"
   );
   next();
 });

 app.use('/api/posts',routes)



module.exports = app;