const mongoose=require('mongoose');
var validator = require("validator");

const userRegistrationSchema = new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        required:[true,"Please Enter Email"],
        unique:[true,"Email Already In Use"],
        validate: [validator.isEmail, "Please Enter Valid Email"],
    },
    accessToken:{
        type:String,
        required:[true,"Please Enter Token"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // 1800 seconds = 30 minutes
    }
},{timestamps:true});

const UserRegistration = mongoose.model('UserRegistration',userRegistrationSchema);

module.exports=UserRegistration;