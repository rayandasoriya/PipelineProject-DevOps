sudo ansible-playbook setUpLocal.yml --vault-id password.txt
sleep 5
sudo ansible all -m ping -i inventory
sleep 5
sudo ansible-playbook -i inventory playbook.yml --vault-id password.txt
