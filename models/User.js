const mongoose = require('mongoose')

const User = mongoose.model('User', {
    name: {type: String, required: true},
    surname: {type:String, required:true},
    username:{ type:String, required:true, unique:true},
    password:{ type:String, required:true},
    email: {type:String, required: true, unique:true},
    telephone: {type:Number, required: true, unique: true},
    type: {type:String, required:true}
})

module.exports = mongoose.model = User
