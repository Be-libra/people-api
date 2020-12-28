var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var connectionsSchema =  new Schema({
    email : {type:String,required:true,unique:true},
    contacts:{type:Array, default : []}

})

module.exports = mongoose.model('Contacts', connectionsSchema);