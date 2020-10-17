const user = require('../api/user');
const axios = require('axios');
const attendanceLevel = require('./attendanceLevel');

async function getMessage(sessionId, message){
    //Ask to the API for the user
    /*if(message["sender"].id.split("@")[0] != "551633292993" && message["sender"].id.split("@")[0] != "5516994607964" && message["sender"].id.split("@")[0] != "5516988368134"){
        return [];
    }*/
    const sender = await user.returnUserJson(sessionId, ((message["sender"].pushname == undefined || message["sender"].pushname == null || message["sender"].pushname == '') ? message["sender"].verifiedName : message["sender"].pushname), "", "", message["sender"].id.split("@")[0], "");
    let config = {
        
    }
    try{
        const response = await axios.post(process.env.API_HOST + 'user/robot', sender, config);
        if(response.status == 200){
            config = {
                headers: {
                  Authorization: "Bearer " + response.data.data[0].token,
                }
            }
            try{
                const responseAttendance = await axios.post(process.env.API_HOST + 'userAttendance/robot', {userId: response.data.data[0]._id, companyId: sessionId}, config);
                if(responseAttendance.status == 200 || responseAttendance.status == 201){
                    const userAttendanceId = responseAttendance.data.data[0]._id;
                    const messageApi = await attendanceLevel.getAttendanceLevelMessage(sessionId, response.data.data[0].token, responseAttendance.data.data[0].attendanceLevel, message.body, userAttendanceId);
                    messageApi.userAttendanceId = userAttendanceId;
                    return messageApi;
                }
            }catch(error){
                return [];
            }
        }else{
            return [];
        }
    }catch (error) {
        return [];
    }
};

async function changeAttendance(sessionId, message, id, nextLevel){
    const sender = user.returnUserJson(sessionId, message["sender"].pushname, "", "", message["sender"].id.split("@")[0], "");
    let config = {
        headers: {
          Cookie: "robot=Um9ib3Q=",
        }
    }
    try{
        const response = await axios.post(process.env.API_HOST + 'user/robot', sender, config);
        if(response.status == 200){
            let config = {
                headers: {
                  Cookie: "robot=Um9ib3Q=",
                }
            }
            try{
                const body = {
                    _id: id,
                    attendanceLevel: nextLevel,
                    inAttendance: true
                }
                body.attendanceLevel = nextLevel;
                const changed = await attendanceLevel.changeAttendanceLevel(response.data.data[0].token, body);
            }
            catch (error) {
                return [];
            }
        }
    }
    catch(error){
        return [];
    }
}

async function getPendingMessage(sessionId){
    let config = {
        
    }
    try{
        const response = await axios.get(process.env.API_HOST + 'pendingMessage/robot/' + sessionId, config);
        if(response.status == 200){
            return response.data.data;
        }
    }
    catch (error) {
        return [];
    }
}

exports.getMessage = getMessage;
exports.changeAttendance = changeAttendance;
exports.getPendingMessage = getPendingMessage;