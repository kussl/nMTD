

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// {
//     token:{
//         notificationToken:""
//         id:""
//     }
// }
exports.registertoken = functions.https.onRequest((request, response) => {

    if (request.method !== "POST") {
        response.send("Error:Change request method to post.");
    }
    if (Object.keys(request.body).indexOf("token") === -1) {
        response.send("Error:Request doesnt include Data.")
    } else if (tokenValidation(request.body.token) === true) {
        tokenWriteData(request.body.token)
        response.send("OK")
    } else {
        response.send("Error:Data sent didnt pass validation.");
    }

});

// this function validate the Json sent from client
let tokenValidation = (data) => {
    let keys = Object.keys(data)
    if (keys.indexOf("notificationToken") === -1) {
        return false
    } else if (keys.indexOf("id") === -1) {
        return false
    }
    return true
}
// this function will write data in Firebase
let tokenWriteData = (data) => {
    let db = admin.database();
    let ref = db.ref("tokens");
    let childRef = ref.child(data.id)
    childRef.update({
        IMEI:data.id,
        notificationToken: data.notificationToken,
    })
}

// {
//     notification:{
//         notificationToken:""
//     }
// }
exports.registerNotification = functions.https.onRequest((request,response)=>{
    if (request.method !== "POST") {
        response.send("Error:Change request method to post.");
    }
    if (Object.keys(request.body).indexOf("notification") === -1) {
        response.send("Error:Request doesnt include Data.")
    } else if (notificationValidation(request.body.notification) === true) {
        notificationWriteData(request.body.notification)
        response.send("OK")
    } else {
        response.send("Error:Data sent didnt pass validation.");
    }
})

let notificationValidation = (data)=>{
    let keys = Object.keys(data)
    if (keys.indexOf("notificationToken") === -1) {
        return false
    }
    return true
}

let notificationWriteData = (data)=>{
    let db = admin.database();
    let ref = db.ref("newclients");
    let childRef = ref.child(data.id)
    childRef.update({
        IMEI:data.id,
        notificationToken: data.notificationToken,
    })
}


