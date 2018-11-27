// update firebase with the current stats of the controller
let db = require("./Query").database
let keys = require("./Keys")
let analytics = db.ref(keys.analytics)
let data = require('../data')

module.exports.analytics = ()=>{
    analytics.child("Available").update({
        slot: data.getnumberOfSlaves(0) * data.clientToSlave - data.gettotalClients(0)
      })
      analytics.child("MaxAvailabe").update({
        slot: data.slavesLimit * data.clientToSlave
      })
      analytics.child("TotalClients").update({
        clients: data.gettotalClients(0)
      })
      analytics.child("TotalSlaves").update({
        slaves: data.getnumberOfSlaves(0)
      })
      analytics.child("TotalHighScoreSlaves").update({
        slaves: data.getnumberOfSlaves(1)
      })

      analytics.child("ForNewSlave").update({
        slots: (data.getnumberOfSlaves(0) * data.clientToSlave) / 2 - data.gettotalClients(0)
      })
      analytics.child("ForNewHighScoreSlave").update({
        slots: (data.getnumberOfSlaves(1) * data.clientToSlave) / 2 - data.gettotalClients(1)
      })
      analytics.child('HighScoreClients').update({
        clients:data.gettotalClients(1)
      })
      analytics.child('BlockList').update({
        list:data.blocklist
      })
     
}