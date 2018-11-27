// get settings from firebase 
let db = require("./Query").database
let keys = require("./Keys")
let Settings = db.ref(keys.settings)
let data = require('../data')
let analytics = require('./analytics')

Settings.on("value", (snapshot) => {
  if (snapshot.val() != null) {
    if(snapshot.val().Slaves != null){
      data.slavesLimit = snapshot.val().Slaves
    }
    if(snapshot.val().clientToSlave != null ){
      data.clientToSlave = snapshot.val().clientToSlave
    }
    if(snapshot.val().Blocklist != null){
      data.blocklist = snapshot.val().Blocklist.list
    }
  } else {
    Settings.update({
      Slaves: data.slavesLimit,
      clientToSlave: data.clientToSlave,
      blocklist: []
    })
  }
  analytics.analytics()
})