const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.DATABASE).then(console.log('DB Connected...'));
const UsersSchema = mongoose.Schema(
   {
       userName:String,
       password: String,
       shortUrl:{
            type: String,
            required: true,
            unique: true
       },
       longUrl:String,
       date:Date,
       counter: Number
   }
)
const User = mongoose.model('UrlUser', UsersSchema);
const RegistrationSchema = mongoose.Schema({
    userName:{
        type:String,
        unique: true,
        require: true
    },
    password:{
        type:String,
        require: true  
    }
})
const Registration = mongoose.model('registration', RegistrationSchema)
module.exports = {User, Registration};