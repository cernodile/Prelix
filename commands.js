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

var commands = {
    "say": {
        "usage": "<message ...>",
        "helpText": "Makes the bot quote you.",
        "aliases": [ "s" ],
        "process": (bot, msg, config, suffix) => {
            bot.sendMessage(msg.channel, '\u200B' + suffix);
        }
    },
    'ping': {
        "helpText": "Pings the bot!",
        "aliases": [ "pong" ],
        "process": (bot, msg, config) => {
            bot.sendMessage(msg.channel, 'Pong!');
        }
    },
    'kill': {
      "helpText": "Kills the bot!",
      "aliases": [ "killswitch" ],
      "process": (bot, msg, config) => {
          	if(masterUser.indexOf(msg.sender.id) > -1) {
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
    	"helpText": '',
    	"aliases": [ 'mystats', 'myperms' ],
    	"process": (bot, msg, config) => {
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
		msgArray.push('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
		msgArray.push('```');
		bot.sendMessage(msg.channel, msgArray.join('\n'));
    	}
    },
    'eval': {
      "helpText": "Evaluates code.",
      "aliases": [ "sudo" ],
      "process": (bot, msg, config, suffix) => {
    if(masterUser.indexOf(msg.sender.id) > -1) { // expand the msg.sender.id if you got more than 2 masterusers!
		try {
	    	var evalArray = [];
	    	evalArray.push('```xl');
	    	evalArray.push('- - - - - - - - - - - - - - - - This - - - - - - - - - - - - - - - - ');
	    	evalArray.push(suffix);
	    	evalArray.push('- - - - - - - - - - - - - - evaluates-to - - - - - - - - - - - - - - -');
	    	evalArray.push(eval(suffix));
	    	evalArray.push('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
	    	evalArray.push('```');
	    	bot.sendMessage(msg.channel, evalArray.join('\n'));
		} catch (e) {
	    	evalArray = [];
	    	evalArray.push('```xl');
	    	evalArray.push('- - - - - - - - - - - - - - - - -This - - - - - - - - - - - - - - - -');
	    	evalArray.push(suffix);
	    	evalArray.push('- - - - - - - - - - - - - - - - Failed- - - - - - - - - - - - - - - -');
	    	evalArray.push(e);
	    	evalArray.push('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
	    	evalArray.push('```');
	    	bot.sendMessage(msg.channel, evalArray.join('\n'));
		}
		console.log('> ' + msg.sender.username + ' executed <eval ' + suffix+'>');
		} else {
			bot.sendMessage(msg.channel, '**Uh oh!** It seems as you have no permission to execute this command!');
			console.log('> ' + msg.sender.username + ' attempted to execute <eval>');
		}
      }
    },
    'info': {
    	'helpText': '',
    	'aliases': [ 'botinfo', 'framework' ],
    	'process': (bot, msg, config) => {
    	var msgArray = [];
    	if(alphaversion != null) {
		msgArray.push('**PrelixBot v' + version + ' ' + alphaversion + '**');
    	} if(betaversion != null) {
    		msgArray.push('**PrelixBot v' + version + ' ' + betaversion + '**');
    	} else if (alphaversion == null && betaversion == null) {
    		msgArray.push('**PrelixBot v' + version + '**');
    	}
		msgArray.push('Using **discord.js** by **hydrabolt**');
		msgArray.push('Made by **Joann#8057** and **Stolen#5422**.');
		bot.sendMessage(msg.channel, msgArray);
    	}
    },
    'invite': {
    	'helpText': 'Sends you my invite link! Handy!',
    	'aliases': [ 'myinvite', 'joinserver', 'join-server', 'oauth', 'oauth2' ],
    	'process': (bot, msg, config) => {
    			bot.sendMessage(msg.channel, 'Hello, ' + msg.sender.username + '! My invite link is https://discordapp.com/oauth2/authorize?&client_id=' + config.misc.appid + '&scope=bot');
    	}
    },
    'status': {
    	'helpText': "Checks my statistics, handy if you're doing some research.",
    	'process': (bot, msg, config) => {
    		var upArray = [];
    		upArray.push("I'm used in " + bot.servers.length + ' servers, serving about ' + bot.users.length + ' users in ' + bot.channels.length + ' channels.');
    		upArray.push('My uptime is: ' + (Math.round(bot.uptime / (1000 * 60 * 60 * 24))) + ' days, ' + (Math.round(bot.uptime / (1000 * 60 * 60))) + ' hours, ' + (Math.round(bot.uptime / (1000 * 60)) % 60) + ' minutes, and ' + (Math.round(bot.uptime / 1000) % 60) + ' seconds.');
    		bot.sendMessage(msg.channel, upArray.join('\n'));
    	}	
    },
    'request': {
    	'helpText': 'Requests a song if I am in voice channel.',
    	'process': (bot, msg, config, suffix) => {
    		try {
    			musicHandler.musichandler['songRequest'].process(bot, msg, config, suffix);
    		} catch(e) {
    			console.log(e);
    		}
    	}
    },
    'voice': {
    	'process': (bot, msg, config) => {
    		try {
    			if(vipUser.indexOf(msg.sender.id) > -1 || masterUser.indexOf(msg.sender.id) > -1) {
					musicHandler.musichandler['joinVoice'].process(bot, msg, config);
    			}
    		} catch(e) {
    			console.log(e);
    		}
    	}
    },
};

exports.commands = commands;