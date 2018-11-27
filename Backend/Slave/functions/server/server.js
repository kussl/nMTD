// use net library to create webserver

// slave should send unique id to the clients, clients should send this id with every request, server should check this id to send response else block request
const express = require('express')
const bodyParser = require('body-parser')
let db = require('../Firebase/Query').database
let keys = require('../Firebase/Keys')
let settings = db.ref(keys.settings)
let newClients = db.ref(keys.newClients)
class server {
    constructor(IP, ID, PORT, snapshot, slavesClients, type) {
        this.type = type
        this.IP = IP
        this.ID = ID
        this.PORT = PORT
        this.numberOfRequests = 0
        this.score = 0
        this.snapshot = snapshot
        this.status = false
        let app = express()
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
            extended: true
        }));
        app.set("this", this)
        let s = app.listen(this.PORT)
        app.post('/', function (req, res) {
            app.settings.this.numberOfRequests += 1
            if(req.body.token != null){
                if (req.body.token != app.settings.this.snapshot.key) {
                    res.send("error")
                    return           
                }      
            }else{
                res.send("error")
                return
            }

            res.send('Your Score' + app.settings.this.score)
        })
        app.get('/',function(req,res){
            res.send("Use POST request")
        })
        slavesClients.child(this.snapshot.key).update({
            score: this.score
        })

        setInterval(() => {
            
            if (this.status == true) {
                return
            }
            if(this.numberOfRequests == 0){
                this.score -= 10
            }
            if (this.numberOfRequests <= 5) {
                this.score -=5
            } else if (this.numberOfRequests > 5 && this.numberOfRequests <= 10) {
                this.score += 1
            } else if (this.numberOfRequests > 10 && this.numberOfRequests <= 20) {
                this.score += 5
            } else if (this.numberOfRequests > 20 && this.numberOfRequests <= 30) {
                this.score += 10 // change to 10
            } else if (this.numberOfRequests > 30 && this.numberOfRequests <= 40) {
                this.score += 30
            } else if (this.numberOfRequests > 40 && this.numberOfRequests <= 50) {
                this.score += 50
            }
            this.numberOfRequests = 0
            if (this.score > 100) {
                s.close(()=>{})
                
                this.status = true
                if (type == 0) {

                    this.snapshot.ref.remove() 
                    newClients.child(this.snapshot.key).update({
                        IMEI: this.snapshot.key,
                        notificationToken: this.snapshot.val().notificationToken,
                        highScore: true
                    })

                }
                if (type == 1) {
                    this.snapshot.ref.remove() 
                    settings.once('value', (snapshot) => {
                        if(snapshot.val()!= null){
                            if(snapshot.val().Blocklist == null){
                                let blocklist = []
                                blocklist.push(this.snapshot.key)
                                settings.child('Blocklist').update({
                                    list: blocklist
                                })
                            }else if(snapshot.val().Blocklist != null){
                                let blocklist = snapshot.val().Blocklist
                                blocklist.push(this.snapshot.key)
                                settings.child('Blocklist').update({
                                    list: blocklist
                                })
                            }
                        }
                    })
                    
                }
                this.score = 100
                return
            } else if (this.score < 0) {
                this.score = 0
            }
            this.snapshot.ref.update({
                score:this.score
            })
        }, 1000 * 5)
    }
}
module.exports = server
