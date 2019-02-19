# CSC519-Project

## Configuration Management & Build Milestone

![](./resources/01-NCSU-Logo.png)
| [MILESTONE 1]() | [MILESTONE 2]() | [MILESTONE 3]() | [MILESTONE 4]() |

# Content
1. [Our Team](#our-team)
2. [About the Project](#about-the-project)
2. [Pre-requisites]()
3. [Two Easy steps]()
	1. [Cloning]()
	2. [Build and Deployment]()
4. [Screencast Link]()

## Our Team

* Arshdeep Singh Syal ([asyal](mailto:asyal@ncsu.edu))
* Jubeen Shah ([jnshah2](mailto:jnshah2@ncsu.edu))
* Rayan Dasoriya([rdasori](mailto:rdasori@ncsu.edu))
* Shraddha Bhadauria([sbhadau](mailto:sbhadau@ncsu.edu))

## About the project

Continuous Delivery (CD) is a software strategy that enables organizations to deliver new features to users as fast and efficiently as possible. The goal of Continuous Delivery is to enable a constant flow of changes into production via an automated software production line. A typical CD pipeline will include the following stages: configuration management and build automation; test automation; and deployment automation.

In this milestone, we have demonstrated the build automation and configuration management using Ansible. We have:

* Provisioned a configuration server ([Ansible](https://www.ansible.com)) and a [Jenkins](https://jenkins.io) server on remote virtual machine instances.
* Configured the jenkins server, automatically using ansible.
* Used a [jenkins-job-builder](https://docs.openstack.org/infra/jenkins-job-builder/) and ansible, to automatically setup build jobs for two applications:
	* A nodejs web application [`checkbox.io`](https://github.com/chrisparnin/checkbox.io)
	* An "enterprise" Java system [`iTrust`](https://github.ncsu.edu/engr-csc326-staff/iTrust2-v4/tree/master/iTrust2)
* Used a combination of [mocha](https://www.npmjs.com/package/mocha)/[pm2](https://www.npmjs.com/package/pm2), to create a test script that will start and stop the `checkbox.io` service on the server.
* Created a git hook to trigger a build when a push is made to the repo.

### Setup Instructions

Clone the repository using ```git clone https://github.ncsu.edu/jnshah2/CSC519-Project.git``` and go inside the CSC519-Project directory. To begin with the setup, we have created two local VMs using Baker.

    (i)  Configuration Server (Ansible Server)
    (ii) Jenkins Server
    
To start and stop the server, we can use `start-server.sh` and `stop-server.sh`respectively. The `start-server.sh` will create the two servers by running `baker bake` and will also generate a public-priavte key pair(web-srv) which will be used for setting up the conncetion between the configiuration server and the Jenkins server. The `stop-server.sh` will be used to destroy the servers using `baker destroy`.
 
After the successful configuration of the two servers, we will create an SSH connection between the two servers. We will copy the private key (web-srv) present in the jenkins-srv folder, do `baker ssh` and then paste it in a newly created web-srv (`vi .ssh/web-srv`) file inside the .ssh folder inside configuration server. Change the permission of the private key using the command:

```chmod 600 ~/.ssh/web-srv```

Now, copy the public key (web-srv.pub) present in the jenkins-srv folder, do `baker ssh` and paste it in the authorized_keys file inside the .ssh folder (`vi .ssh/authorized_keys`) in the jenkins server.

We have setup an ssh access from the configuration serevr to the jenkins server. To test this, run the following command from the configuration serevr:

```ssh -i ~/.ssh/web-srv vagrant@192.168.33.100```

<img width="1440" alt="screenshot 2019-02-17 at 7 21 16 pm" src="https://media.github.ncsu.edu/user/12952/files/35a0a500-32e9-11e9-840f-ed8035b887df">

Now, from the ansible-srv folder inside the configuration server, we run our site.yml file, ie. our ansible playbook to install and configure the jenkins server and it's dependencies on the jenkins server. We use the following command:

```ansible-playbook site.yml -i inventory```

<img width="1440" alt="screenshot 2019-02-17 at 9 54 28 pm" src="https://media.github.ncsu.edu/user/12952/files/b1591c80-32fe-11e9-8fff-49e3d7b07199">

<img width="1440" alt="screenshot 2019-02-17 at 9 56 29 pm" src="https://media.github.ncsu.edu/user/12952/files/e5ccd880-32fe-11e9-8c20-aff6df3f1028">

<img width="1440" alt="screenshot 2019-02-17 at 9 56 58 pm" src="https://media.github.ncsu.edu/user/12952/files/f715e500-32fe-11e9-9794-220fbfd80387">

<img width="1440" alt="screenshot 2019-02-17 at 9 57 19 pm" src="https://media.github.ncsu.edu/user/12952/files/02691080-32ff-11e9-9dc6-2b867b205290">

<img width="1440" alt="screenshot 2019-02-17 at 9 57 45 pm" src="https://media.github.ncsu.edu/user/12952/files/114fc300-32ff-11e9-9af0-8d6cf9bc9100">

<img width="1440" alt="screenshot 2019-02-17 at 9 58 04 pm" src="https://media.github.ncsu.edu/user/12952/files/1d3b8500-32ff-11e9-8066-2a1eafba430e">

<img width="1440" alt="screenshot 2019-02-17 at 9 58 19 pm" src="https://media.github.ncsu.edu/user/12952/files/24fb2980-32ff-11e9-9b99-5dee569ce61c">

Once the playbook has successfully completed running all the tasks, we can ssh into the jenkins server to check if the checkbox.io folder and the iTrust folder have been created. 

<img width="1440" alt="screenshot 2019-02-17 at 10 00 20 pm" src="https://media.github.ncsu.edu/user/12952/files/70153c80-32ff-11e9-84e5-59d735d35e4b">

We can also verify if the web application checkbox.io has been deployed, by opening the web browser at http://192.168.33.100

<img width="1440" alt="screenshot 2019-02-17 at 10 21 07 pm" src="https://media.github.ncsu.edu/user/12952/files/5e816400-3302-11e9-965f-aac1114b2a7a">

We can also verify if the jenkins server has been deployed, by opening the web browser at http://192.168.33.100:8080

<img width="1440" alt="screenshot 2019-02-17 at 10 29 31 pm" src="https://media.github.ncsu.edu/user/12952/files/95a44500-3303-11e9-8642-dd3e68a95e08">

<img width="1440" alt="screenshot 2019-02-17 at 10 27 33 pm" src="https://media.github.ncsu.edu/user/12952/files/3cd4ac80-3303-11e9-8a29-7745b2b7c8d1">

### Screencast

The screencast for Milestone 1 is available [here]().

### References

[[1] https://github.com/CSC-DevOps/Course/blob/master/Project/CM.md](https://github.com/CSC-DevOps/Course/blob/master/Project/CM.md "https://github.com/CSC-DevOps/Course/blob/master/Project/CM.md")

[[2] https://jenkins.io/doc/book/getting-started/installing/](https://jenkins.io/doc/book/getting-started/installing/ "https://jenkins.io/doc/book/getting-started/installing/")

[[3] http://docs.ansible.com](http://docs.ansible.com "http://docs.ansible.com")
