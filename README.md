# CSC519-Project

![](./resources/01-NCSU-Logo.png)
| [MILESTONE 1](https://github.ncsu.edu/jnshah2/CSC519-Project/tree/Milestone1) | [MILESTONE 2](https://github.ncsu.edu/jnshah2/CSC519-Project/tree/Milestone2) | [MILESTONE 3](https://github.ncsu.edu/jnshah2/CSC519-Project/tree/Milestone3) |

# Content
1. [Our Team](#our-team)
2. [About the Milestones](#about-the-milestones)
	1. [Milestone 1](https://github.ncsu.edu/jnshah2/CSC519-Project/tree/Milestone1)
	2. [Milestone 2](https://github.ncsu.edu/jnshah2/CSC519-Project/tree/Milestone2)
	3. [Milestone 3](https://github.ncsu.edu/jnshah2/CSC519-Project/tree/Milestone3)
3. [References](#references)

## Our Team

* Arshdeep Singh Syal ([asyal](mailto:asyal@ncsu.edu))
* Jubeen Shah ([jnshah2](mailto:jnshah2@ncsu.edu))
* Rayan Dasoriya([rdasori](mailto:rdasori@ncsu.edu))
* Shraddha Bhadauria([sbhadau](mailto:sbhadau@ncsu.edu))

## About the milestones

Continuous Delivery (CD) is a software strategy that enables organizations to deliver new features to users as fast and efficiently as possible. The goal of Continuous Delivery is to enable a constant flow of changes into production via an automated software production line. A typical CD pipeline will include the following stages: configuration management and build automation; test automation; and deployment automation.

### [Milestone 1](https://github.ncsu.edu/jnshah2/CSC519-Project/tree/Milestone1)

In this milestone, we have demonstrated the build automation and configuration management using Ansible. We have:

* Provisioned a configuration server ([Ansible](https://www.ansible.com)) and a [Jenkins](https://jenkins.io) server on remote virtual machine instances.
* Configured the Jenkins server, automatically using Ansible.
* Used a [jenkins-job-builder](https://docs.openstack.org/infra/jenkins-job-builder/) and Ansible, to automatically setup build jobs for two applications:
	* A Nodejs web application [`checkbox.io`](https://github.com/chrisparnin/checkbox.io)
	* An "enterprise" Java system [`iTrust`](https://github.ncsu.edu/engr-csc326-staff/iTrust2-v4/tree/master/iTrust2)
* Used a combination of [mocha](https://www.npmjs.com/package/mocha)/[pm2](https://www.npmjs.com/package/pm2), to create a test script that will start and stop the `checkbox.io` service on the server.
* Created a git hook to trigger a build when a push is made to the repo.

### [Milestone 2](https://github.ncsu.edu/jnshah2/CSC519-Project/tree/Milestone2)

In this milestone, we have demonstrated the test and analysis using Ansible. We have:

* Developed a tool that automatically commits random changes to source code which will trigger a build and run of the test suite.
* Created a corresponding jenkins job which enables you to run the test suite against this branch and handle rollback
* Using your automated commit fuzzer, generated 100 random commits (that still compile) and test runs
* Generate a report that displays the test cases in sorted order, based on time to execute and number of failed tests
* For the iTrust build job, extended to build job to support running an existing static analysis tool on the source code, process its results, and report its findings and fail the build minimum testing criteria and analysis criteria.
* For checkbox.io, extend the build job to support the custom metrics and fail the build if any of these metrics exceed a given threshold.

### [Milestone 3](https://github.ncsu.edu/jnshah2/CSC519-Project/tree/Milestone3)

In this milestone, we have demonstrated the deployment and monitoring analysis using Ansible. We have:

* Deploy the applications on AWS using the git trigger hooks
* Configured redis client to turn off some features using feature flags
* Extracted a microservice and deployed sereral instances using Kuberneets
* Implemented the monitoring analysis of the project as a special componenet

## References

[[1] https://github.com/CSC-DevOps/Course/blob/master/Project/CM.md](https://github.com/CSC-DevOps/Course/blob/master/Project/CM.md "https://github.com/CSC-DevOps/Course/blob/master/Project/CM.md")

[[2] https://jenkins.io/doc/book/getting-started/installing/](https://jenkins.io/doc/book/getting-started/installing/ "https://jenkins.io/doc/book/getting-started/installing/")

[[3] http://docs.ansible.com](http://docs.ansible.com "http://docs.ansible.com")<br/>
