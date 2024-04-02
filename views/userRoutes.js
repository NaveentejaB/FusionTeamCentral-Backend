const user = require("../controllers/users")
const express = require("express")

const userRouter = express.Router()

userRouter.post("/users/:page",user.getAllUsers)

userRouter.get("/users/:userID",user.getSpecificUser)

userRouter.post("/users/",user.addNewUser)

userRouter.put("/users/:userID",user.updateUser)

userRouter.delete("/users/:userID",user.deleteUser)

userRouter.get('/users/h/a',user.bulkAddJsonData)

module.exports = userRouter

