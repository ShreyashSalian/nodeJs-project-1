const mongoose = require('mongoose');
const desginerSchema = new mongoose.Schema({
    team : {
        type : String,
        max : 50,
        required : true
    },
    project : {
        type : String,
        max : 50,
        required : true
    },
    hours : {
        type : Number,
        required : true, 
    },
    date : {
        type : Date,
        required : true,
    },
    designer_name : {
        type : String,
        required : false
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
      },
      updated_at: {
          type: Date,
          required: false,
        },
    },
  
    { timeStamps: true },
);

const Designer = mongoose.model('designers',desginerSchema);
module.exports = Designer;