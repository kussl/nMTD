//Handles all Clients that are connected to a slave
let msg = require('./Query').messaging
let keys = require('./Keys')
let db = require('./Query').database
let Security = require("../aws/securitygroup")
let server = require('../server/server')

module.exports = (ID,IP,Group,type)=>{
    let slavesClients = db.ref(keys.slavesClients + "/" + ID)
    slavesClients.on("child_added", (snapshot) => { // on here get ip and port ,
        Security.openPort(Group, snapshot.val().PORT,
            () => {
                let s = new server(IP,ID,snapshot.val().PORT,snapshot,slavesClients,type)
                let notificationtoken = snapshot.val().notificationToken
                msg(notificationtoken, {
                    data: {
                        IP: IP,
                        PORT: "" + snapshot.val().PORT
                    }
                })
            })
    })
}