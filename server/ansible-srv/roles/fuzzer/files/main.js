var fs = require('fs')
    path = require('path')
    child_process = require('child_process')
    http = require('http')
    ;
var numberOfChanges =0;
var m = 4294967296,
    a = 1664525,
    c = 1013904223;
var z =  process.argv.slice(2);; //seed

//var pathToTraverse = '/Users/jubeenshah/Desktop/NCSU/SEM-2/CSC519-Devops/Project/test-itrust/iTrust2-v4-master/iTrust/iTrust2/src/main/';
var pathToTraverse = '/home/vagrant/iTrust/iTrust2/src/main/';

function changeMade() {
    numberOfChanges = numberOfChanges + 1;
    
}


function rand() {
  z = (a * z + c) % m;
  return z / m;
};


function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach( f => {
      let dirPath = path.join(dir, f);
      let isDirectory = fs.statSync(dirPath).isDirectory();
      isDirectory ? 
        walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
  };
  
  function ExecuteFuzzing(pathToTraverse) {
  var numberOfFile = 0;
  walkDir(pathToTraverse, function(filePath) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    if (filePath.split('.').pop() == "java") {
        numberOfFile = numberOfFile + 1;
            ////console.log(filePath);
            fuzzTheFile(filePath)
    }
  });
  console.log(numberOfChanges)
}

function fuzzTheFile(pathToFile) {

    ////console.log(pathToFile);
    
    //Synchronous reading of file --> fs.readFileSync(path[, options])
    line = fs.readFileSync(pathToFile, 'utf8').split("\n");
    ////console.log(line);
    //Synchronous writing of file --> fs.writeFileSync(file, data[, options])
    //fs.writeFileSync(pathToFile, "/****Edited Version****/\n");
    fs.writeFileSync(pathToFile, "");

    ////console.log(Math.random());
    line.forEach(eachLine=> {
        ////console.log(rand());
        random = rand();
        if (random < 0.50) {
        if (!eachLine.match(/@/) && !eachLine.match(/\*/) && !eachLine.match(/\/\//)) {
        random = rand();
        //console.log(random)
        if (random > 0.75 ) {
            if ((eachLine.match(/\s+>\s+/)         || 
                 eachLine.match(/\s+>=\s+/))       && 
                    (eachLine.match(/\s+if\s+/)    || 
                     eachLine.match(/\s+while\s+/) ||
                     eachLine.match(/\s+for\s+/))) 
                    // || 
                    // eachLine.match(/\s+for\s+/) ))
		 {         
                ////console.log(random)
                console.log("old ->"+eachLine);
                eachLine = eachLine.replace(">","<");
                console.log("new ->"+eachLine);
                console.log("path ->"+pathToFile);
                changeMade()
            }
        } 
        random = rand();
        if (random < 0.25 ) {
            if ((eachLine.match(/\s+<\s+/)        || 
                 eachLine.match(/\s+<=\s+/))      && 
                    (eachLine.match(/\s+if\s+/)    || 
                     eachLine.match(/\s+while\s+/) ||
                     eachLine.match(/\s+for\s+/))) 
                     //|| 
                    //eachLine.match(/\s+for\s+/)) ) 
		{
                console.log("old ->"+eachLine);
                eachLine = eachLine.replace("<",">");
                console.log("new -> "+eachLine);
                console.log("path -> " +pathToFile);
                changeMade()
            }
        } 
        
/*        //random = rand();
        if (random > 0.80) {
            if (eachLine.match(/\s+==\s+/)        && 
                    (eachLine.match(/\s+if\s+/)    || 
                     eachLine.match(/\s+while\s+/) ||
                     eachLine.match(/\s+for\s+/)))
		 {         
                ////console.log(random)
                console.log("old ->"+eachLine);
                eachLine = eachLine.replace("==","!=");
                console.log("new ->"+eachLine);
                console.log("path ->"+pathToFile);
                changeMade()
            }
        } if (random < 0.20 ) {
            if (eachLine.match(/\s+!=\s+/)        && 
                    (eachLine.match(/\s+if\s+/)    || 
                     eachLine.match(/\s+while\s+/) ||
                     eachLine.match(/\s+for\s+/)))
		 {         
                ////console.log(random)
                console.log("old ->"+eachLine);
                eachLine = eachLine.replace("!=","==");
                console.log("new ->"+eachLine);
                console.log("path ->"+pathToFile);
                changeMade()
            }
        } 
        
*/      
        random = rand();
        if (random > 0.75 ) {
            if (eachLine.match(/\s+0\s+/)        && 
                   (eachLine.match(/\s+if\s+/)    || 
                     eachLine.match(/\s+while\s+/) ||
                     eachLine.match(/\s+for\s+/))) 
		{
                console.log("old ->"+eachLine);
                eachLine = eachLine.replace("0","1");
                console.log("new ->"+eachLine);
                console.log("path ->"+pathToFile);
                changeMade()
            }
        } 

        if(random > 0.965 && !eachLine.match(/\\/) && eachLine.match(/"([^"]*)"/)) {
            console.log("old->"+eachLine );
            eachLine = eachLine.replace(/"([^"]*)"/, `\"CSC519-Devops_String\"`);
            console.log("new->"+eachLine);
            console.log("path ->"+pathToFile);
            changeMade()
        }

        random = rand();
        if (random < 0.25 ) {
            if (eachLine.match(/\s+1\s+/)         && 
                   (eachLine.match(/\s+if\s+/)    || 
                     eachLine.match(/\s+while\s+/) ||
                     eachLine.match(/\s+for\s+/))) 
{
                console.log("old ->"+eachLine);
                eachLine = eachLine.replace("1","0");
                console.log("new ->"+eachLine);
                console.log("path ->"+pathToFile);
                changeMade()
            }
        } 
        random = rand();
/*  
        if (random > 0.75 ) {
            if (eachLine.match(/||/)              && 
                   (eachLine.match(/\s+if\s+/)    || 
                    eachLine.match(/\s+while\s+/) || 
                    eachLine.match(/\s+for\s+/)) ) {

                eachLine = eachLine.replace("||","&&");
                console.log(eachLine);
                changeMade()
            }
        } if (random < 0.25 ) {
            if (eachLine.match(/&&/)              &&  
                   (eachLine.match(/\s+if\s+/)    || 
                    eachLine.match(/\s+while\s+/) || 
                    eachLine.match(/\s+for\s+/)) ) {

                eachLine = eachLine.replace("&&","||");
                    //console.log(eachLine);
                    console.log(eachLine);
                    changeMade()
            }
        } 
*/
    }
        
        eachLine += '\n'
        fs.appendFileSync(pathToFile, eachLine, {encoding:'utf8'});
    
    
} else {
    eachLine += '\n'
        fs.appendFileSync(pathToFile, eachLine, {encoding:'utf8'});
}
    })
    
}


function executeCommit() {
    child_process.execSync('sudo git commit -am "Commit Number : Testing" && sudo git push -f pushtest');
}

function executeRevert() {
    child_process.execSync('sudo git reset --hard origin/master');
}

ExecuteFuzzing(pathToTraverse)
getStaus();
function getStaus() {
    var str = '';
callback = function(response) {

    response.on('data', function (chunk) {
        str += chunk;
    });
    
    response.on('end', function (returnValue) {
        //console.log(req.data);
        //console.log("Here it starts"+str);
        if (str.match(/{"_class":/)) {
            //console.log("I am INNNNN");
        buildStatus = (JSON.parse(str).building);
        if(buildStatus) {
            console.log("Build Executing... Retrying in 30 Seconds");
            console.log(buildStatus)
            sleep(30000).then(() => {
                getStaus();
              })
        } else {
            console.log("Ready for next build... Triggering Build in 10 Seconds");
            sleep(10000).then(() => {
                executeCommit();
                //executeRevert()
		console.log("Sleeping before revert");
		sleep(30000).then(() => {
                executeRevert();      
            })
              })
	   // sleep(10000).then(() => {
	 	//executeRevert();	
	   // })
              
         }
    } else {
        console.log("Oops...");
        console.log("Ready for next build... Triggering Build in 10 Seconds");
            sleep(10000).then(() => {
               	executeCommit();
                //executeRevert()
		console.log("Sleeping before revert");
		sleep(30000).then(() => {
                executeRevert();      
            })
        })
    }
    });


    }
http.request('http://192.168.33.100:9999/job/iTrust2/lastBuild/api/json', callback).end();

}



const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
