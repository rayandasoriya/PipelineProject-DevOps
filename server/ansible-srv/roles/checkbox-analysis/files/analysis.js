var esprima = require("esprima");
var fs = require('fs')
    path = require('path')
    child_process = require('child_process')
    http = require('http')
    ;
		var hash = require('object-hash');
var options = {tokens:true, tolerant: true, loc: true, range: true };
var fs = require("fs");

// var pathToTraverse = [
// 									"/Users/jubeenshah/Desktop/NCSU/SEM-2/CSC519-Devops/Project/Master/screencast/arsh_shraddha-m2/checkbox.io/public_html",
// 									"/Users/jubeenshah/Desktop/NCSU/SEM-2/CSC519-Devops/Project/Master/screencast/arsh_shraddha-m2/checkbox.io/server-side/site/routes",
// 								];

var pathToTraverse = [
									"/home/vagrant/checkbox.io/public_html",
									"/home/vagrant//checkbox.io/server-side/site/routes"
]

function walkDir(dir, callback) {
	fs.readdirSync(dir).forEach( f => {
		let dirPath = path.join(dir, f);
		let isDirectory = fs.statSync(dirPath).isDirectory();
		isDirectory ? 
			walkDir(dirPath, callback) : callback(path.join(dir, f));
	});
};

function ExecuteAnalysis(pathToTraverse) {
var numberOfFile = 0;
walkDir(pathToTraverse, function(filePath) {
	const fileContents = fs.readFileSync(filePath, 'utf8');
	if (filePath.split('.').pop() == "js") {
			numberOfFile = numberOfFile + 1;
			//if (numberOfFile <= 2) {
			//console.log("File being analyzed--> "+filePath)
			beautifyJS(filePath);
			complexity(filePath);

				//Generate Report
			for( var node in builders )
			{
				var builder = builders[node];
				builder.report();
			}
		//}
		
		}
});

}

const beautifyJS = (pathToFile) => {
	//console.log(pathToFile);
	child_process.execSync(`js-beautify -r ${pathToFile}`);
}
testObject = {
	"LongMethod": {},
	"CyclomaticComplexity" : {},
	"MaxNestingDepth" : {},
	"MaxIfConditions" : {},
	"Parameters" : {}
};
var builders = {};
// Represent a reusable "class" following the Builder pattern.
function FunctionBuilder()
{
	this.StartLine = 0;
	this.Endline = 0;
	this.loc = 0;
	this.LongMethod = false;
	this.FunctionName = "";
	// The number of parameters for functions
	this.ParameterCount = 0,

	// Number of if statements/loops + 1
	this.SimpleCyclomaticComplexity = 0;

	// The max depth of scopes (nested ifs)
	this.MaxNestingDepth = 0;

	// The max number of conditions if one decision statement.
	this.MaxIfConditions = 0;

	this.report = function()
	{
		if(this.MaxNestingDepth > 15) {
			testObject.MaxNestingDepth[this.FunctionName] = this.MaxNestingDepth
		} /*else {
			testObject.MaxNestingDepth[this.FunctionName] = [false, this.MaxNestingDepth]
		}*/

		if(this.Loc > 100)
			{
				testObject.LongMethod[this.FunctionName] = this.Loc
			} /*else {
				testObject.LongMethod[this.FunctionName] = [false, this.Loc]
			}*/

		if (this.MaxIfConditions > 15) {
			testObject.MaxIfConditions[this.FunctionName] = this.MaxIfConditions
		} /*else {
			testObject.MaxIfConditions[this.FunctionName] = [false, this.MaxIfConditions]
		}*/

		if(this.SimpleCyclomaticComplexity > 15) {

			testObject.CyclomaticComplexity[this.FunctionName] = this.SimpleCyclomaticComplexity

		} /*else {

			testObject.CyclomaticComplexity[this.FunctionName] = [false, this.SimpleCyclomaticComplexity]
		}*/

		if (this.ParameterCount > 10) {
			testObject.Parameters[functionName(node)] = this.ParameterCount
		} /*else { 
			testObject.Parameters[functionName(node)] = [false, this.ParameterCount]
		}*/

		console.log(
		   (
		   	"{0}(): \n" +
				"============\n" +
				"LongMethod: {1}\t" +
			  "SimpleCyclomaticComplexity: {2}\t" +
				"MaxNestingDepth: {3}\t" +
				"MaxIfConditions: {4}\t" +
				"Parameters: {5}\n\n"
			)
			.format(this.FunctionName, this.LongMethod, this.SimpleCyclomaticComplexity, 
			this.MaxNestingDepth, this.MaxIfConditions, this.ParameterCount)
		);
		
		
	}
};



// A builder for storing file level information.
function FileBuilder()
{
	this.FileName = "";
	// Number of strings in a file.
	
	this.Strings = 0;
	// Number of imports in a file.
	this.ImportCount = 0;

	this.report = function()
	{
		console.log (
			( "{0}\n" +
			  "~~~~~~~~~~~~\n"+
			  "ImportCount {1}\t" +
			  "Strings {2}\n"
			).format( this.FileName, this.ImportCount, this.Strings ));
	}
}

// A function following the Visitor pattern.
// Annotates nodes with parent objects.
function traverseWithParents(object, visitor)
{
    var key, child;

    visitor.call(null, object);

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
            	child.parent = object;
					traverseWithParents(child, visitor);
            }
        }
    }
}

function complexity(filePath)
{
	var buf = fs.readFileSync(filePath, "utf8");//resd into filr
	var ast = esprima.parse(buf, options);//pass into ast

	var i = 0;

	// A file level-builder:
	var fileBuilder = new FileBuilder();
	fileBuilder.FileName = filePath;
	fileBuilder.ImportCount = 0;
	builders[filePath] = fileBuilder;

	// Tranverse program with a function visitor.
	traverseWithParents(ast, function (node) 
	{
		if (node.type === 'FunctionDeclaration') 
		{
			
			
			//console.log(hash(node.body["body"]));
			var builder = new FunctionBuilder();
			var currentLevel = 0;
			builder.FunctionName = functionName(node);
			builder.StartLine    = node.loc.start.line;
			builder.EndLine    = node.loc.end.line;
			calculateNestedIf(node, currentLevel, builder);
			
			builder.Loc	= (builder.EndLine - builder.StartLine) +1;
			if(builder.Loc > 100)
			{
				builder.LongMethod=true;
			} 
		
			builder.ParameterCount = node.params.length;
			
		
			traverseWithParents(node, function(loopcount) 
			{
				
				if(isIfDecision(loopcount)) 
				{
					currentCount = 0;
					builder.SimpleCyclomaticComplexity+=1;
					traverseWithParents(loopcount, function(conditionCount) 
					{	
						if (conditionCount.type == "BinaryExpression" || conditionCount.type == "LogicalExpression" )
						{
							currentCount++;
							if (currentCount > builder.MaxIfConditions) 
							{
								builder.MaxIfConditions = currentCount;
							}
						}
						if(builder.MaxIfConditions==0)
						{
							builder.MaxIfConditions=1;
						}
					});
				}
			});
			builders[builder.FunctionName] = builder;
			//builder.EndLine    = node.loc.end.line;
		}

		if(node.type == "Identifier" && node.name == "require") 
		{
			fileBuilder.ImportCount++;
		}

		if(node.type=="Literal" && typeof(node.value)=='string')
		{
			fileBuilder.Strings++;
		}
	});
}

function calculateNestedIf(node, currentLevel, builderPassed) {
	var key, child;
	var children = 0;
	for (key in node) {
		if (node.hasOwnProperty(key)) {
				child = node[key];
				if (typeof child === 'object' && child !== null && key != 'parent') {
					children++;
					if( key == "alternate"){
						calculateNestedIf(child,currentLevel,builderPassed)
					} else if( child.type == 'IfStatement'){
							calculateNestedIf(child, currentLevel+1, builderPassed);
					}	else {
							calculateNestedIf(child, currentLevel, builderPassed);
				}
			}
		}
	}
  if( children == 0 ) {
    if( builderPassed.MaxNestingDepth < currentLevel ) {
			builderPassed.MaxNestingDepth = currentLevel;
    }
	}
}

// Helper function for counting children of node.
function childrenLength(node)
{
	var key, child;
	var count = 0;
	for (key in node) 
	{
		if (node.hasOwnProperty(key)) 
		{
			child = node[key];
			if (typeof child === 'object' && child !== null && key != 'parent') 
			{
				count++;
			}
		}
	}	
	return count;
}

// Helper function for checking if a node is a "decision type node"
function isDecision(node)
{
	if( node.type == 'IfStatement' || node.type == 'ForStatement' || node.type == 'WhileStatement' ||
		 node.type == 'ForInStatement' || node.type == 'DoWhileStatement')
	{
		return true;
	}
	return false;
}

// Helper function for checking if a node is a "if condition"
function isIfDecision(node)
{
	if( node.type == 'IfStatement')
	{
		return true;
	}
	return false;
}

// Helper function for printing out function name.
function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	//return "anon function @"+ node.loc.start.line;
}

// Helper function for allowing parameterized formatting of strings.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function Crazy (argument) 
{
	var date_bits = element.value.match(/^(\d{4})\-(\d{1,2})\-(\d{1,2})$/);
	var new_date = null;
	if(date_bits && date_bits.length == 4 && parseInt(date_bits[2]) > 0 && parseInt(date_bits[3]) > 0)
  	new_date = new Date(parseInt(date_bits[1]), parseInt(date_bits[2]) - 1, parseInt(date_bits[3]));

	var secs = bytes / 3500;

	if ( secs < 59 )
	{
		return secs.toString().split(".")[0] + " seconds";
	}
	
	else if ( secs > 59 && secs < 3600 )
	{
		var mints = secs / 60;
		var remainder = parseInt(secs.toString().split(".")[0]) - (parseInt(mints.toString().split(".")[0]) * 60);
		var szmin;
		if ( mints > 1 )
		{
			szmin = "minutes";
		}
		else
		{
			szmin = "minute";
		}
		return mints.toString().split(".")[0] + " " + szmin + " " + remainder.toString() + " seconds";
	}
	
	else
	{
		var mints = secs / 60;
		var hours = mints / 60;
		var remainders = parseInt(secs.toString().split(".")[0]) - (parseInt(mints.toString().split(".")[0]) * 60);
		var remainderm = parseInt(mints.toString().split(".")[0]) - (parseInt(hours.toString().split(".")[0]) * 60);
		var szmin;
				
		if ( remainderm > 1 )
		{
			szmin = "minutes";
		}
		else
		{
			szmin = "minute";
		}

		var szhr;
		
		if ( remainderm > 1 )
		{
			szhr = "hours";
		}
		else
		{
			szhr = "hour";
			for ( i = 0 ; i < cfield.value.length ; i++)
			{
				var n = cfield.value.substr(i,1);
				if ( n != 'a' && n != 'b' && n != 'c' && n != 'd'
				&& n != 'e' && n != 'f' && n != 'g' && n != 'h'
				&& n != 'i' && n != 'j' && n != 'k' && n != 'l'
				&& n != 'm' && n != 'n' && n != 'o' && n != 'p'
				&& n != 'q' && n != 'r' && n != 's' && n != 't'
				&& n != 'u' && n != 'v' && n != 'w' && n != 'x'
				&& n != 'y' && n != 'z'
				&& n != 'A' && n != 'B' && n != 'C' && n != 'D'
				&& n != 'E' && n != 'F' && n != 'G' && n != 'H'
				&& n != 'I' && n != 'J' && n != 'K' && n != 'L'
				&& n != 'M' && n != 'N' &&  n != 'O' && n != 'P'
				&& n != 'Q' && n != 'R' && n != 'S' && n != 'T'
				&& n != 'U' && n != 'V' && n != 'W' && n != 'X'
				&& n != 'Y' && n != 'Z'
				&& n != '0' && n != '1' && n != '2' && n != '3'
				&& n != '4' && n != '5' && n != '6' && n != '7'
				&& n != '8' && n != '9'
				&& n != '_' && n != '@' && n != '-' && n != '.' )
				{
					window.alert("Only Alphanumeric are allowed.\nPlease re-enter the value.");
					cfield.value = '';
					cfield.focus();
				}
					cfield.value =  cfield.value.toUpperCase();
			}
			return;
    }
    return hours.toString().split(".")[0] + " " + szhr + " " + mints.toString().split(".")[0] + " " + szmin;
  }
}

function exportJSON() {
	// console.log("====================Duplicated Code Detection====================");
	// child_process.exec("jsinspect -t 45 -I ../checkbox.io > hello.txt", function(error, stdout, stderr) {
	// 	// command output is in stdout
	// 	console.log(stdout);
	// });
	//console.log(testObject)
	myJSON = JSON.stringify(testObject);
	//console.log(myJSON);
	nameOfFile = "analysis-report.json"
	fs.writeFile(nameOfFile, myJSON, function(err) {
    if (err) {
        console.log(err);
		}
		
});
	child_process.exec(`js-beautify -r ${nameOfFile}`);

}

var i;
for(i =0; i < pathToTraverse.length; i ++ ){
	ExecuteAnalysis(pathToTraverse[i]);
}
exportJSON();
var exec= require('child_process').exec, child; 
	function stop () {
		child = exec("mocha",
				function (error, stdout, stderr) {
					 console.log('stdout: ' + stdout);
					 //console.log('stderr: ' + stderr);
						if (error !== null) {
								 console.log('exec error: ' + error);
						}
				});

		}
		


stop();
