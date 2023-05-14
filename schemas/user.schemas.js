const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    first_name : {
        type : String,
        max : 50,
        required : true
    },
    last_name : {
        type : String,
        max : 50,
        required : true
    },
    email : {
        type : String,
        max : 50,
        required : true
    },
    password : {
        type : String,
        max : 50,
        required : true
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

const User = mongoose.model('users',userSchema);
module.exports = User;