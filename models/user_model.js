const mongoose = require("mongoose")
const mongoosePaginate = require('mongoose-paginate-v2')


const userSchema = new mongoose.Schema({
    userID :{
        type : Number,
        required : true,
        unique : true
    },
    userFirstName :{
        type : String,
        required : true
    },
    userLastName :{
        type : String,
        required : true
    },
    userEmail :{
        type : String,
        required : true
    },
    userGender : {
        type: String,
    },
    userAvatar : {
        type : String,
        required : true
    },
    userDomain : {
        type : String,
        enum : ["Sales","Finance","Marketing","IT","Management","UI Designing","Business Development"],
        required : true
    },
    userAvailability : {
        type : Boolean,
        required : true,
        default : false
    },
    userTeamId : {
        type : Number,
        default : -1
    }
})

userSchema.plugin(mongoosePaginate)

// teamSchema.plugin(mongoosePaginate)

const User = mongoose.model("User",userSchema)

module.exports = {User,userSchema}