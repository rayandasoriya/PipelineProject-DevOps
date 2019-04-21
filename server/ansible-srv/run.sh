sudo ansible-playbook setUpLocal.yml --vault-id password.txt
cd ~/AWS/
node aws.js
sleep 10
cd /ansible-srv/
sudo ansible all -m ping -i inventory
sleep 10
sudo ansible-playbook -i inventory playbook.yml --vault-id password.txt
