const Designer = require("../../schemas/designer.schemas");
const holiday = require("../../helpers/holiday.json");
const timer = require("../../helpers/timer.json");
const {insertData,getTomorrow,getToday} = require('../../helpers/addTask');
const {DESIGNER_TASK_MESSAGES} = require("../../controllerMessages/designerTask/designerTask.messages");

const addDesigner = async(req,res)=>{
    try{
        let givenStartTime;
        let givenEndTime;
        await timer.forEach((t)=>{
            givenStartTime = t.startTime;
            givenEndTime = t.endTime;
        });
        let currentTimeDetails = new Date();
        let currenthours = currentTimeDetails.getHours();
        let currentMinutes = String(currentTimeDetails.getMinutes()+1).padStart(2,'0');
        let currentSeconds = currentTimeDetails.getSeconds();
        let result = "";
        let currentHoursMinutesSeconds = result.concat(currenthours,":",currentMinutes,":",currentSeconds);
        var regex = new RegExp(':', 'g');
        if(parseInt(givenStartTime.replace(regex, ''), 10) >= parseInt(currentHoursMinutesSeconds.replace(regex, ''), 10)){
            const responsePayload = {
                status: 0,
                message: null,
                data: null,
                error: DESIGNER_TASK_MESSAGES.DESIGNER_TASK_TIME,
            };
            return res.status(200).json(responsePayload);
        } 
    
        else if(parseInt(givenEndTime.replace(regex, ''), 10) <= parseInt(currentHoursMinutesSeconds.replace(regex, ''), 10)){
            const responsePayload = {
                status: 0,
                message: null,
                data: null,
                error: DESIGNER_TASK_MESSAGES.DESIGNER_TASK_TIME,
            };
            return res.status(200).json(responsePayload);
        }
        else {
            let holidayList = [];
            let {team,project,hours,date,designer_name} = req.body;
            let ToDate = new Date();
            if (new Date(date).getTime() <= ToDate.getTime()) {
                const responsePayload = {
                    status: 0,
                    message: null,
                    data: null,
                    error: DESIGNER_TASK_MESSAGES.DESIGNER_TASK_OLDER_DATE,
                };
                return res.status(200).json(responsePayload);
            }
            await holiday.forEach((el)=>{
                holidayList.push(el.date);    
            });
            const holidayData = holidayList;
            if(holidayData.includes(date)){
                const responsePayload = {
                    status : 0,
                    message : null,
                    data : null,
                    error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_HOLIDAY,
                }
                return res.status(200).json(responsePayload);
            }
            else{
                const getWeekend = new Date(date);
                const day = getWeekend.getDay();
                let adjustedDate = getWeekend.getDate()+getWeekend.getDay();
                let prefixes = ['0', '1', '2', '3', '4', '5','6'];
                let lastSaturday =  (parseInt(prefixes[0 | adjustedDate / 7]));
                if(day === 0){
                    const responsePayload = {
                        status : 0,
                        message : null,
                        data : null,
                        error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_HOLIDAY,
                    }
                    return res.status(200).json(responsePayload);   
                }

                else if(day === 6){
                    if(lastSaturday === 4 || lastSaturday === 5){
                        if(hours <= 4){
                            // ==================
                            let totalHours = 0;
                            // let details = new Date(date).toISOString().split('T')[0];
                            let designerData1 = await Designer.find({date : date});
                            if(designerData1.length > 0){
                                await designerData1.forEach((d)=>{
                                    totalHours += d.hours;
                                });
                                let remainingHours = 4 - totalHours;
                                if(hours <= remainingHours){
                                    let designerData = await insertData(team,project,hours,date,designer_name);
                                    
                                    if(designerData){
                                    const responsePayload = {
                                        status : 1,
                                        message : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_ADDED,
                                        data : designerData,
                                        error : null,
                                    }
                                    return res.status(200).json(responsePayload);
                                    }
                                    else{
                                    const responsePayload = {
                                        status : 0,
                                        message : null,
                                        data : null,
                                        error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_NOT_ADDED,
                                        }
                                    return res.status(200).json(responsePayload);
                                    }
                                }
                                else{
                                    const responsePayload = {
                                        status : 0,
                                        message : null,
                                        data : null,
                                        error : `Sorry,remaining ${remainingHours} hours are left for the given date`,
                                        }
                                    return res.status(200).json(responsePayload);   
                                }
                            }
                            else{
                                 // =================
                                let designerData = await insertData(team,project,hours,date,designer_name);
                                if(designerData){
                                    const responsePayload = {
                                        status : 1,
                                        message : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_ADDED,
                                        data : designerData,
                                        error : null,
                                    }
                                    return res.status(200).json(responsePayload);
                                }
                                else{
                                    const responsePayload = {
                                        status : 0,
                                        message : null,
                                        data : null,
                                        error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_NOT_ADDED,
                                    }
                                    return res.status(200).json(responsePayload);
                                }
                            }
                        }
                        else{
                            const responsePayload = {
                                status : 0,
                                message : null,
                                data : null,
                                error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_LAST_SATURDAY,
                            }
                            return res.status(200).json(responsePayload);
                        }
                                                                                                  
                    }else{
                        const responsePayload = {
                            status : 0,
                            message : null,
                            data : null,
                            error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_HOLIDAY,
                        }
                        return res.status(200).json(responsePayload);
                    }
                }
                else{
                    if(hours > 8){
                        const responsePayload = {
                            status : 0,
                            message : null,
                            data : null,
                            error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_EIGHT_HOURS_TASK,
                        }
                        return res.status(200).json(responsePayload);
                    }
                    else{
                        // ====================================
                        let totalHours = 0;
                        let {team,project,hours,date,designer_name} = req.body;
                        let details = new Date(date).toISOString().split('T')[0];
                        console.log(details);
                        let designerData1 = await Designer.find({date : date});
                        if(designerData1.length > 0){
                            await designerData1.forEach((d)=>{
                                totalHours += d.hours;
                            });
                            let remainingHours = 8 - totalHours;
                            console.log(hours,"====",remainingHours);
                            if(hours <= remainingHours){
                                let designerData = await insertData(team,project,hours,date,designer_name);
                                
                                if(designerData){
                                const responsePayload = {
                                    status : 1,
                                    message : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_ADDED,
                                    data : designerData,
                                    error : null,
                                }
                                return res.status(200).json(responsePayload);
                                }
                                else{
                                const responsePayload = {
                                    status : 0,
                                    message : null,
                                    data : null,
                                    error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_NOT_ADDED,
                                    }
                                return res.status(200).json(responsePayload);
                                }
                            }
                            else{
                                const responsePayload = {
                                    status : 0,
                                    message : null,
                                    data : null,
                                    error : `Sorry,remaining ${remainingHours} hours are left for the given date`,
                                    }
                                return res.status(200).json(responsePayload);   
                            }
                        }else{
                            let designerData = await insertData(team,project,hours,date,designer_name);
                            if(designerData){
                                const responsePayload = {
                                    status : 1,
                                    message : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_ADDED,
                                    data : designerData,
                                    error : null,
                                }
                                return res.status(200).json(responsePayload);
                            }
                            else{
                                const responsePayload = {
                                    status : 0,
                                    message : null,
                                    data : null,
                                    error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_NOT_ADDED,
                                }
                                return res.status(200).json(responsePayload);
                            }
                        }
                        // ===================================
                       
                    }
                }
            }
        }
        // ================================
    }catch(err){
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

const listAllDesignerTask = async(req,res)=>{
    try{
       let tomorrow = await getTomorrow(0);
       let today = await getToday();
     
       let dateDetails = [];
        let allDesignerTask = await Designer.find({date : {$in : [today,tomorrow]} });
        if(allDesignerTask.length > 0){
            await allDesignerTask.forEach((t)=>{
                //let newDate = new Date(t.date).toISOString().split('T')[0];
                const currentDate = new Date(t.date);
                const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
              
                dateDetails.push({
                    _id : t._id,
                    team : t.team,
                    project : t.project,
                    hours : t.hours,
                    date : currentDate.toLocaleDateString('en-us', options),
                    designer_name : t.designer_name
                });
            });
            const responsePayload = {
                status : 1,
                message : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_LIST,
                data : dateDetails,
                error : null,
            }
            return res.status(200).json(responsePayload);
        }
        else{
            const responsePayload = {
                status : 0,
                message : null,
                data : null,
                error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_NOT_FOUND,
            }
            return res.status(200).json(responsePayload);
        }
    }
    catch(err){
        const responsePayload = {
            status: 0,
            message: err,
            data: null,
            error: "Internal server error",
          };
        return res.status(500).json(responsePayload);
    }
}

const updateDesignerTask = async(req,res)=>{
    try{
        let givenStartTime;
        let givenEndTime;
        await timer.forEach((t)=>{
            givenStartTime = t.startTime;
            givenEndTime = t.endTime;
        });
        let currentTimeDetails = new Date();
        let currenthours = currentTimeDetails.getHours();
        //let currentMinutes = currentTimeDetails.getMinutes();
        let currentMinutes = String(currentTimeDetails.getMinutes()+1).padStart(2,'0');
        let currentSeconds = currentTimeDetails.getSeconds();
        let result = "";
        let currentHoursMinutesSeconds = result.concat(currenthours,":",currentMinutes,":",currentSeconds);
        var regex = new RegExp(':', 'g');
        if(parseInt(givenStartTime.replace(regex, ''), 10) >= parseInt(currentHoursMinutesSeconds.replace(regex, ''), 10)){
            const responsePayload = {
                status: 0,
                message: null,
                data: null,
                error: DESIGNER_TASK_MESSAGES.DESIGNER_TASK_TIME,
            };
            return res.status(200).json(responsePayload);
        } 
    
        else if(parseInt(givenEndTime.replace(regex, ''), 10) <= parseInt(currentHoursMinutesSeconds.replace(regex, ''), 10)){
            const responsePayload = {
                status: 0,
                message: null,
                data: null,
                error: DESIGNER_TASK_MESSAGES.DESIGNER_TASK_TIME,
            };
            return res.status(200).json(responsePayload);
        }else{
            let {id} = req.params;
            let {team,project,hours,date,designer_name} = req.body;
            let ToDate = new Date();
            if (new Date(date).getTime() <= ToDate.getTime()) {
                const responsePayload = {
                    status: 0,
                    message: null,
                    data: null,
                    error: DESIGNER_TASK_MESSAGES.DESIGNER_TASK_OLDER_DATE,
                };
                return res.status(200).json(responsePayload);
            }
            let holidayList = [];
            let data = await holiday.forEach((el)=>{
                holidayList.push(el.date);    
            });
            if(holidayList.includes(date)){
                const responsePayload = {
                    status : 0,
                    message : null,
                    data : null,
                    error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_HOLIDAY,
                }
                return res.status(200).json(responsePayload);
            }
            else{
                const getWeekend = new Date(date);
                const day = getWeekend.getDay();
        
                let adjustedDate = getWeekend.getDate()+getWeekend.getDay();
                let prefixes = ['0', '1', '2', '3', '4', '5','6'];
                let lastSaturday =  (parseInt(prefixes[0 | adjustedDate / 7]));
                if(day === 0){
                    const responsePayload = {
                        status : 0,
                        message : null,
                        data : null,
                        error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_HOLIDAY,
                    }
                    return res.status(200).json(responsePayload);
                
                }
                else if(day === 6){
                    if(lastSaturday === 4 || lastSaturday === 5){
                        if(hours <= 4){
                            // ------------------------------
                            let totalHours = 0;
                            // let details = new Date(date).toISOString().split('T')[0];
                            let designerData1 = await Designer.find({date : date});
                            if(designerData1.length > 0){
                                await designerData1.forEach((d)=>{
                                    totalHours += d.hours;
                                });
                                let remainingHours = 4 - totalHours;
                                if(hours <= remainingHours){
                                    let updateDesignerTask = await Designer.findByIdAndUpdate(id,{
                                        team,
                                        project,
                                        hours,
                                        date,
                                        designer_name
                
                                    },{new : true});
                                    if(updateDesignerTask){
                                        const responsePayload = {
                                            status : 1,
                                            message : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_UPDATED,
                                            data : updateDesignerTask,
                                            error : null,
                                        }
                                        return res.status(200).json(responsePayload);
                                    }
                                    else{
                                        const responsePayload = {
                                            status : 0,
                                            message : null,
                                            data : null,
                                            error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_NOT_UPDATED,
                                        }
                                        return res.status(200).json(responsePayload);
                                    }
                                }else{
                                    const responsePayload = {
                                        status : 0,
                                        message : null,
                                        data : null,
                                        error : `Sorry,remaining ${remainingHours} hours are left for the given date`,
                                        }
                                    return res.status(200).json(responsePayload);  
                                }
                            
                            }
                            else{
                                let updateDesignerTask = await Designer.findByIdAndUpdate(id,{
                                    team,
                                    project,
                                    hours,
                                    date,
                                    designer_name
            
                                },{new : true});
                                if(updateDesignerTask){
                                    const responsePayload = {
                                        status : 1,
                                        message : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_UPDATED,
                                        data : updateDesignerTask,
                                        error : null,
                                    }
                                    return res.status(200).json(responsePayload);
                                }
                                else{
                                    const responsePayload = {
                                        status : 0,
                                        message : null,
                                        data : null,
                                        error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_NOT_UPDATED,
                                    }
                                    return res.status(200).json(responsePayload);
                                }
                            }
                            // --------------------------------        
                        }
                        else{
                            const responsePayload = {
                                status : 0,
                                message : null,
                                data : null,
                                error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_LAST_SATURDAY,
                            }
                            return res.status(200).json(responsePayload);
                        }
                    
                    }else{
                        const responsePayload = {
                            status : 0,
                            message : null,
                            data : null,
                            error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_HOLIDAY,
                        }
                        return res.status(200).json(responsePayload);
                    }
            
                }
                else{
                    if(hours > 8){
                        const responsePayload = {
                            status : 0,
                            message : null,
                            data : null,
                            error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_EIGHT_HOURS_TASK,
                        }
                    return res.status(200).json(responsePayload);
                    }
                    else{   
                       // ------------------------------
                       let totalHours = 0;
                       // let details = new Date(date).toISOString().split('T')[0];
                       let designerData1 = await Designer.find({date : date});
                       if(designerData1.length > 0){
                           await designerData1.forEach((d)=>{
                               totalHours += d.hours;
                           });
                           let remainingHours = 4 - totalHours;
                           if(hours <= remainingHours){
                               let updateDesignerTask = await Designer.findByIdAndUpdate(id,{
                                   team,
                                   project,
                                   hours,
                                   date,
                                   designer_name
           
                               },{new : true});
                               if(updateDesignerTask){
                                   const responsePayload = {
                                       status : 1,
                                       message : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_UPDATED,
                                       data : updateDesignerTask,
                                       error : null,
                                   }
                                   return res.status(200).json(responsePayload);
                               }
                               else{
                                   const responsePayload = {
                                       status : 0,
                                       message : null,
                                       data : null,
                                       error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_NOT_UPDATED,
                                   }
                                   return res.status(200).json(responsePayload);
                               }
                           }else{
                               const responsePayload = {
                                   status : 0,
                                   message : null,
                                   data : null,
                                   error : `Sorry,remaining ${remainingHours} hours are left for the given date`,
                                   }
                               return res.status(200).json(responsePayload);  
                           }
                       
                       }
                       else{
                           let updateDesignerTask = await Designer.findByIdAndUpdate(id,{
                               team,
                               project,
                               hours,
                               date,
                               designer_name
       
                           },{new : true});
                           if(updateDesignerTask){
                               const responsePayload = {
                                   status : 1,
                                   message : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_UPDATED,
                                   data : updateDesignerTask,
                                   error : null,
                               }
                               return res.status(200).json(responsePayload);
                           }
                           else{
                               const responsePayload = {
                                   status : 0,
                                   message : null,
                                   data : null,
                                   error : DESIGNER_TASK_MESSAGES.DESIGNER_TASK_NOT_UPDATED,
                               }
                               return res.status(200).json(responsePayload);
                           }
                       }
                       // --------------------------------      
                    }
            }
        }
    }
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

const getDesignerTaskByID = async(req,res)=>{
    try{
        let {id} = req.params;
        let designerData = await Designer.findById(id);
        if(designerData){
            const responsePayload = {
                status: 1,
                message: DESIGNER_TASK_MESSAGES.DESIGNER_TASK_LIST,
                data: designerData,
                error: null,
              };
              return res.status(200).json(responsePayload);
        }
        else{
            const responsePayload = {
                status: 0,
                message: "",
                data: designerData,
                error: DESIGNER_TASK_MESSAGES.DESIGNER_TASK_NOT_FOUND,
              };
            return res.status(200).json(responsePayload);
        }

        // let {project,date,hours} = req.body;
        // let totalHours = 0;
        // let designerData = await Designer.find({project : project, date : date});
        // console.log(designerData);
        // await designerData.forEach((d)=>{
        //     totalHours += d.hours;
        // })
        // console.log(8,"====",totalHours);
        // if(totalHours >= 8){
        //     console.log('Total hours should not be more than eight hours' + totalHours)
        // }
        // else{
        //    console.log('insertData')
        // }

        // let tomorrow = await getTomorrow();
        // let today = await getToday();
        
        // console.log(tomorrow,today);

        // if(date <= today && date <=tomorrow){
        //     console.log('correct date');
        // }
        // else{
        //     console.log('Not correct date');
        // }

        // let ToDate = new Date();
        // console.log(new Date(date).getTime(),"---------",ToDate.getTime());
        // if (new Date(date).getTime() <= ToDate.getTime()) {
        //   console.log("The Date must be Bigger or Equal to today date");
        // }
        // else{
        //     console.log('Correct date');
        // }

        
        // let totalHours = 0;
        // let {team,project,hours,date,designer_name} = req.body;

        // let givenData = await Designer.find({date : date, project : project});
        
        // if(givenData.length > 0){
        //     console.log('Designer already has been assigned for the given date')
        // }
        // else{
        //     console.log('Hello World');
        // }
        

        // let totalHours = 0;
        // let {team,project,hours,date,designer_name} = req.body;
        // let details = new Date(date).toISOString().split('T')[0];
        // console.log(details);
        // let designerData1 = await Designer.find({date : date});
        // if(designerData1.length > 0){
        //     await designerData1.forEach((d)=>{
        //         totalHours += d.hours;
        //     });
        //     let remainingHours = 8 - totalHours;
        //     console.log(hours,"====",remainingHours);
        //     if(hours <= remainingHours){
        //         let designerData = await insertData(team,project,hours,date,designer_name);
                
        //         if(designerData){
        //         const responsePayload = {
        //             status : 1,
        //             message : "The designer task has been added",
        //             data : designerData,
        //             error : null,
        //         }
        //         return res.status(200).json(responsePayload);
        //         }
        //         else{
        //         const responsePayload = {
        //             status : 0,
        //             message : null,
        //             data : null,
        //             error : "Sorry the designer task cant be added",
        //             }
        //             return res.status(200).json(responsePayload);
        //         }
        //     }
        //     else{
        //         const responsePayload = {
        //             status : 0,
        //             message : null,
        //             data : null,
        //             error : `Sorry you can add up to ${remainingHours} hours for the task`,
        //             }
        //             return res.status(200).json(responsePayload);
            
               
        //     }
        // }

        // else{
        //     // let designerData = await insertData(team,project,hours,date,designer_name);
        //     // if(designerData){
        //     // const responsePayload = {
        //     //     status : 1,
        //     //     message : "The designer task has been added",
        //     //     data : designerData,
        //     //     error : null,
        //     // }
        //     // return res.status(200).json(responsePayload);
        //     // }
        //     // else{
        //     // const responsePayload = {
        //     //     status : 0,
        //     //     message : null,
        //     //     data : null,
        //     //     error : "Sorry the designer task cant be added",
        //     //     }
        //     //     return res.status(200).json(responsePayload);
        //     // }
        // }
        




        // let designerData = await insertData(team,project,hours,date,designer_name);
        // if(designerData){
        //     const responsePayload = {
        //         status : 1,
        //         message : "The designer task has been added",
        //         data : designerData,
        //         error : null,
        //     }
        //     return res.status(200).json(responsePayload);
        // }
        // else{
        //     const responsePayload = {
        //         status : 0,
        //         message : null,
        //         data : null,
        //         error : "Sorry the designer task cant be added",
        //     }
        //     return res.status(200).json(responsePayload);
        // }         
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

module.exports = {
    addDesigner,
    listAllDesignerTask,
    updateDesignerTask,
    getDesignerTaskByID
}