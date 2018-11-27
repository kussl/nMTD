let slaves = []
let totalClients = 0
let numberOfSlaves = 0
let highScoreSlaves = []
let highScoreClients = 0
let numberOfHighScoreSlaves = 0

module.exports.getslaves = (type)=>{
    if(type == 0){
        return slaves
    }else if(type == 1){
        return highScoreSlaves
    }
}
module.exports.gettotalClients = (type)=>{
    if(type == 0){
        return totalClients
    }else if(type == 1){
        return highScoreClients
    }
}
module.exports.getnumberOfSlaves = (type)=>{
    if(type == 0){
        return numberOfSlaves
    }else if(type == 1){
        return numberOfHighScoreSlaves
    }
}
module.exports.settotalClients = (type,number)=>{
    if(type == 0){
        totalClients=number
    }else if(type == 1){
        highScoreClients=number
    }
}
module.exports.setnumberOfSlaves = (type,number)=>{
    if(type == 0){
        numberOfSlaves=number
    }else if(type == 1){
        numberOfHighScoreSlaves=number
    }
}
module.exports.blocklist = []
module.exports.slavesLimit = 10
module.exports.clientToSlave = 20
module.exports.queue = []
