const team = require("../controllers/team")
const express = require("express")

const teamRouter = express.Router()

teamRouter.get("/team",team.getAllTeams)

teamRouter.get("/team/:teamID",team.getSpecificTeam)

teamRouter.post("/team",team.createTeam)

module.exports = teamRouter