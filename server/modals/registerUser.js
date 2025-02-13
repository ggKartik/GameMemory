const moongose=require('mongoose');
var validator = require("validator");

const registerUserSchema = new moongose.Schema({
    email:{
        type:String,
        trim:true,
        required:[true,"Please Enter Email"],
        unique:[true,"Email Already In Use"],
        validate: [validator.isEmail, "Please Enter Valid Email"],
    },
    accessToken:{
        type:String,
        trim:true,
        required:[true,"Please Enter Acess Token"],
        unique:[true,"Token Already In Use"],
    },
    // createdAt: { type: Date, default: Date.now, expires: 10 }
});

// registerUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

const RegisterUser=moongose.model('RegisterUser',registerUserSchema);

module.exports=RegisterUser;