var Discord = require('discord.js');
var config = require('./config.json');
var commands = require("./commands.js");

var PrelixBot = new Discord.Client();
var message = PrelixBot.msg;
var bot = PrelixBot;
var prefix = config.misc.prefix;
var blackListed = config.perms.blacklist;
var masterUser = config.perms.masterUser;
var dataValues = require('./data/userdata.json');
var userdata;
var selfbotperm = config.perms.selfbot;
var selfbot = config.login.selfbot;
var selfMaster = config.selfbot.masterUser;
var fs = require('fs');

console.log('> Loading PrelixBot...');
PrelixBot.on("message", (msg, suffix) => {
	var executed = msg.content.substring(prefix.length); //not gonna use (1) because people can use 2 letter prefixes.
	var selfexecuted = msg.content.substring(config.misc.selfbotprefix.length); //not gonna use (1) because people can use 2 letter prefixes.
	try {
    if (msg.content.startsWith(prefix) && selfbot != "true") {
      if(!msg.author.bot) {
		if(!(blackListed.indexOf(msg.sender.id) > -1)) {
        var cmdRexEx = new RegExp(prefix + "([^ ]+) ?(.*)");

        var name = msg.content.replace(cmdRexEx, "$1");
        var argsString = msg.content.replace(cmdRexEx, "$2");
        
		if (name == "help") {
			if (argsString.length < 1) {
				var cmdStorage = [];
					for (var cmd in commands.commands) {
					cmdStorage.push(cmd);
					} 
				var helpArray = [];
				helpArray.push('Currently available commands are; ');
				helpArray.push('');
				helpArray.push(cmdStorage.sort().join(', '));
				helpArray.push('');
				helpArray.push('Please use `' + prefix + 'help commandName` to get information about a command!')
				bot.sendMessage(msg.author, helpArray.join('\n'));
				if (msg.channel.server) {
				bot.sendMessage(msg.channel, "**OK!** " + msg.sender.username + ", I've sent you a list of my commands to your direct messages!");
				}
			} else {
				var msgArray = [];
				try {
				if (commands.commands[argsString]) {
				msgArray.push('Requested command: ' + argsString);
				msgArray.push('');
				if (commands.commands[argsString].helpText) {
				msgArray.push('Help text; `' + commands.commands[argsString].helpText + '`');
				}
				if (commands.commands[argsString].usage) {
				msgArray.push('Usage; `' + commands.commands[argsString].usage + '`');
				}
				if (commands.commands[argsString].aliases) {
				msgArray.push('Aliases; `' + commands.commands[argsString].aliases + '`');
				}
				} else {
					msgArray.push("This doesn't seem like a valid command! Please try again.");
				}
				bot.sendMessage(msg.author, msgArray.join('\n'));
				if (msg.channel.server) {
				bot.sendMessage(msg.channel, "**OK!** " + msg.sender.username + ", I've sent you information about requested command!");
				}
			   } catch(e) {
				   bot.sendMessage(msg.channel, "Something went wrong! Are you sure you're using me correct?");
			   }
			}
		}
		if (!(dataValues.hasOwnProperty(msg.author.id))) {
		userdata = {"msgcount": 1};
		dataValues[msg.author.id] = userdata;
		fs.writeFile("./data/userdata.json", JSON.stringify(dataValues, null, 4), 'utf8', function(err){if(err){throw err}});
		} else {
			commands.commands[name].process(bot, msg, config, argsString);
		}
        console.log('> ' + msg.sender.name + ' executed <' + executed + '>');
		} else {
		console.log('> ' + msg.sender.name + ' has been denied from executing a command.');
		}
      } else if (msg.author.bot) {
        console.log('> ' + msg.sender.name + ' [BOT] has been denied from executing a command.');
      }
    } else {
		if(msg.content.startsWith(config.misc.selfbotprefix) && selfbot == "true") {
			if(selfbotperm.indexOf(msg.sender.id) > -1 || selfMaster.indexOf(msg.sender.id) > -1) {
		var cmdRexEx = new RegExp(config.misc.selfbotprefix + "([^ ]+) ?(.*)");

        var name = msg.content.replace(cmdRexEx, "$1");
        var argsString = msg.content.replace(cmdRexEx, "$2");
        
        commands.commands[name].process(bot, msg, config, argsString);
		console.log('> ' + msg.sender.name + ' executed <' + selfexecuted + '>');
			}
		}
	}
	} catch(e) {
		if(!config.login.selfbot) {
		console.log('> ' + msg.sender.name + ' executed invalid command <' + selfexecuted + '>');
		}
	}
});

if(config.login.botuser == "true" && selfbot != "true") {
PrelixBot.loginWithToken(config.login.token, (err) => {
	if(err) {
		console.log("ERROR! This is most likely because login failed?");
	}
});
} else if (config.login.botuser != "true" && selfbot != "true") {
	PrelixBot.login(config.login.email, config.login.password, (err) => {
		if(err) {
			console.log("ERROR! This is most likely because login failed?");
		}
	});
} else if (config.login.botuser == "true" && selfbot == "true") {
	PrelixBot.loginWithToken(config.login.selfbottoken, (err) => {
		if(err) {
			console.log("ERROR! This is most likely because login failed?");
		}
	});
} else if (config.login.botuser != "true" && selfbot == "true") {
	PrelixBot.login(config.login.selfemail, config.login.selfpass, (err) => {
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