const User = require("../../schemas/user.schemas");

const addUser = async(req,res)=>{
    try{
       if(5 > 0){
        console.log('5 is greater');
       }
       else{
        console.log('5 is less than 0')
       }
       console.log('hello world')
    }catch(err){
        console.log(err)
    }
}
const login = async(req,res)=>{
    try{

    }catch(err){
        console.log(err);
    }
}

module.exports = {
    addUser,
    login
}