const express = require("express");
const {google} = require('googleapis');
var mongoose = require('mongoose');
const cors = require('cors')
var UserInfo =  require('./models/userinfo.js')
var Contacts = require ('./models/connections.js')


var mongoDB = 'mongodb+srv://devipad:g0USI4iGjXHE9GPb@cluster0.x5zpv.mongodb.net/contactDetails?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const app = express();


const scopes=[
  "https://www.googleapis.com/auth/contacts",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/gmail.readonly"
];


const oauth2Client = new google.auth.OAuth2(
    "732526071711-urf9k8u1v505hads4susftruhoa250tg.apps.googleusercontent.com",
    "_HGzUN_xC4JFAzEisYrzunuq",
    "http://localhost:3001/oauth2callback"
  );
  app.use(cors())


  var userInfoObject = {
    name:'',
    email:'',
    photo:''
  }

app.get('/', async(req,res)=>{
  
    try{
        const url = oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',
          
            // If you only need one scope you can pass it as a string
            scope: scopes
          });
          res.json(url)
          app.get('/oauth2callback',async(req,res)=>{
              const {code} = req.query;
              const {tokens} = await oauth2Client.getToken(code)
                oauth2Client.setCredentials(tokens);


                const {people} = google.people({
                    version:"v1",
                    auth: oauth2Client
                })

                var oauth2 = google.oauth2({
                  version:"v2",
                  auth: oauth2Client
                })
                oauth2.userinfo.v2.me.get(
                  function(err,res){
                      if(err){console.log(err)}
                      else{
                        userInfoObject.name = res.data.name
                        userInfoObject.photo = res.data.picture

                      }
                  })

                const gmail = google.gmail({
                  version:"v1",
                  auth:oauth2Client
                })

                gmail.users.getProfile({
                  auth:oauth2Client,
                  userId:'me'
                },function(err,res){
                  if(err){console.log(err)}
                  else{
                    userInfoObject.email = res.data.emailAddress
                      UserInfo.insertMany(userInfoObject,function(err,res){
                        if(err){console.log(err)}
                        else {console.log(res)}
                      })
                                       
                  }
                })


                const response = await people.connections.list({
                            resourceName:"people/me",
                            personFields:"names,emailAddresses,phoneNumbers,photos"
                        })
                        Contacts.insertMany({email:userInfoObject.email,contacts:response.data.connections},function(err,res){
                          if(err){console.log(err)}
                          else {console.log('success')}
                        })
                        res.redirect('http://localhost:8080/home')
                        
          })
    }
    catch(error){
        console.log(error)
    }

})
app.get('/home',function(req,res){
  UserInfo.find({email:userInfoObject.email},function(err,response){
    if(err){console.log(err)}
    else {
      res.json(response)
    }
  })
})

app.get('/home/contacts',function(req,res){
  Contacts.find({email:userInfoObject.email},function(err,response){
    if(err){console.log(err)}
    else{
      res.json(response)
    }
  })
})

app.get('/isAuthenticated',function(req,res){
  res.json(userInfoObject.email)
})


app.listen(3001,()=>{console.log("port running")});