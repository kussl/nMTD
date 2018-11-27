// handles new clients that is registered
let db = require("./Query").database
let keys = require("./Keys")
let newClients = db.ref(keys.newClients)
let instances = require("../aws/Instances")
let analytics = require('./analytics')
let slavesClient = require('./slavesClients')
let newSlaves = db.ref(keys.newSlaves)
let slavesInfo = db.ref(keys.slavesInfo)
let highScoreSalvesInfo = db.ref(keys.highScoreSlavesInfo)
let data = require('../data')


let assignclient = (type, snapshot) => { 
    let flag = false
    let slaves = data.getslaves(type)
    slaves.sort((a, b) => {
        return a.clients - b.clients
    })
    for (i in slaves) {
        if (slaves[i].IMEI == null) {
            slaves[i].IMEI = []
        }
        if (slaves[i].PORTs == null) {
            slaves[i].PORTs = []
        }
        if (slaves[i].IMEI.indexOf(snapshot.val().IMEI) != -1) {
            snapshot.ref.parent.remove()
            return     
        }
    }
    for (index in slaves) {
        if (slaves[index].clients < data.clientToSlave) {
            data.settotalClients(type, data.gettotalClients(type) + 1)
            slaves[index].clients += 1
            slaves[index].IMEI.push(snapshot.val().IMEI)
            snapshot.ref.parent.remove()
            slavesClient.assign(slaves[index].ID, snapshot.val().IMEI, snapshot.val().notificationToken, index, type)
            flag = true
            // if client doesnt go in here  means there is no slot for client, what should happen is , add it to a list that should loop every 10 or 15 second and assign it to slave.
            break
        }
    }
    if (data.gettotalClients(type) >= (data.getnumberOfSlaves(type) * data.clientToSlave) / 2 && data.getnumberOfSlaves(type) < data.slavesLimit) {
        data.setnumberOfSlaves(type, data.getnumberOfSlaves(type) + 1)
        instances.createInstance((param) => { 
            newSlaves.push({
                SecurityGroup: param,
                type: type
            })
        })
        // after this finishes the new client should be added there is couple of ways to do this,
    }
    if (flag == false) {
        data.queue.push(snapshot)
    }
    analytics.analytics()
}


module.exports.newClients = (clients) => {
    for (let i in clients) {
        let key = Object.keys(clients[i])[0]
        if (clients[i][key].score > 50) {
            newClients.child(key).update({
                highScore: true,
                IMEI: clients[i][key].IMEI,
                notificationToken: clients[i][key].notificationToken
            })
        } else if (clients[i][key].score <= 50) {
            newClients.child(key).update({
                IMEI: clients[i][key].IMEI,
                notificationToken: clients[i][key].notificationToken
            })
        }
    }
}

//before any assignclient check blocked list

setTimeout(() => {
    newClients.on("child_added", (snapshot) => {
        if (data.blocklist.indexOf(snapshot.val().IMEI) == -1) {
            if (snapshot.val().highScore != null) {
                assignclient(1, snapshot)
            } else {
                assignclient(0, snapshot)
            }
        } else {
            snapshot.ref.remove()
            //remove it
        }

    })

    slavesInfo.on("child_added", (snapshot) => {
        // create a list when adding new client, check this client to add to
        if (snapshot.val != null) {
            data.queue.forEach((item, index) => {
                if (data.blocklist.indexOf(item.val().IMEI)==-1) {
                    if (item.val().highScore == null) {
                        assignclient(0, item)
                        data.queue.splice(index, 1)
                    }
                } else {
                    item.ref.remove()
                    data.queue.splice(index,1)
                    //remove it
                }
            })
        }
    })

    highScoreSalvesInfo.on("child_added", (snapshot) => {
        if (snapshot.val != null) {
            data.queue.forEach((item, index) => {
                if (data.blocklist.indexOf(item.val.IMEI)==-1) {
                    if (item.val().highScore != null) {
                        assignclient(1, item)
                        data.queue.splice(index, 1)
                    }
                }else{
                    item.ref.remove()
                    data.queue.splice(index,1)
                    //remove it
                }
            })
        }
    })
}, 1000 * 3);
