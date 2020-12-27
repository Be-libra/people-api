const {google} = require("googleapis");
const path = require("path")
const express = require("express");

const app = express();

const keyFile=path.join(__dirname,"credentials1.json");

const scopes=["https://www.googleapis.com/auth/contacts"];

app.get("/",async (req,res)=>{
    try{
        const {people} = google.people({
            version:"v1",
            auth: await google.auth.getClient({
                keyFile,
                scopes
            })
        })
    
        const response = await people.connections.list({
                    resourceName:"people/me",
                    personFields:"names"
                })
            
        console.log(response);
        res.send(response.data);
    }
    catch(error) {
        console.log(error)
    }
})

app.listen(3002,()=>{console.log("server fit n fine")});

// const run = async() =>{
//     const {people} = google.people({
//         version:"v1",
//         auth: await google.auth.getClient({
//             keyFile,
//             scopes
//         })
//     })

//     // const response = await people.connections.list({
//     //     resourceName:"people/me",
//     //     personFields:names
//     // })

//     const response1  = await people.createContact({
//         parent:"me",
//         requestBody:{
//             names:[{
//                 givenName:"hello",
//                 familyName:"jai"
//             }]
//         }
//     })
//     console.log(response1)
// }
