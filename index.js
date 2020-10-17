const wa = require('@open-wa/wa-automate');
const company = require('./api/company');
const main = require('./src/main.js');
import { ev } from '@open-wa/wa-automate';
const fs = require('fs');
var express = require('express');
var app = express();

wa.create({sessionId:'5edbff63172c8552d8ee0fbd'}).then(client => start(client, '5edbff63172c8552d8ee0fbd'));

async function start(client, sessionId) {
    client.onStateChanged(state=>{
        console.log('statechanged', state)
        if(state==="CONFLICT") client.forceRefocus();
    });
    if(company.isACompany(sessionId)){
        app.get(`/${sessionId}/sendPendingMessage`, async function (req, res) {
            const pendingMessage = await main.getPendingMessage(sessionId);
            if(pendingMessage.length > 0){
                pendingMessage.forEach(async message => {
                    await client.sendText(message.phone + '@c.us', message.message);
                });
            }
            res.status(200).json({
                status: 'successfull',
                message: ''
            })
        });
          
        app.listen(process.env.PORT, function () {
            console.log(`server running in port ${process.env.PORT}`)
        });
        // Comentado pois estava duplicando os clientes
        /*const unreadMessages = await client.getAllUnreadMessages();
        unreadMessages.forEach(async message => {
            const messageApi = await main.getMessage(sessionId, message);
            messageApi.forEach(async element => {
                if(element.isProduct){
                    await client.sendFile(message.from, element.productImage, 'some file.pdf', element.message);
                }else{
                    await main.changeAttendance(sessionId, message, messageApi.userAttendanceId, element.nextLevel);
                    await client.sendText(message.from, element.message);
                }
            });
        })*/
        client.onMessage(async message => {
            const messageApi = await main.getMessage(sessionId, message);
            messageApi.forEach(async element => {
                if(element.isProduct){
                    await client.sendFile(message.from, element.productImage, 'some file.pdf', element.message);
                }else{
                    await main.changeAttendance(sessionId, message, messageApi.userAttendanceId, element.nextLevel);
                    await client.sendText(message.from, element.message);
                }
            });
        });
    }else{
        client.kill();
    }
}

/*ev.on('qr.**', async (qrcode,sessionId) => {
    //Send the qrcode to the api, for client auth.

    // console.log("TCL: qrcode,sessioId", qrcode,sessionId)
    //base64 encoded qr code image
    const imageBuffer = Buffer.from(qrcode.replace('data:image/png;base64,',''), 'base64');
    fs.writeFileSync(`qr_code${sessionId?'_'+sessionId:''}.png`, imageBuffer);
});*/
