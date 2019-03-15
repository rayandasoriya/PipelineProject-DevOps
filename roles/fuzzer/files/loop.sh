#node main.js $seed_val_set
HOME_DIR=/home/vagrant/
mkdir $HOME_DIR/BuildResults
for i in `seq 1 1`;
        do
		export seed_val=$i
                sudo node main.js $i
		echo Current Seed_val=$seed_val
 	#	cd $HOME_DIR/BuildResults/
                if [ ! -d "$HOME_DIR/BuildResults/$i" ]; then
 		   mkdir $HOME_DIR/BuildResults/$i
                fi
                sleep 15
                sudo cp -r /home/vagrant/iTrust/iTrust2/target/surefire-reports/ $HOME_DIR/BuildResults/$i
		
        done
