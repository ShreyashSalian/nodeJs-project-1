const Designer = require("../schemas/designer.schemas");
const insertData = async(team,project,hours,date,designer_name)=>{
    try{
        let designerData = await Designer.create({team,project,hours,date,designer_name});
        return designerData;
      
    }catch(err){
      const responsePayload = {
        status: 0,
        message: null,
        data: null,
        error: "Internal server error",
      };
      return res.status(500).json(responsePayload);
    }
}

const getTomorrowDetails = async(date) =>{
  let currentDate = new Date(date);
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  // let day2 = currentDate.getDate()
  // //var month = currentDate.getMonth() + 1
  // let year = currentDate.getFullYear()
  // let month = String(currentDate.getMonth()+1).padStart(2,'0');
  searchDate = currentDate.toLocaleDateString('en-us', options) ;
}


const getTomorrow = async(type) => {
  try{

    if(type === 1){
      const getWeekend = new Date();
      const day = getWeekend.getDay();
      let searchDate;
      if(day === 5){
        searchDate = await getTomorrowDetails(new Date().getTime() + 72 * 60 * 60 * 1000)
          // let currentDate = new Date(new Date().getTime() + 72 * 60 * 60 * 1000);
          // const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
          // let day2 = currentDate.getDate()
          // //var month = currentDate.getMonth() + 1
          // let year = currentDate.getFullYear()
          // let month = String(currentDate.getMonth()+1).padStart(2,'0');
          //searchDate = currentDate.toLocaleDateString('en-us', options) ;
      }
      else if(day === 6){
        let currentDate = new Date(new Date().getTime() + 48 * 60 * 60 * 1000);
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        // let day2 = currentDate.getDate()
        // //var month = currentDate.getMonth() + 1
        // let year = currentDate.getFullYear()
        // let month = String(currentDate.getMonth()+1).padStart(2,'0');
        searchDate = currentDate.toLocaleDateString('en-us', options) ;
      }    
      else{
        let currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        // let day2 = currentDate.getDate()
        // //var month = currentDate.getMonth() + 1
        // let year = currentDate.getFullYear()
        // let month = String(currentDate.getMonth()+1).padStart(2,'0');
        searchDate = currentDate.toLocaleDateString('en-us', options) ;
      }
      return searchDate;
    }
    else{
      const getWeekend = new Date();
      const day = getWeekend.getDay();
      let searchDate;
      if(day === 5){
          let currentDate = new Date(new Date().getTime() + 72 * 60 * 60 * 1000);
          let day2 = currentDate.getDate()
          //var month = currentDate.getMonth() + 1
          let year = currentDate.getFullYear()
          let month = String(currentDate.getMonth()+1).padStart(2,'0');
          searchDate = `${year}-${month}-${day2}`;
      }
      else if(day === 6){
        let currentDate = new Date(new Date().getTime() + 48 * 60 * 60 * 1000);
        let day2 = currentDate.getDate()
        //var month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()
        let month = String(currentDate.getMonth()+1).padStart(2,'0');
        searchDate = `${year}-${month}-${day2}`;
      }    
      else{
        let currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        let day2 = currentDate.getDate()
        //var month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()
        let month = String(currentDate.getMonth()+1).padStart(2,'0');
        searchDate = `${year}-${month}-${day2}`;
      }
      return searchDate;
    }

   
  }
  catch(err){
    const responsePayload = {
      status: 0,
      message: null,
      data: null,
      error: "Internal server error",
    };
    return res
      .status(500)
      .json(responsePayload);
  }
}

const getToday = async()=>{
try{
  let today = new Date();
  let todayDay = today.getDate()
  let todayYear = today.getFullYear()
  let todayMonth = String(today.getMonth()+1).padStart(2,'0');
  let todayDate = `${todayYear}-${todayMonth}-${todayDay}`;
  return todayDate;
  }
  catch(err){
    const responsePayload = {
      status: 0,
      message: null,
      data: null,
      error: "Internal server error",
    };
    return res.status(500).json(responsePayload);
  }
}

module.exports = {
    insertData,
    getTomorrow,
    getToday
}