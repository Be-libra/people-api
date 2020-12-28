var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userinfoSchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 100},
    email: {type: String, required: true, maxlength: 100,unique:true},
    photo: {type: String, required: false, maxlength: 100}

  }
);

module.exports = mongoose.model('UserInfo', userinfoSchema);