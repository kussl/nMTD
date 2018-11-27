// registers slave on firebase, so controller can assign clients to slaves.
let keys = require('./Keys')
let db = require('./Query').database
let slavesInfo = db.ref(keys.slavesInfo);
let highScoreSlavesInfo = db.ref(keys.highScoreSlavesInfo)
let slavesClientclass = require('./SlavesClients')


module.exports = (ID,IP,Group,type)=>{
    slavesClientclass(ID,IP,Group,type)
    if(type == 0){
        slavesInfo.once("value", (snapshot) => {
            let s = snapshot.val()
            for (let i in s) {
                if (s[i].ID == ID) {
                    return
                }
            }
            slavesInfo.push({
                ID: ID,
                IP: IP,
                SecurityGroup:Group
            })
        })
    }else if (type == 1){
        highScoreSlavesInfo.once("value", (snapshot) => {
            let s = snapshot.val()
            for (let i in s) {
                if (s[i].ID == ID) {
                    return
                }
            }
            highScoreSlavesInfo.push({
                ID: ID,
                IP: IP,
                SecurityGroup:Group
            })
        })
    }
}