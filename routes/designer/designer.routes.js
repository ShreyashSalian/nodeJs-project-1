const express = require('express');
const {addDesigner,listAllDesignerTask,updateDesignerTask,checkHoliday,testingSendMail,getDesignerTaskByID} = require("../../controllers/designer/designer.controller");
const designerRouter = new express.Router();
const {designerRules} = require("../../validation_rules/addDesigner.validation");
const validateApi = require("../../middlewares/validator");

designerRouter.post('/',designerRules(),validateApi,addDesigner);
designerRouter.get('/',listAllDesignerTask);
// designerRouter.get("/holiday-list",checkHoliday);
// designerRouter.get("/sendMail",testingSendMail);
designerRouter.put('/:id',designerRules(),validateApi,updateDesignerTask);
designerRouter.post('/:id',getDesignerTaskByID);


module.exports = {designerRouter};