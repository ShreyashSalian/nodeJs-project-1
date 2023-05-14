let express = require('express');

const { designerRouter } = require("./designer/designer.routes");
const { userRouter } = require("./user/user.routes");

const indexRouter = new express.Router();

indexRouter.use('/designer',designerRouter);
indexRouter.use("/users",userRouter);

module.exports = indexRouter;