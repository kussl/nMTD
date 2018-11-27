var AWS = require('./AWS');
let Keys = require('./Keys')

// Create EC2 service object
var ec2 = new AWS.EC2({
    apiVersion: '2016-11-15'
});


// opens a port in security group
module.exports.openPort = (GroupName, port, fn) => {
    ec2.authorizeSecurityGroupIngress({
        GroupName: GroupName,
        IpPermissions: [{
            'IpProtocol': 'TCP',
            'FromPort': port,
            'ToPort': port,
            'IpRanges': [{
                'CidrIp': '0.0.0.0/0'
            }]
        }]
    }, () => {
        fn()
    })
}
//closes a port in security group
module.exports.closePort = (GroupName, port, fn) => {
    ec2.revokeSecurityGroupIngress({
        GroupName: GroupName,
        IpPermissions: [{
            'IpProtocol': 'TCP',
            'FromPort': port,
            'ToPort': port,
            'IpRanges': [{
                'CidrIp': '0.0.0.0/0'
            }]
        }]
    }, () => {
        fn()
    })
}
