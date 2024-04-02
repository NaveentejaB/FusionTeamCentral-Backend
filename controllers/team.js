const Team = require("../models/team_model")
const {User} = require("../models/user_model");


// to create team
module.exports.createTeam = async(req,res) =>{
    const {teamName,teamMembersIDs} = req.body

    const maxTeamId = await Team.aggregate([
        {$group : {_id:null,maxFeild:{$max:'$teamID'}}}
    ])
    let teamID = (maxTeamId.length > 0) ? maxTeamId[0].maxFeild+1 : 1

    // fetching all the users info who are going to be part of team
    const teamMembers = await User.find({userID : { $in : teamMembersIDs }})
    await new Team({
        teamID,teamName,teamMembers
    }).save()

    // update the team members with team ID (one user can be part of one team only)
    const updateUsers = await User.updateMany({userID : {$in:teamMembersIDs}},{
        $set : {userTeamId:teamID}
    })
    return res.status(200).json({
        message : `new team with ID ${teamID} added.`,
        error : false
    })
}

// to retrive all the team created by the user
module.exports.getAllTeams = async(req,res) =>{
    const teams = await Team.find({})
    return res.status(200).json({
        teams : teams,
        message : `fetched all the teams.`,
        error : false
    })
}

// specific team details
module.exports.getSpecificTeam = async(req,res) => {
    const team = await Team.findOne({TeamID:req.params.TeamID})
    if(!team)
        return res.status(400).json({
            message : `no team found with given ID.`,
            error : true
        })
    res.status(200).json({
        data : team,
        message : `fetched details of the team.`,
        error : false
    })
}

