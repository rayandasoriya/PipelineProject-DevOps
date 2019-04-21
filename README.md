# CSC519-Project

## Milestone 3 - Deployment

![](./resources/01-NCSU-Logo.png)
| [MILESTONE 1](https://github.ncsu.edu/jnshah2/CSC519-Project/tree/Milestone1) | [MILESTONE 2](https://github.ncsu.edu/jnshah2/CSC519-Project/tree/Milestone2) | [MILESTONE 3](https://github.ncsu.edu/jnshah2/CSC519-Project/tree/Milestone3) |

# Content
1. [Our Team](#our-team)
2. [About the Milestone](#about-the-milestone)
3. [Pre-requisites](#prerequisites)
4. [Setup Instructions](#setup-instructions)
	1. [Cloning](#cloning)
	2. [Build and Deployment](#build-and-deployment)
	3. [Infrastructure Upgrade](#infrastructure-upgrade)
	4. [Monitoring Analysis](#monitoring-analysis-something-special-fire)
5. [Report](#report)
6. [Screencast](#screencast)
7. [References](#references)

## Our Team

* Arshdeep Singh Syal ([asyal](mailto:asyal@ncsu.edu))
	* Responsible for implementing the monitoring analysis
* Jubeen Shah ([jnshah2](mailto:jnshah2@ncsu.edu))
	* Responsible for AWS deployment and infrastructure upgrade using Kubernetes and docker + Grafana integration
* Rayan Dasoriya([rdasori](mailto:rdasori@ncsu.edu))
	* Responsible for the feature flags feature using Redis client
* Shraddha Bhadauria([sbhadau](mailto:sbhadau@ncsu.edu))
	* Responsible for implementing the monitoring analysis

## About the milestone

In this milestone, we have extended our work done in [Milestone 2](https://github.ncsu.edu/jnshah2/CSC519-Project/tree/Milestone2) demonstrated techniques related to deployment and monitoring of Checkbox.io and iTrust. We've used Ansible, for spawning AWS instances; Jenkins, for deployment into the production environment; [Kubernetes](https://kubernetes.io/), for making the infrastructure redundant and tolerant to node failures; [Prometheus](https://prometheus.io) and [Grafana](https://grafana.com), for monitoring and analysis.

## Prerequisites
To run this project, you will require the following tools:
1. [Virtualbox](https://www.virtualbox.org/) 
2. [Baker](https://getbaker.io/)
3. [AWS Account](https://aws.amazon.com)

## Setup Instructions

### Cloning

Clone this repository.

```
git clone --branch Milestone3 https://github.ncsu.edu/jnshah2/CSC519-Project.git
```

### Build and Deployment

Go to the CSC519-Project directory `cd CSC519-Project`. To begin with the setup, and run the `run.sh` script by `sh run.sh`. This will automate the following tasks.

* Run `ansible-playbook setUpLocal.yml`
	* This `play` is responsible for instantiating an AWS EC2 Instance which would host the `Jenkins` server and create an `inventory` file for ansible.
	* We have used `ansible-vault` to encrypt the `variables.yml` file for security purposes.
* Run a test `ping` command to ensure that the server can be reached
* Run another `play`, using `ansible-playbook -i inventory playbook.yml`
	* This is responsible for setting up the `Jenkins` server with the required dependecies to enable deployment of [iTrust](https://github.ncsu.edu/engr-csc326-staff/iTrust2-v4) and [Checkbox.io](https://github.com/chrisparnin/checkbox.io) in the production environment.
	* This would also setup [Github Webhooks](https://developer.github.com/webhooks/) to allow us to build the Jenkins Jobs whenever a push is triggered to the repository.
    
In this project, we have used the following ports for different services:

|Service|Port|
|------|--------|
|Checkbox.io| :80 (default)|
|iTrust   | :8080/iTrust2|
|Jenkins | :9999|
|Tomcat  | :8080|
|Grafana |:3000|

#### Old roles from Milestone 2

The roles in red are not used in this milestone, since they were releated to development part of the pipeline. 

```diff
- Build- Running the build job for Checkbox.io and iTrust
- Checkbox - Cloning and configuring the checkbox.io
+ Chrome - Installing headless chrome for iTrust
- Githooks- For creating the post-receive hook on the jenkins server
+ Install-Modules - Installing the prerequisite modules
+ iTrust - Cloning the iTrust Repo
+ Jenkins- Installing and configuring Jenkins
+ JJB]- Jenkins Job Builder
+ Maven- Installing and configuring Maven
- Mongodb- Installing and configuring MongoDB
+ MySQL - Installing and configuring MySQL
- Nginx- Installing and configuring Nginx web server
+ Node - Installing Node.js
- Fuzzer - Used for fuzzing the iTrust code
- Checkbox-Analysis - Used for analyzing the Checkbox.io code
- iTrust-Analysis - Used for analyzing the fuzzed iTrust Code
```
#### New roles for Milestone 3

```diff
+ AWS - Used for setup of the AWS instances
+ Ansible - Used for setup of ansible on the remote server
+ Configure-Jenkins - Used for copying necessary files to the remote server
+ iTrust-Deploy - Used for deploying the iTrust war file on the remote server
+ Kubernetes - Used to setup Kubernetes cluster to host checkbox.io and also setup monitoring and analysis
+ MySQL-Dump - Used for creating a dump of the MySQL database to deploy on the remote server
+ Redis - Used to setup a redis client on the remote server
+ Tomcat - Used to setup Tomcat server to host the iTrust Application.
```
The setup of the Jenkins server should take about 10 minutes to execute. You can then trigger a build event by pushing to `iTrust` repo to initiate the deployment of iTrust, and to `Checkbox.io` repo to initiate the deployment of Checkbox.io cluster with Docker and Kubernetes.

### Infrastructure Upgrade

For this part of the milestone, we used Docker along with Kubernetes to deploy the Checkbox.io service on `three` nodes to make it resistant to node failures. We seperated the rendering for markdown into a seperate microservice, the repo to which can be found [here](https://github.com/jubeenshah/checkbox.io/tree/infra-upgrade).  

We then used [AWS Kops](https://aws.amazon.com/blogs/compute/kubernetes-clusters-aws-kops/) to manage the Kubernetes Cluster.

### Monitoring Analysis... Something special :fire:

In the special component of the milestone we used prometheus to monitor the AWS cluster. The configuration files can be found [here](./roles/kubernetes/files). To setup the prometheus along with Grafana there are a few things that you need to setup. The instructions to which can be found in the kubernetes role page [here](./roles/kubernetes/README.md). We integrated [`Prometheus`](https://prometheus.io) with [`Grafana`](https://grafana.com) to create dashboards that can be seen below. 

![Dashboard for Kubernetes Cluster](./resources/Dashboard-1.png)

![Dashboard for Kubernetes Node](./resources/Dashboard-4.png)

You can also look at all the dashboards [here](./roles/kubernetes/README.md#dashboards).

## Report



## Screencast

The screencast for Milestone 3 is available [here]().

## References

[[1] https://github.com/CSC-DevOps/Course/blob/master/Project/CM.md](https://github.com/CSC-DevOps/Course/blob/master/Project/CM.md "https://github.com/CSC-DevOps/Course/blob/master/Project/CM.md")

[[2] https://jenkins.io/doc/book/getting-started/installing/](https://jenkins.io/doc/book/getting-started/installing/ "https://jenkins.io/doc/book/getting-started/installing/")

[[3] http://docs.ansible.com](http://docs.ansible.com "http://docs.ansible.com")

[[4] https://eksworkshop.com/monitoring/](https://eksworkshop.com/monitoring/)

[[5] https://grafana.com/dashboards/315](https://grafana.com/dashboards/315)

[[6] https://blog.kubernauts.io/cloud-native-monitoring-with-prometheus-and-grafana-9c8003ab9c7 ](https://blog.kubernauts.io/cloud-native-monitoring-with-prometheus-and-grafana-9c8003ab9c7)

[[7] https://medium.com/devopslinks/setup-prometheus-grafana-monitoring-on-kubernetes-cluster-9be4d80a45b1](https://medium.com/devopslinks/setup-prometheus-grafana-monitoring-on-kubernetes-cluster-9be4d80a45b1)

[[8] https://sysdig.com/blog/kubernetes-monitoring-with-prometheus-alertmanager-grafana-pushgateway-part-2/](https://sysdig.com/blog/kubernetes-monitoring-with-prometheus-alertmanager-grafana-pushgateway-part-2/)
