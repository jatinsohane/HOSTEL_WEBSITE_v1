var mongoose = require("mongoose");

//Carpentry Complaint Schema Setup

var carpentrySchema = new mongoose.Schema({
    
    first_name:"String",
    last_name:"String",
    branch:"String",
    semester:Number,
    phone_no:Number,
    usn:"String",
    block_room_no:"String",
    email:"String",
    subject:"String",
    description:"String",
    createdAt:{type:Date,default:Date.now},
    
    
    
    
});




module.exports = mongoose.model("Carpentry",carpentrySchema);