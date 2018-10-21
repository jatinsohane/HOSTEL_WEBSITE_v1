var mongoose = require("mongoose");

//Housekeeping Complaint Schema Setup

var housekeepingSchema = new mongoose.Schema({
    
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




module.exports = mongoose.model("Housekeeping",housekeepingSchema);