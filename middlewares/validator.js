const { validationResult } = require("express-validator");


const validateApi = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    return next();
  }
  const extractedErrors = {};
  error
    .array({ onlyFirstError: true })
    .map((err) => (extractedErrors[err.param] = err.msg));
  const responsePayload = {
    status: 0,
    message: null,
    data: null,
    error: extractedErrors,
  };

  return res
    .status(417)
    .json(responsePayload);
};

module.exports = validateApi;
