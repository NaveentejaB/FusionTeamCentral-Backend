const mongoose = require("mongoose")
const {userSchema} = require('./user_model')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const teamSchema = new mongoose.Schema({
    teamID :{
        type : Number,
        required : true,
        unique : true
    },
    teamName : {
        type : String,
        required : true
    },
    teamMembers : {
        type : [userSchema],
        required : true
    }, 
    
})

teamSchema.plugin(mongoosePaginate)

const Team = mongoose.model("Team",teamSchema)

module.exports = Team