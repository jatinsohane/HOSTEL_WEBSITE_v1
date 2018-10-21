var mongoose = require("mongoose");

//Carpentry Complaint Schema Setup

var plumbingSchema = new mongoose.Schema({
    
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




module.exports = mongoose.model("Plumbing",plumbingSchema);