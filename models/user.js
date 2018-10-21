var mongoose = require("mongoose");
var    passportLocalMongoose=require("passport-local-mongoose");

var UserSchema = mongoose.Schema({
    username:String,
    password:String
    
});

UserSchema.plugin(passportLocalMongoose);//adds some pre defined methods to the userSchema

module.exports = mongoose.model("User",UserSchema);