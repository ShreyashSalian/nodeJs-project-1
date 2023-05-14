const mongoose = require("mongoose");
const cron = require("node-cron");
const nodemailer = require("nodemailer");   
require("dotenv").config();
const Designer = require("../schemas/designer.schemas");
const {getTomorrow} = require("../helpers/addTask");


const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const host = process.env.HOST;
const port = process.env.DB_PORT;
const mongo = process.env.DB_TYPE;

// const uri = `${mongo}://${user}:${password}@${host}:${port}`;
//const uri = 'mongodb://localhost:27017/opus-backend';
// const uri = `${mongo}://${host}:${port}/${database}`;

mongoose.set("strictQuery", false);
mongoose.set("debug", true);
// const db = async () => {
//   try {
//     await new mongoose.connect(uri);
//   } catch (err) {
//     console.error("errrr", err);
//   }
// };

// module.exports = db;

mongoose.connect(
    `${mongo}://${host}:${port}/${database}`, 
    {
      useNewUrlParser: true,
    //   useFindAndModify: false,
      useUnifiedTopology: true
    }
    
  ).then((connect)=>{
    console.log('Connected with the database.');
  }).catch((err)=>{
    console.log('error ===>',err);
  })
 
  cron.schedule("5 47 09 * * *", async function () {
    let message;
    let tomorrowFullFormat = await getTomorrow(1);
    let tomorrow = await getTomorrow(0);
    let alldesignerTask = await Designer.find({date : tomorrow});
    if(alldesignerTask.length > 0){
      message = (
        '<table style="border: 1px solid #333;width:100%">' +
        '<thead style="padding: 15px; text-align: center;">' +
        '<th> No </th>' +
        '<th> Id </th>' +
        '<th> Team </th>'  +
        '<th> Project </th>'  +
        '<th> Hours </th>'  +
        '<th> Date </th>'  +
        /*...*/
        '</thead>'
    );
    let i = 1;
    for(const { _id, team, project,hours,date } of alldesignerTask) {
      const currentDate = new Date(date);
      const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        message += (
          '<tbody style="padding: 15px; text-align: center;">'+
            '<tr>' +
            '<td>' + i + '</td>' +
            '<td>' + _id + '</td>' +
            '<td>' + team + '</td>' +
            '<td>' + project + '</td>' +
            '<td>' + hours + '</td>' +
            '<td>' + currentDate.toLocaleDateString('en-us', options) + '</td>' +
            /*...*/
          '</tr>'+
         '</body>'
        );
        i++;
     }
     message += '</table>';
    }
    else{
      message = (
        `<h3>There is no designer task assign for ${tomorrowFullFormat}</h3>`
      );
    }
        
    let transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        port:465,
        secure:false,
        auth: {
          user: process.env.USER_EMAIL, 
          pass: process.env.USER_PASSWORD, 
        },
      });

      let info = await transporter.sendMail({  
        from: process.env.USER_EMAIL,
        to: process.env.USER_EMAIL,
        subject: `The Designer task for ${tomorrowFullFormat}`,
        text: "The Designer task for ${tomorrowFullFormat}",
        html: message,
      });

      console.log("info--------------------------", info);
      console.log("Message sent: %s************************", info.messageId);
      console.log(
        "Preview URL: %s-------------------",
        nodemailer.getTestMessageUrl(info)
      );
});

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {
//   console.log("Connected successfully");
// });