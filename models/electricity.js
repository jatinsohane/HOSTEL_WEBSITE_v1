var mongoose = require("mongoose");

//Electricity Complaint Schema Setup

var electricitySchema = new mongoose.Schema({
    
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
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
    
});




module.exports = mongoose.model("Electricity",electricitySchema);