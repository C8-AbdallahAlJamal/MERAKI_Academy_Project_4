const express = require("express");
const {addNewRole} = require("../controllers/roleController");
roleRouter = express.Router();

roleRouter.post("/", addNewRole);


module.exports =  roleRouter;