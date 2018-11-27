// Imports
require('./functions/Firebase/SlavesClients')
let AWS = require('aws-sdk');
let slaveclass = require('./functions/Firebase/SlavesInfo')
let meta = new AWS.MetadataService();
let db = require('./functions/Firebase/Query').database
let newSlaves = db.ref('newSlaves')

meta.request("/latest/meta-data/public-ipv4", (err, ip) => {
    meta.request("/latest/meta-data/security-groups", (err, group) => {
        meta.request("/latest/meta-data/instance-id", (err, id) => {
            newSlaves.once('value', (snapshot) => {
                if(snapshot.val() != null){
                    for (let i in snapshot.val()) {
                        if (snapshot.val()[i].SecurityGroup == group) {
                            slaveclass(id, ip, group,snapshot.val()[i].type)
                            snapshot.child(i).ref.remove()
                        }
                    }
                }
            })
        })
    })
});
