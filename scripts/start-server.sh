sudo baker status
sudo baker destroy
cd ../server/ansible-srv
sudo baker bake
echo "Preliminary Ansible server is setup"
cd ../jenkins-srv/
sudo baker destroy
sudo baker bake
echo "Preliminary Jenkins server is setup"
sudo baker status
ssh-keygen -t rsa -b 4096 -C "web-srv" -f web-srv
echo "Created a public and private key with name web-srv in server/jenkins-srv/"
