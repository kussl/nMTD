let admin = require("firebase-admin");
let keys = require("./Keys")
let serviceAccount = require(keys.serviceAccount);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: keys.databaseURL
});

// returns firebase instance
module.exports.database = admin.database()
// sends notification to client
module.exports.messaging = (notification,payload)=>{
    try {
        admin.messaging().sendToDevice(notification,payload,{priority:'high',contentAvailable:true}).then((response)=>{
            console.log("success"+response)
        }).catch((response)=>{
            console.log("failed"+response)
        })
    } catch (error) {
        
    }
}