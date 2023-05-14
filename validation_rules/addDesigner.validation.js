const {checkSchema} = require("express-validator");
const designerRules = () => {
    return checkSchema({
        team : {
            notEmpty : {
                errorMessage : "Please enter the team name"
            }
        },
        project : {
            notEmpty : {
                errorMessage : "Please enter the project name"
            }
        },
        hours : {
            // isLength: {
            //     errorMessage: "The Hours must be less than 8 hours",
            //     options: { min: 1, max: 8}
            // },   
            notEmpty : {
                errorMessage : "Please enter the hours"
            },
            
        },
        date : {
            notEmpty : {
                errorMessage : "Please enter the date",
            }
        }
    })
}

module.exports = {
    designerRules
}