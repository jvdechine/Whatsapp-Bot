const axios = require('axios');
const toDecimal = require('../functions/decimalReplace');
async function getAttendanceLevelMessage(sessionId, token, level, message, userAttendanceId){
    config = {
        headers: {
          Authorization: "Bearer " + token,
        }
    }
    try{
        const messageApi = await axios.get(process.env.API_HOST + 'levelMessage?companyId=' + sessionId + '&attendanceLevel=' + level + '&receivedMessage=' + encodeURIComponent(message) + "&userAttendanceId=" + userAttendanceId, config);
        if(messageApi.status == 200 || messageApi.status == 201){
            var apiReturn = [];
            messageApi.data.data.forEach(level => {
                apiReturn.push(
                    {
                        attendanceLevel: level,
                        message: level.message,
                        nextLevel: level.nextLevel,
                        token: token,
                        isProduct: false
                    }
                );
            })
            if(messageApi.data.products != null && messageApi.data.products != undefined){
                messageApi.data.products.forEach(element => {
                    apiReturn.push(
                        {
                            attendanceLevel: level,
                            message: "*Código do Produto:* " + element.productNumber + "\n*Nome:* " + element.name + "\n*Preço:* " + toDecimal.changeDecimalMoney(element.price) + "\n*Detalhes:* " + element.description,
                            nextLevel: messageApi.data.data[0].nextLevel,
                            token: token,
                            productImage: element.productImage,
                            isProduct: true
                        }
                    );
                });
            }
            return apiReturn;
        }
    }catch(error){
        return [];
    }
}

async function changeAttendanceLevel(token, body){
    config = {
        headers: {
          Authorization: "Bearer " + token,
        }
    }
    try{
        const messageApi = await axios.patch(process.env.API_HOST + 'userAttendance', body, config);
        if(messageApi.status == 200 || messageApi.status == 201){
            return true;
        }else{
            return false;
        }
    }catch(error){
        return false;
    }
}
exports.getAttendanceLevelMessage = getAttendanceLevelMessage;
exports.changeAttendanceLevel = changeAttendanceLevel;