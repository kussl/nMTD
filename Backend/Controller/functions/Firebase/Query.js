let admin = require("firebase-admin");
let keys = require("./Keys")
let serviceAccount = require(keys.serviceAccount);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: keys.databaseURL
});
//returns firebase database instance
module.exports.database = admin.database()