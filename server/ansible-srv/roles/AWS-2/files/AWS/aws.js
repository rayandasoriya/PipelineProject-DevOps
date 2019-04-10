var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
var fs = require('fs')
    path = require('path')
    child_process = require('child_process')
    http = require('http')
    ;
var ec2 = new AWS.EC2();

stringVal = "DevOps-pro-2"
inventoryString = "[web]\n"
var keypair = {
KeyName: stringVal
}
var params = {
    
    ImageId: "ami-0565af6e282977273", //Ubuntu 16.04
    InstanceType: "t2.medium",  
    MaxCount: 1, 
    MinCount: 1,
    KeyName: stringVal,
     SecurityGroupIds: [
        "sg-7d52bc0a"
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
               inventoryString+=data.Reservations[0].Instances[0].PublicDnsName + ` ansible_ssh_user=ubuntu ansible_ssh_private_key_file=/home/ubuntu/${stringVal}.pem\n`
               inventoryString+="[web:vars]\n"
               inventoryString+="ansible_python_interpreter=/usr/bin/python3"
               inventoryFile = "inventory";
               console.log("*************************\n"+inventoryString);
 	            fs.writeFile(inventoryFile, inventoryString, function(err) {
               if (err) {
                  console.log(err);
                  
                  }
               child_process.exec(`cp ${inventoryFile} /home/ubuntu`);
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
// 	}
// });





createNewKeyPair()
sleep(2000).then(() => {
   createInstance();
})
   

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
 }
