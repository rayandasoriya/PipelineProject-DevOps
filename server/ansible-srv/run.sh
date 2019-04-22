echo "Setting up Localhost"
sudo ansible-playbook setUpLocal.yml --vault-id password.txt
cd ~/AWS/
echo "Deploying AWS instance"
sudo node aws.js
sleep 10
cd /ansible-srv/
echo "Testing ping"
sudo ansible all -m ping -i inventory
echo "Running playbook.yml"
sleep 10
sudo ansible-playbook -i inventory playbook.yml --vault-id password.txt
