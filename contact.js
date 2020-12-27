const express = require("express");
const {google} = require('googleapis');
const cors = require('cors')

const app = express();
const scopes=["https://www.googleapis.com/auth/contacts"];
const oauth2Client = new google.auth.OAuth2(
    "732526071711-urf9k8u1v505hads4susftruhoa250tg.apps.googleusercontent.com",
    "_HGzUN_xC4JFAzEisYrzunuq",
    "http://localhost:3001/oauth2callback"
  );
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
  
    // If you only need one scope you can pass it as a string
    scope: scopes
  });
  app.use(cors())

app.get('/', async(req,res)=>{
    try{
        const url = oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',
          
            // If you only need one scope you can pass it as a string
            scope: scopes
          });
          console.log(url)
          res.json(url)
          app.get('/oauth2callback',async(req,res)=>{
              const {code} = req.query;
              const {tokens} = await oauth2Client.getToken(code)
                oauth2Client.setCredentials(tokens);
                const {people} = google.people({
                    version:"v1",
                    auth: oauth2Client
                })
            
                const response = await people.connections.list({
                            resourceName:"people/me",
                            personFields:"names"
                        })
                        let contactsDetail = []
                        console.log(response.data.connections[0])
                        response.data.connections.map((contact,index)=>{
                          if(index<10){
                            contactsDetail.push(contact)
                          }
                        })
                        res.send(response.data)
                        
          })
    }
    catch(error){
        console.log(error)
    }

})


app.listen(3001,()=>{console.log("port running")});