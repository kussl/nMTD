let db = require("./Query").database
let keys = require("./Keys")
let slavesClients = db.ref(keys.slavesClients)
let slavesInfo = db.ref(keys.slavesInfo)
let highScoreSlavesInfo = db.ref(keys.highScoreSlavesInfo)
let data = require("../data")

getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports.assign = (id, IMEI, notificationToken, index, type) => {
    let port = 1024 + getRandomInt(40000)
    let slaves = data.getslaves(type)
    while (slaves[index].PORTs.indexOf(port) != -1) {
        port = 1024 + getRandomInt(40000)
    }
    slaves[index].PORTs.push(port)
    slavesClients.child("/" + id + "/" + IMEI).update({
        notificationToken: notificationToken,
        PORT: port
    })
    if (type == 0) {
        slavesInfo.once("value", (snapshot) => {
            for (i in snapshot.val()) {
                if (snapshot.val()[i].ID == id) {
                    if (snapshot.val()[i].clients) {
                        slavesInfo.child(i).update({
                            ID: snapshot.val()[i].ID,
                            IP: snapshot.val()[i].IP,
                            clients: snapshot.val()[i].clients + 1,
                            PORTS: data.getslaves(type)[index].PORTs
                        })
                    } else {
                        slavesInfo.child(i).update({
                            ID: snapshot.val()[i].ID,
                            IP: snapshot.val()[i].IP,
                            clients: 1,
                            PORTS: data.getslaves(type)[index].PORTs
                        })
                    }
                }
            }
        })
    }else if(type==1){
        highScoreSlavesInfo.once("value", (snapshot) => {
            for (i in snapshot.val()) {
                if (snapshot.val()[i].ID == id) {
                    if (snapshot.val()[i].clients) {
                        highScoreSlavesInfo.child(i).update({
                            ID: snapshot.val()[i].ID,
                            IP: snapshot.val()[i].IP,
                            clients: snapshot.val()[i].clients + 1,
                            PORTS: data.getslaves(type)[index].PORTs
                        })
                    } else {
                        highScoreSlavesInfo.child(i).update({
                            ID: snapshot.val()[i].ID,
                            IP: snapshot.val()[i].IP,
                            clients: 1,
                            PORTS: data.getslaves(type)[index].PORTs
                        })
                    }
                }
            }
        })
    }
}

module.exports.getClients = (id, fn) => { // use this
    slavesClients.child(id).once('value', (snapshot) => {
        let records = []
        for (let i in snapshot.val()) {
            let tmp = {}
            tmp[i] = {}
            tmp[i]['notificationToken'] = snapshot.val()[i].notificationToken
            tmp[i]['IMEI'] = i
            tmp[i]['score'] = 0
            records.push(tmp)
        }
        fn(records)
    })
}

module.exports.deleteSlavesClients = (id) => { // use this
    slavesClients.child(id).remove()
}

module.exports.deleteClient = (id, client) => {
    slavesClients.child(id).child(client).remove()
}