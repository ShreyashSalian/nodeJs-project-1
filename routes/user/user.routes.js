const express = require('express');
const {addUser,login} = require("../../controllers/users/user.controller");

const userRouter = express.Router();
userRouter.get("/",addUser);

module.exports = {userRouter};