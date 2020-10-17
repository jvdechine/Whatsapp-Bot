const axios = require('axios');

async function isACompany(){
    let config = {
        headers: {
          Cookie: "robot=Um9ib3Q=",
        }
    }
    try{
        const response = await axios.get(process.env.API_HOST + 'company/5edbff63172c8552d8ee0fbd', config);
        if(response.status == 200){
            return true;
        }else{
            return false;
        }
    }catch (error) {
        return false;
    }
}

exports.isACompany = isACompany;