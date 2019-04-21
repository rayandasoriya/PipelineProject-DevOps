var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
var fs = require('fs')
    path = require('path')
    child_process = require('child_process')
    http = require('http')
    ;
var ec2 = new AWS.EC2();

stringVal = "DevOps-pro"
inventoryString = "[web]\n"
var keypair = {
KeyName: stringVal
}

var vpc = null
var securityGroupIDValue = null
var DescriptionSecurityGroup = "TestSecurityGroup"
var GroupNameSecurityGroup = "DevOpsSecurityGroup"
// Retrieve the ID of a VPC
ec2.describeVpcs(function(err, data) {
   if (err) {
     console.log("Cannot retrieve a VPC", err);
   } else {
     vpc = data.Vpcs[0].VpcId;
     var paramsSecurityGroup = {
        Description: DescriptionSecurityGroup,
        GroupName: GroupNameSecurityGroup,
        VpcId: vpc
     };
     // Create the instance
     ec2.createSecurityGroup(paramsSecurityGroup, function(err, data) {
        if (err) {
           console.log("Error", err);
        } else {
           var SecurityGroupId = data.GroupId;
           console.log("Success", SecurityGroupId);
           securityGroupIDValue = SecurityGroupId;
           var paramsIngress = {
             GroupName: GroupNameSecurityGroup,
             IpPermissions:[
                {
                   IpProtocol: "tcp",
                   FromPort: 80,
                   ToPort: 80,
                   IpRanges: [{"CidrIp":"0.0.0.0/0"}]
               },
               {
                   IpProtocol: "tcp",
                   FromPort: 22,
                   ToPort: 22,
                   IpRanges: [{"CidrIp":"0.0.0.0/0"}]
               },

               {
                   IpProtocol: "tcp",
                   FromPort: 8080,
                   ToPort: 8080,
                   IpRanges: [{"CidrIp":"0.0.0.0/0"}]
                },
               {
                   IpProtocol: "tcp",
                   FromPort: 9999,
                   ToPort: 9999,
                   IpRanges: [{"CidrIp":"0.0.0.0/0"}]
                },
               {
                   IpProtocol: "-1",
                   FromPort: 0,
                   ToPort: 65535,
                   IpRanges: [{"CidrIp":"0.0.0.0/0"}]
                }

             ]
           };
           ec2.authorizeSecurityGroupIngress(paramsIngress, function(err, data) {
             if (err) {
               console.log("Error", err);
             } else {
               console.log("Ingress Successfully Set", data);
               console.log('Newly Created Security Group is:', securityGroupIDValue);
             }
          });
        }
     });
   }
});

var params = {
    
    ImageId: "ami-0565af6e282977273", //Ubuntu 16.04
    InstanceType: "t2.medium",  
    MaxCount: 1, 
    MinCount: 1,
    KeyName: stringVal,
     SecurityGroupIds: [
        securityGroupIDValue
     ],  
    TagSpecifications: [
       {
      ResourceType: "instance", 
      Tags: [
         {
        Key: "devops", 
        Value: "test"
       }
      ]
     }
    ]
   };
function createInstance() {
  ec2.runInstances(params, function(err, data) {
   
     if (err) console.log(err, err.stack); 
        console.log("Instance created with Instance ID: ",data.Instances[0].InstanceId);   
        var paramsPassed = {
            InstanceIds: [
                data.Instances[0].InstanceId
            ]
        };
        setTimeout(function() {
        ec2.describeInstances(paramsPassed, function(err, data) {
            if (err) console.log(err, err.stack);
            else     {
               console.log("Use the following command to test connectivity \nping ",data.Reservations[0].Instances[0].PublicIpAddress);
               inventoryString+=data.Reservations[0].Instances[0].PublicDnsName + ` ansible_ssh_user=ubuntu ansible_ssh_private_key_file=~/AWS/${stringVal}.pem\n`
               inventoryString+="[web:vars]\n"
               inventoryString+="ansible_python_interpreter=/usr/bin/python3"
               inventoryFile = "inventory";
               console.log("*************************\n"+inventoryString);
                    fs.writeFile(inventoryFile, inventoryString, function(err) {
               if (err) {
                  console.log(err);
                  
                  }
                var ipAddress = data.Reservations[0].Instances[0].PublicDnsName + ':9999/job/Configure-Itrust/build'
                var ipAddress2 = data.Reservations[0].Instances[0].PublicDnsName + ':9999/job/Configure-Checkbox/build'
                var itrustGithub = "https://api.github.com/repos/jubeenshah/iTrust/hooks"
                var checkboxGithub = "https://api.github.com/repos/jubeenshah/checkbox.io/hooks"
                //curl -u $USERNAME:$PASSWORD -v -H "Content-Type: application/json" -X POST -d '{"name": "web", "active": true, "events": ["push"], "config": {"url": "http://$EXAMPLE", "content_type": "json"}}' https://api.github.com/repos/jubeenshah/checkboxdocker/hooks

                var username = process.env.USERNAME
                var password = process.env.PASSWORD
                var command = ''
		var command2 = ''
                command += ' -u ' + username + ':' + password
		command2 = command
                //console.log(command);
                command += '  -H "Content-Type: application/json" -X POST -d \'{"name": "web", "active": true, "events": ["push"], "config": {"url": "http://admin:admin@' + ipAddress + '", "content_type": "json"}}\''
                //console.log(command);
		command2 += '  -H "Content-Type: application/json" -X POST -d \'{"name": "web", "active": true, "events": ["push"], "config": {"url": "http://admin:admin@' + ipAddress2 + '", "content_type": "json"}}\''
                child_process.exec(`curl ${command} ${itrustGithub}`);
                child_process.exec(`curl ${command2} ${checkboxGithub}`); 
               child_process.exec(`cp ${inventoryFile} /ansible-srv/`);
            });
            }
          });
        }, 20000);
     
   });
}


function createNewKeyPair() {
ec2.createKeyPair(keypair, function(err, data) {
   if (err) {
      //console.log("Error: ", err.code);
      if (err.code = 'InvalidKeyPair.Duplicate') {
         console.log("Duplicate key detected")
         ec2.deleteKeyPair(keypair, function(err, data) {
            if (err) {
               console.log("Error", err);
            } else {
               
               console.log("Existing Key Pair Deleted");
               nameOfFile = stringVal+".pem";
               child_process.exec(`sudo rm ${nameOfFile}`);
               createNewKeyPair()
            }
         });
      }
      
   } else {
      //console.log(JSON.stringify(data));
      //data = JSON.stringify(data);
      //myJSON = JSON.stringify(data.KeyMaterial);
   nameOfFile = stringVal+".pem";
   //child_process.exec(`sudo rm ${nameOfFile}`);
        fs.writeFile(nameOfFile, data.KeyMaterial, function(err) {
    if (err) {
        console.log(err);
      
                }
        child_process.exec(`sudo chmod 600 ${nameOfFile}`);
});
      //console.log(data.KeyMaterial)
      console.log("New Key Pair Generated");
   }
});
}

// ec2.describeKeyPairs(function(err, data) {
//    if (err) {
//       console.log("Error: ", err.code);

//    } else {
//       //console.log(JSON.stringify(data));
//       //data = JSON.parse(data);
//       console.log(data.KeyPairs[0].KeyFingerprint);
//      }
// });





createNewKeyPair()
sleep(2000).then(() => {
   createInstance();
})
   

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
 }

 //sudo docker tag checkbox jubeenshah/checkbox:latest
 //sudo docker push jubeenshah/checkbox:latest
