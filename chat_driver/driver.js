var request = require('request');
var moment = require('moment');
const readline = require('readline');
var myUserId;
var theirUserId = null;
var users = {};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// Begin by attempting to populate our local user store.
// This process would ideally run every time a change was made to the database.

populateUsers(getUserLogin);

function populateUsers(callback){
	request('http://localhost:3000/api/chatusers', function(error, response, body){
  	if(!error && response.statusCode == 200){
		JSON.parse(body).data.forEach(function(value) {
			users[value.id] = value.name;
		});
  	}else{
  		console.log("Error retrieving users " + error);
  	}
  		callback();
	})
}

function determineCommand(){
	console.log("Current user: " + users[myUserId]);
	console.log("\n1. Add User");
	console.log("2. Set Conversation Partner (for sending a message and viewing history)");
	console.log("3. Send Message");
	console.log("4. View History");
	console.log("5. Change Logged in User");
	rl.question("Please choose your action from the numbered list.\n", (answer) => {
		if(answer == 1){
			createUser();
			return;
		}
		if(answer == 2){
			setCounterpart();
			return;
		}
		if(answer == 3){
			sendMessage();
			return;
		}
		if(answer == 4){
			viewHistory();
			return;
		}
		if(answer == 5){
			populateUsers(getUserLogin);
			return;
		}
		console.log("Invalid option");
		determineCommand();
	});
}

function getUserLogin(){
	if(Object.keys(users).length === 0){
		console.log("There seem to be no users.  Please create user");
		createUser(getUserLogin);
	}else{
		console.log(users);
		rl.question("\nWhich user would you like to be? (please enter id) ", (answer) => {
			if(users[answer]){
				console.log("Assuming role of user: " + users[answer]);
				console.log("Removing conversation partner (if existed)");
				myUserId = answer;
				theirUserId = null;
				determineCommand();
			}else{
				console.log("\n\nInvalid user ID " + answer + ".  Please try again\n\n");
				getUserLogin();
			}
		});
	}
}

function setCounterpart(){
	console.log(users);
	rl.question("\nChoose your conversational partner (ID).\n", (answer) => {
		if(users[answer] && answer !== myUserId){
			theirUserId = answer;
			console.log("You are now chatting with: "+ users[theirUserId]);
		}else{
			console.log("Invalid user ID " + answer + ". Returning to menu");
		}
		determineCommand();
	});
}

function createUser(callback){
	rl.question("\nWhat is the user's name?\n", (answer) => {
		request.post({
			headers: {'content-type' : 'application/x-www-form-urlencoded'},
			url:	'http://localhost:3000/api/chatusers',
			body:   "name=" + answer
		}, function(error, response, body){
			if(!error && response.statusCode == 200){
		  		console.log("User created\n");
		  		if(callback){
		  			populateUsers(callback);
		  		}else{
		  			populateUsers(determineCommand);
		  		}
  		  	}else{
  				console.log("Error creating user: " + error);
  				determineCommand();
  		  	}
		});
	});
}

function sendMessage(){
	if((theirUserId === null)){
		console.log("\nNo conversation partner set, please set a conversation partner.\n");
		determineCommand();
	}
	rl.question("\nPlease enter your message to " + users[theirUserId] + ":\n", (answer) => {
		request.post({
			headers: {'content-type' : 'application/x-www-form-urlencoded'},
			url:	'http://localhost:3000/api/messages',
			body:	"to_id=" + theirUserId + "&from_id=" + myUserId + "&text=" + answer + "&timestamp=" + moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss")
		}, function(error, response, body){
		  	if(!error && response.statusCode == 200){
		  		console.log("Message sent\n");
  		  	}else{
  				console.log("Error sending message: " + response.statusCode);
  		  	}
			determineCommand();
		});
	});
}

function viewHistory(){
	if(isNaN(theirUserId)){
		console.log("\nNo conversation partner set, please set a conversation partner.\n");
		determineCommand();
	}
	request.get({
		url:	'http://localhost:3000/api/messages?my_id=' + myUserId + '&their_id=' + theirUserId,
		body: 	'my_id=' + myUserId + '&their_id=' + theirUserId
	}, function(error, response, body){
		if(!error && response.statusCode == 200){
			console.log("History ----------------\n");
			JSON.parse(body).data.forEach(function(value) {
				console.log(users[value.from_id] + " [" + value.timestamp + "]: " + value.text);
			});
			console.log("\n------------------- End\n");
  		}else{
  			console.log("Error " + response.statusCode);
  		}
  		determineCommand();
	});
}
