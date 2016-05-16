var Discord = require('discord.js');
var config = require('./config.json');
var commands = require("./commands.js");

var PrelixBot = new Discord.Client();
var message = PrelixBot.msg;
var bot = PrelixBot;
var prefix = config.misc.prefix;

console.log('> Loading PrelixBot...');
PrelixBot.on("message", (msg, suffix) => {
	var executed = msg.content.substring(prefix.length); //not gonna use (1) because people can use 2 letter prefixes.
	try {
    if (msg.content.startsWith(prefix)) {

        var cmdRexEx = new RegExp(prefix + "([^ ]+) ?(.*)");

        var name = msg.content.replace(cmdRexEx, "$1");
        var argsString = msg.content.replace(cmdRexEx, "$2");
        
        commands.commands[name].process(bot, msg, config, argsString);
        console.log('> ' + msg.sender.name + ' executed <' + executed + '>');
    }
	} catch(e) {
		console.log('> ' + msg.sender.name + ' executed invalid command <' + executed + '>');
	}
});

if(config.login.botuser == "true" || config.login.botuser == "yes") {
PrelixBot.loginWithToken(config.login.token, (err) => {
	if(err) {
		console.log("ERROR! This is most likely because login failed?");
	}
});
} else {
	PrelixBot.login(config.login.email, config.login.password, (err) => {
		if(err) {
			console.log("ERROR! This is most likely because login failed?");
		}
	});
}
PrelixBot.on('ready', function() {
	console.log('> Success! Your bot is now online!');
	console.log('> Logged in as ' + bot.user.username + '#' + bot.user.discriminator + ', serving '  + bot.users.length + ' users in ' + bot.servers.length + ' servers!');
});

PrelixBot.on('uncaughtException', function(err) {
  // Handle ECONNRESETs caused by `next` or `destroy`
  if (err.code == 'ECONNRESET') {
    console.log('Got an ECONNRESET! This is *probably* not an error. Stacktrace:');
    console.log(err.stack);
  } else {
    // Normal error handling
    console.log(err);
    console.log(err.stack);
    process.exit(0);
  }
});
