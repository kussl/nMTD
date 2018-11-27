//settingup AWS instance for other classes to use directly
let AWS = require('aws-sdk');
let Keys = require('./Keys')

AWS.config.update({
    "accessKeyId": Keys.Access_key_ID,
    "secretAccessKey": Keys.Secret_access_key,
    region: Keys.Region_name
});

module.exports = AWS