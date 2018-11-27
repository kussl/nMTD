let db = require("./Query").database
let keys = require("./Keys")
let slavesInfo = db.ref(keys.slavesInfo);
let highScoreSlavesInfo = db.ref(keys.highScoreSlavesInfo)
let analytics = require('./analytics')
let data = require('../data')
let aws = require('../aws/AWS')
let CW = new aws.CloudWatch()
let instance = require('../aws/Instances')
let slavesClient = require('./slavesClients')
let newClients = require('./newClients')

slavesInfo.on("child_added", (snapshot) => {
    list = snapshot.val()
    list.clients = 0
    let slaves = data.getslaves(0)
    slaves.push(list)
    if (data.getnumberOfSlaves(0) < data.getslaves(0).length) {
        data.setnumberOfSlaves(0, data.getslaves(0).length)
    }
    analytics.analytics()
})

slavesInfo.on("child_removed", (snapshot) => {
    let slaves = data.getslaves(0)
    for (let i in slaves) {
        if (slaves[i].ID == snapshot.val().ID) {
            slaves.splice(i, 1)
        }
    }
    data.setnumberOfSlaves(0, data.getnumberOfSlaves(0) - 1)
    analytics.analytics()
})
highScoreSlavesInfo.on("child_added", (snapshot) => {
    list = snapshot.val()
    list.clients = 0
    let slaves = data.getslaves(1)
    slaves.push(list)
    if (data.getnumberOfSlaves(1) < data.getslaves(1).length) {
        data.setnumberOfSlaves(1, data.getslaves(1).length)
    }
    analytics.analytics()
})

highScoreSlavesInfo.on("child_removed", (snapshot) => {
    let slaves = data.getslaves(1)
    for (let i in slaves) {
        if (slaves[i].ID == snapshot.val().ID) {
            slaves.splice(i, 1)
        }
    }
    data.setnumberOfSlaves(1, data.getnumberOfSlaves(1) - 1)
    analytics.analytics()
})

let getCPUUtil = (instanceID, index, collection, fn) => {
    let s = new Date()
    let e = new Date()
    s.setMinutes(s.getMinutes() - 10)
    var params = {
        MetricName: 'CPUUtilization',
        Statistics: [
            'Average',
            'Maximum'
        ],
        Namespace: 'AWS/EC2',
        StartTime: s.toISOString(),
        EndTime: e.toISOString(),
        Period: 10,
        Dimensions: [{
            Name: 'InstanceId',
            Value: instanceID /* required */
        }],
        Unit: 'Percent'
    };
    CW.getMetricStatistics(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            try {
                collection.child(index).update({
                    CPUAverage: data.Datapoints[0].Average,
                    timestamp: data.Datapoints[0].Timestamp,
                    CPUMaximum: data.Datapoints[0].Maximum
                })
                fn(data.Datapoints[0].Average)
            } catch (err) {
                fn(null)
            }

        } // successful response
    });
}

let updateCPUUtil = (collection) => {
    collection.once('value', (snapshot) => {
        for (let i in snapshot.val()) {
            getCPUUtil(snapshot.val()[i].ID, i, collection, (util) => {
                if (util != null) {
                    if (snapshot.val()[i].CPUMaximum !=null && snapshot.val()[i].CPUMaximum > 99 ) {
                        slavesClient.getClients(snapshot.val()[i].ID, (clients) => {
                            newClients.newClients(clients)
                            slavesClient.deleteSlavesClients(snapshot.val()[i].ID)
                        })
                        db.ref("Server").set({
                            time:(new Date()).toString()
                        })
                        collection.child(i).remove()
                        instance.terminateInstance(snapshot.val()[i].ID, snapshot.val()[i].SecurityGroup)
                    }
                }
            })
        }
    })
}

setInterval(() => {
    updateCPUUtil(slavesInfo)
    updateCPUUtil(highScoreSlavesInfo)
}, 1000 * 3)