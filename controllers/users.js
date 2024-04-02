// controllers for the managing users
const {User} = require("../models/user_model")
const Team = require("../models/team_model")
const paginate = require('mongoose-paginate-v2')




module.exports.bulkAddJsonData = async(req,res) => {
    const jsonData = fs.readFileSync(__dirname+'/mockData.json')
    const users = JSON.parse(jsonData)
    const newData = users.map(user => ({
        userID : user.id,
        userFirstName : user.first_name,
        userLastName :user.last_name,
        userEmail :user.email,
        userGender:user.gender,
        userAvatar:user.avatar,
        userDomain:user.domain,
        userAvailability:user.available,
    }))
    const bulkAdd = await User.insertMany(newData)
    return res.status(200).json({
        error : false
    })
}

// add the user
module.exports.addNewUser = async(req,res) =>{
    const {userFirstName,userAvailability,
        userLastName,userEmail,userGender,userAvatar,userDomain} = req.body
    const maxUserId = await User.aggregate([
        {$group : {_id:null,maxFeild:{$max:'$userID'}}}
    ])   
    const userID = maxUserId[0].maxFeild + 1
    await new User({
        userID,userFirstName,userAvailability,
        userLastName,userEmail,userGender,userAvatar,userDomain
    }).save()
    return res.status(200).json({
        message : `new user ${userFirstName} added.`,
        error : false
    })
}

// to get all users
module.exports.getAllUsers = async(req,res) =>{
    // get the page number
    const {filters,searchTerm} = req.body
    const {page} = req.params
    const limit = 20
    
    // search for the users with string starting with "searchTerm" and case insensitive
    const query = queryForSearch(filters)
    query['userFirstName']={ $regex:`^${searchTerm}`, $options:"i" }
    const users = await User.paginate(query,{
        page : page,
        limit : limit,
        offset : (page-1)*limit
    })

    return res.status(200).json({
        data : users,
        message : `fetched the filtered and searched users.`,
        error : false
    })
}

module.exports.getSpecificUser = async(req,res) => {
    const user = await User.findOne({userID:req.params.userID})
    if(!user)
        return res.status(400).json({
            message : `no user found with given ID.`,
            error : true
        })
    return res.status(200).json({
        data : user,
        message : `fetched details of the user : ${user.userFirstName}`,
        error : false
    })
}

module.exports.updateUser = async(req,res) =>{
    const {userFirstName,userAvailability,
        userLastName,userEmail,userGender,useAvatar,userDomain} = req.body
    const {userID} = req.params

    const user = await User.findOne({userID : userID})
    const updateUser = await User.findOneAndUpdate({userID:userID},{
        userFirstName : userFirstName || user.userFirstName,
        userAvailability : userAvailability || user.userAvailability,
        userEmail : userEmail || user.userEmail,
        userLastName : userLastName || user.userLastName,
        userGender : userGender || user.userGender,
        userAvatar : useAvatar || user.useAvatar,
        userDomain : userDomain || user.userDomain
    })
    return res.status(200).json({
        message : `user with ID = ${userID} updated.`,
        error : false
    })
}

module.exports.deleteUser = async(req,res) =>{
    const user = await User.findOne({userID : req.params.userID})
    const teamUpdate = await Team.findOneAndUpdate({teamID:user.userTeamId},{
        $pull : {teamMembers : req.params.userID}
    })
    const delUser = await User.findOneAndDelete({userID : req.params.userID})
    return res.status(200).json({
        message : `user deleted.`,
        error : false
    })
}

// function to form query
const queryForSearch = (filters) => {
    const query ={}
    if(filters.userDomain !== "all"){
        query['userDomain'] = filters.userDomain
    }
    if(filters.userGender !== "all"){
        query['userGender'] = filters.userGender
    }
    if(filters.userAvailability !== "all"){
        query['userAvailability'] = filters.userAvailability
    } 
    return query
}
