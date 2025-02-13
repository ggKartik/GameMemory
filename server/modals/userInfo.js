const moongose=require('mongoose');
var validator = require("validator");

const userInfochema=new moongose.Schema({
    firstName:{
        type:String,
        trim:true,
        required:[true,"Please Enter First Name"]
    },
    lastName:{
        type:String,
        trim:true,
        required:[true,"Please Enter Last Name"]
    },
    email:{
        type:String,
        trim:true,
        required:[true,"Please Enter Email"],
        unique:[true,"Email Already In Use"],
        validate: [validator.isEmail, "Please Enter Valid Email"],
    },
    timeTaken:{
        type:String,
        required:true,
    }
},{timestamps:true});

const UserInfo=moongose.model('UserInfo',userInfochema);

module.exports=UserInfo;
