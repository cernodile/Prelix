var config = require('./config.json');
var musicHandler = require('./musichandler.js');
var Cleverbot = require('cleverbot-node');
var unirest = require('unirest');
var cleverbot = new Cleverbot();
var masterUser = config.perms.masterUser;
var vipUser = config.perms.vip;
var versionJSON = require('./version.json');
var version = versionJSON.version;
var alphaversion = versionJSON.alphaversion;
var betaversion = versionJSON.betaversion;
var dataValues = require('./data/userdata.json');
var saveData = function(){fs.writeFile("./data/userdata.json", JSON.stringify(dataValues, null, 4), 'utf8', function(err){if(err){throw err}})};
var userdata;
var redeem = require('./data/redeem.json');
var achieves = require("./data/achieves.json");
var saveAchieves = function(){fs.writeFile("./data/achieves.json", JSON.stringify(achieves, null, 4), 'utf8', function(err){if(err){throw err}})};
var achievement;
var fs = require('fs');

var commands = {
    "say": {
        "usage": "<message ...>",
        "helpText": "Makes the bot quote you.",
        "aliases": [ "s" ],
        "process": (bot, msg, config, suffix) => {
            bot.sendMessage(msg.channel, '\u200B' + suffix);
			if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
        }
    },
	'robohash': {
		'helpText': 'Gives a robohash picture based on a string.',
		'usage': '<suffix>',
		'process': (bot, msg, config, suffix) => {
			if(suffix.length > 0) {
				bot.sendMessage(msg.channel, '\u200B' + 'https://robohash.org/' + suffix + '?size=150x150');
			} else {
				bot.sendMessage(msg.channel, '\u200B' + 'https://robohash.org/' + msg.author.id + '?size=150x150');
			}
		}
	},
    'ping': {
        "helpText": "Pings the bot!",
        "aliases": [ "pong" ],
        "process": (bot, msg, config) => {
		try	{
            bot.sendMessage(msg.channel, 'Pong!');
			if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
		} catch(e) {
				console.log(e);
			}
        }
    },
    'kill': {
      "helpText": "Kills the bot!",
      "aliases": [ "killswitch" ],
      "process": (bot, msg, config) => {
          	if(masterUser.indexOf(msg.sender.id) > -1) {
				if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
          bot.sendMessage(msg.channel, 'Restarting! Be right back! :)', (err, m) => {
			bot.logout((err) => {
				console.log('> Disconnected via kill!');
    			process.exit(0);
			});
		});
      }
    }
	},
	'myinfo': {
    	"helpText": 'Gives your information in a fancified codeblock.',
    	"aliases": [ 'mystats', 'myperms' ],
    	"process": (bot, msg, config) => {
			if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
    		var msgArray = [];
		msgArray.push('```xl');
		msgArray.push('- - - - - - - - - - - - - - - - - User Info - - - - - - - - - - - - - - - - -');
		if(masterUser.indexOf(msg.sender.id) > -1) {
		msgArray.push('Are you an administrator? Yes.');
		} else {
			msgArray.push('Are you an administrator? No.');
		}
		if(vipUser.indexOf(msg.sender.id) > -1 || masterUser.indexOf(msg.sender.id) > -1) { //masteruser gets vip instantly to not hog config
		msgArray.push('Are you VIP? Yes.');
		} else {
			msgArray.push('Are you VIP? No.');
		}
		msgArray.push('Your id is ' + msg.sender.id);
		msgArray.push('Avatar URL: ' + msg.sender.avatarURL);
		msgArray.push('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
		msgArray.push('```');
		bot.sendMessage(msg.channel, msgArray.join('\n'));
    	}
    },
    'eval': {
      "helpText": "Evaluates code. [Developer]",
	  "usage": "<evaluated code...>",
      "aliases": [ "sudo" ],
      "process": (bot, msg, config, suffix) => {
    if(masterUser.indexOf(msg.sender.id) > -1) { // expand the msg.sender.id if you got more than 2 masterusers!
	if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
		bot.sendMessage(msg.channel, '**Evaluating your code...**', (err, msg) => {
    try {
      var result = eval(suffix);
      if(typeof result != 'object') {
       bot.sendMessage(msg.channel, result);
	  }
    } catch (e) {
      bot.sendMessage(msg.channel, '**Uh oh!** Unfortunately, your eval has failed!\n'+e);
    }
		});
		console.log('> ' + msg.sender.username + ' executed <eval ' + suffix+'>');
		} else {
			bot.sendMessage(msg.channel, '**Uh oh!** It seems as you have no permission to execute this command!');
		}
      }
    },
    'info': {
    	'helpText': 'Gives you info about my framework.',
    	'aliases': [ 'botinfo', 'framework' ],
    	'process': (bot, msg, config) => {
    	var msgArray = [];
		if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
    	if(alphaversion != null) {
		msgArray.push('**PrelixBot v' + version + ' ' + alphaversion + '**');
    	} if(betaversion != null) {
    		msgArray.push('**PrelixBot v' + version + ' ' + betaversion + '**');
    	} else if (alphaversion == null && betaversion == null) {
    		msgArray.push('**PrelixBot v' + version + '**');
    	}
		msgArray.push('Using **discord.js** by **hydrabolt**');
		msgArray.push('Made by **Joann#8057** and **ThyStolen#5422**.');
		bot.sendMessage(msg.channel, msgArray);
    	}
    },
    'invite': {
    	'helpText': 'Sends you my invite link! Handy!',
    	'aliases': [ 'myinvite', 'joinserver', 'join-server', 'oauth', 'oauth2' ],
    	'process': (bot, msg, config) => {
			if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
			if (!config.login.selfbot) {
    			bot.sendMessage(msg.channel, 'Hello, ' + msg.sender.username + '! My invite link is https://discordapp.com/oauth2/authorize?&client_id=' + config.misc.appid + '&scope=bot');
			} else {
				bot.sendMessage(msg.channel, 'Hello, ' + msg.sender.username + '! My invite link is https://discordapp.com/oauth2/authorize?&client_id=' + config.misc.selfbotid + '&scope=bot');
			}
		}
    },
    'status': {
    	'helpText': "Checks my statistics, handy if you're doing some research.",
    	'process': (bot, msg, config) => {
    		var upArray = [];
			if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
    		upArray.push("I'm used in " + bot.servers.length + ' servers, serving about ' + bot.users.length + ' users in ' + bot.channels.length + ' channels.');
    		upArray.push('My uptime is: ' + (Math.round(bot.uptime / (1000 * 60 * 60 * 24))) + ' days, ' + (Math.round(bot.uptime / (1000 * 60 * 60))) + ' hours, ' + (Math.round(bot.uptime / (1000 * 60)) % 60) + ' minutes, and ' + (Math.round(bot.uptime / 1000) % 60) + ' seconds.');
    		bot.sendMessage(msg.channel, upArray.join('\n'));
    	}	
    },
    'request': {
    	'helpText': 'Requests a song if I am in voice channel.',
    	'process': (bot, msg, config, suffix) => {
    		try {
				if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
    			musicHandler.musichandler['songRequest'].process(bot, msg, config, suffix);
    		} catch(e) {
    			console.log(e);
    		}
    	}
    },
    'voice': {
		'helpText': 'Connects me to a voice channel. [VIP]',
    	'process': (bot, msg, config) => {
    		try {
    			if(vipUser.indexOf(msg.sender.id) > -1 || masterUser.indexOf(msg.sender.id) > -1) {
					if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
					musicHandler.musichandler['joinVoice'].process(bot, msg, config);
    			}
    		} catch(e) {
    			console.log(e);
    		}
    	}
    },
    'skip': {
    	'process': (bot, msg, config) => {
    		try {
    			if(vipUser.indexOf(msg.sender.id) > -1 || masterUser.indexOf(msg.sender.id) > -1) {
					if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
					musicHandler.musichandler['skipSong'].process(bot, msg, config);
    			}
    		} catch(e) {
    			console.log(e);
    		}
    	}
    },
    'leave-voice': {
    	'process': (bot, msg, config) => {
    		try {
    			if(vipUser.indexOf(msg.sender.id) > -1 || masterUser.indexOf(msg.sender.id) > -1) {
					if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
    				musicHandler.musichandler['leaveVoice'].process(bot, msg, config);
    			}
    		} catch(e) {
    			console.log(e);
    		}
    	}
    },
    'setstatus': {
    	'help': 'Sets my playing and status! [Developer]',
		'process': (bot, msg, config, suffix) => {
			var args = suffix.split(' ');
			var fArg = args[0];
			var slicer = args.slice(1, args.length);
			var sArg = slicer.join(' ');
			try {
				if(masterUser.indexOf(msg.sender.id) > -1) {
					if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
					if (fArg == "online" || fArg == "idle" || fArg == "away" || fArg == "here" || fArg == "active" || fArg == "available") {
					bot.setStatus(fArg, sArg);
					bot.sendMessage(msg.channel, "**Okay!** I'm now playing `"+ sArg + '` while being ' + fArg + '!');
				} else if (fArg == "stream") { //DISCORD.JS INDEV EXCLUSIVE!
					bot.setStreaming(sArg, 'https://twitch.tv//', 1);
					bot.sendMessage(msg.channel, "**Okay!** I'm now streaming `"+ sArg + '`!');
				} else {
					bot.sendMessage(msg.channel, "Please use either `online`, `idle`, `away`, `here`, `active` or `available` as first param!");
					}
				}
			}catch(e) {
				console.log(e);
			}
		}
    },
	'redeem': {
		'usage': 'redeem <redeem code>',
		'help': 'Redeems a special code.',
		'process': (bot, msg, config, suffix) => {
			var args = suffix.split(' ');
			var fArg = args[0];
			if (achieves.hasOwnProperty(msg.author.id)) {
			achievement = achieves[msg.author.id];
			if(fArg == "JOANNBDAY2K16") {
				if(achievement.achieve9 != "1" && redeem.JOANNBDAY2K16.expired != "1") {
				bot.sendMessage(msg.channel, "\u200B" + "Successfuly redeemed code!");
				achievement.achieve9 = "1";
				saveAchieves();
				} else if(redeem.JOANNBDAY2K16.expired == "1") {
					bot.sendMessage(msg.channel, "\u200B" + "Sorry! This redeem code has been expired!");
				} else {
					bot.sendMessage(msg.channel, "\u200B" + 'You have already redeemed this code!');
				}
			} else {
				bot.sendMessage(msg.channel, "\u200B" + 'Invalid redeem code!');
			}
			} else {
				bot.sendMessage(msg.channel, "\u200B" + 'Uh oh! Please use `>achievements` before redeeming a code!');
			}
		}
	},
	'giveachieve': {
		'process': (bot, msg, config, suffix) => {
			var args = suffix.split(' ');
			var fArg = args[1];
			var sArg = args[2];
			try {
		if(masterUser.indexOf(msg.sender.id) > -1) {
			if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
			if(suffix.length > 0 && msg.mentions.length == 1) {
				console.log(msg.mentions[0].id);
				console.log('fArg - ' + fArg + ', sArg - ' + sArg);
				if (achieves.hasOwnProperty(msg.mentions[0].id)) {
					if(fArg == "contributor") {
						achievement = achieves[msg.mentions[0].id];
						achievement.achieve2 = parseInt(sArg);;
						saveAchieves();
						bot.sendMessage(msg.channel, "Successfully edited achievement for specified user!");
					} if (fArg == "otherbot") {
						achievement = achieves[msg.mentions[0].id];
						achievement.achieve3 = parseInt(sArg);
						saveAchieves();
						bot.sendMessage(msg.channel, "Successfully edited achievement for specified user!");
					} if (fArg == "friend") {
						achievement = achieves[msg.mentions[0].id];
						achievement.achieve4 = parseInt(sArg);
						saveAchieves();
						bot.sendMessage(msg.channel, "Successfully edited achievement for specified user!");
					} if (fArg == "staff") {
						achievement = achieves[msg.mentions[0].id];
						achievement.achieve5 = parseInt(sArg);
						saveAchieves();
						bot.sendMessage(msg.channel, "Successfully edited achievement for specified user!");
					} if (fArg == "artist") {
						achievement = achieves[msg.mentions[0].id];
						achievement.achieve8 = parseInt(sArg);
						saveAchieves();
						bot.sendMessage(msg.channel, "Successfully edited achievement for specified user!");
					}
				} else {
					bot.sendMessage(msg.channel, "Sorry, but you either entered the wrong params or user doesn't exist!");
				}
			} if (msg.mentions.length == 0) {
				bot.sendMessage(msg.channel, "Please mention someone first!");
			} if (msg.mentions.length > 1) {
				bot.sendMessage(msg.channel, "One mention at a time, please!");
			} else {
				// nothing
			}
		}
			} catch(e) {
				console.log(e);
			}
		}
},
    'achievements': {
    	'process': (bot, msg, config, suffix) => {
			try {
    		var msgArray = [];
			var args = suffix.split(' ');
			var fArg = args[0];
			if (dataValues.hasOwnProperty(msg.author.id)) {
			userdata = dataValues[msg.author.id];
			userdata.msgcount = (userdata.msgcount + 1);
			saveData();
			} else {
				console.log("> " + msg.sender + "has requested a command without msgcounter setup!");
			}
			if (achieves.hasOwnProperty(msg.author.id)) {
    		msgArray.push('`> Achievements of ' + msg.sender.name + ' <`');
			achievement = achieves[msg.author.id];
			userdata = dataValues[msg.author.id];
			if(fArg != "2" || fArg == "1" || !fArg) {
    		if(masterUser.indexOf(msg.sender.id) > -1) {
    		msgArray.push('☑ Developer');
    		} else {
				msgArray.push('❓ **Undiscovered achievement**');
			}
    		if(masterUser.indexOf(msg.sender.id) > -1 || vipUser.indexOf(msg.sender.id) > -1) {
    		msgArray.push('🌟 VIP');
    		} else {
				msgArray.push('❓ **Undiscovered achievement**');
			}
			if(userdata.msgcount > 99 && userdata.msgcount < 250) {
				msgArray.push('✉ Over 100 commands sent');
			}
			if(userdata.msgcount > 249 && userdata.msgcount < 500) {
				msgArray.push('✉ Over 250 commands sent');
			}
			if(userdata.msgcount > 499 && userdata.msgcount < 1000) {
				msgArray.push('✉ Over 500 commands sent');
			} if(userdata.msgcount > 999 && userdata.msgcount < 2000) {
				msgArray.push('✉ Over 1000 commands sent');
			} if(userdata.msgcount > 1999 && userdata.msgcount < 3500) {
				msgArray.push('✉ Over 2000 commands sent');
			} if (userdata.msgcount < 100) {
				msgArray.push('❓ **Undiscovered achievement**');
			}
			if(achievement.achieve5 == 1) {
				msgArray.push('☎ Prelix Staff member');
			} if (achievement.achieve5 == 2) {
				msgArray.push('☎ Prelix Head Staff member');
			} if (achievement.achieve5 < 1) {
				msgArray.push('❓ **Undiscovered achievement**');
			} if (achievement.achieve5 == null) {
				msgArray.push('🚫 Broken achievement value!');
			}
			if(achievement.achieve1 == 1) {
				msgArray.push('👍🏽 Generated achievement structure');
			} if (achievement.achieve1 < 1) {
				msgArray.push('🚫 Achievement data not built properly!');
			} if (achievement.achieve1 == null) {
				msgArray.push('🚫 Broken achievement value!');
			}
			msgArray.push('');
			msgArray.push('Showing `(5/10)` achievements on page `(1/2)`.');
			} if (fArg == "2") {
				if(achievement.achieve9 == 1) {
				msgArray.push('🎂 Birthday of Joann 2016');
			} if(achievement.achieve9 < 1) {
				msgArray.push('❓ **Undiscovered achievement**');
			} if (achievement.achieve9 == null) {
				msgArray.push('🚫 Broken achievement value!');
			} else if (!achievement.achieve9) {
				achievement.achieve9 = 0;
				msgArray.push('❓ **Undiscovered achievement**');
			}
			if(achievement.achieve4 == 1) {
				msgArray.push('👌🏽 Friends with Prelix staff');
			} if (achievement.achieve4 < 1) {
				msgArray.push('❓ **Undiscovered achievement**');
			} if (achievement.achieve4 == null) {
				msgArray.push('🚫 Broken achievement value!');
			}
			if(achievement.achieve3 == 1) {
				msgArray.push('🤖 Developer of other bot(s)');
			} if(achievement.achieve3 == 2) {
				msgArray.push('🤖 Developer of unique bot(s) 🏅');
			} if (achievement.achieve3 < 1) {
				msgArray.push('❓ **Undiscovered achievement**');
			} if (achievement.achieve3 == null) {
				msgArray.push('🚫 Broken achievement value!');
			}
			if(achievement.achieve2 == 1) {
				msgArray.push('🍎 Contributor');
			} if(achievement.achieve2 == 2) {
				msgArray.push('🍎 Big Contributor');
			} if (achievement.achieve2 < 1) {
				msgArray.push('❓ **Undiscovered achievement**');
			} if (achievement.achieve2 == null) {
				msgArray.push('🚫 Broken achievement value!');
			}
			if(achievement.achieve8 == 1) {
				msgArray.push('🎨 Artist');
			} if (achievement.achieve8 < 1) {
				msgArray.push('❓ **Undiscovered achievement**');
			} if (achievement.achieve8 == null) {
				msgArray.push('🚫 Broken achievement value!');
			}
				msgArray.push('');
				msgArray.push('Showing `(10/10)` achievements on page `(2/2)`.');
			}
    		bot.sendMessage(msg.channel, msgArray);
			} else {
				achievement = {"achieve1": 1, "achieve2": 0, "achieve3": 0, "achieve4": 0, "achieve5": 0, "achieve6": 0, "achieve7": 0, "achieve8": 0, "achieve9": 0, "achieve10": 0};
				achieves[msg.author.id] = achievement;
				fs.writeFile("./data/achieves.json", JSON.stringify(achieves, null, 4), 'utf8', function(err){if(err){throw err}});
				bot.sendMessage(msg.channel, "✅ Generated your achievement structure!");
				}
			} catch(e) {
				console.log(e);
			}
		}
    },
    'volume': {
    	'process': (bot, msg, config, suffix) => {
    		//soon TM
    	}
    },
};

exports.commands = commands;