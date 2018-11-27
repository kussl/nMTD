// creates and terminates instances
let AWS = require('./AWS');
let Keys = require('./Keys')
let uniqid = require('uniqid')
let ec2 = new AWS.EC2({
    apiVersion: '2016-11-15'
});



module.exports.createInstance = (fn) => {
    let id = uniqid()
    ec2.createSecurityGroup({
        Description: id,
        GroupName: id
    }, (err, groupid) => {
        if (err) {
            console.log(err)
        } else {
            ec2.describeKeyPairs(function (err, data) {
                if (err) {
                    console.log("Error", err);
                } else {
                    let instanceParams = {
                        ImageId: Keys.ImageId,
                        InstanceType: Keys.InstanceType,
                        KeyName: data.KeyPairs[0].KeyName,
                        MinCount: 1,
                        MaxCount: 1,
                        SecurityGroupIds: [
                            groupid.GroupId
                        ],
                    };
                    fn(id)
                    let instancePromise = new AWS.EC2({
                        apiVersion: '2016-11-15'
                    }).runInstances(instanceParams).promise();
                }
            });

        }
    })

}

module.exports.terminateInstance = (id,securitygroup) => {
    let params = {
        InstanceIds: [
            id
        ],
        DryRun: false
    };
    ec2.terminateInstances(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            setTimeout(()=>{
                var params = {
                    GroupName: securitygroup
                 };
                 // Delete the security group
                 ec2.deleteSecurityGroup(params, function(err, data) {
                    if (err) {
                       console.log("Error", err);
                    } else {
                       console.log("Security Group Deleted");
                    }
                 });
            },1000*60)
        }// successful response
    });
}
