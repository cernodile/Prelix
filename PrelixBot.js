var Discord = require('discord.js');
var config = require('./config.json');
var items = require('./data/runeitems.json');

var PrelixBot = new Discord.Client();
var message = PrelixBot.msg;
var bot = PrelixBot;
var prefix = config.misc.prefix;
var masterUser = config.perms.masterUser;
var vipUser = config.perms.vip;

var unirest = require('unirest');

console.log('> Loading PrelixBot...');

PrelixBot.on('message', function(msg, suffix)
{
	/*
	* Commands
	*/
	var commands = ['help', ' ping', ' invite', ' ayy', ' kill', ' eval', ' server', ' cat', ' say', ' stats', ' price', ' ship', ' myinfo'];
	var content = msg.content.toLowerCase();
	// cmd lengths
	var cmd1 = 'help';
	var cmd2 = 'ping';
	var cmd3 = 'invite';
	var cmd4 = 'info';
	var cmd5 = 'eval';
	var cmd6 = 'ayy';
	var cmd7 = 'kill';
	var cmd8 = 'server';
	var cmd9 = 'cat';
	var cmd10 = 'say';
	var cmd11 = 'stats';
	var cmd12 = 'price';
	var cmd13 = 'ship';
	var cmd14 = 'myinfo';
	// suffixes
	var suffix5 = msg.content.substring(cmd5.length + (prefix.length + 1)); // msg.content
	var suffix8 = content.substring(cmd8.length + (prefix.length + 1));
	var suffix10 = content.substring(cmd10.length + (prefix.length + 1));
	var suffix12 = content.substring(cmd12.length + (prefix.length + 1));
	var suffix13 = content.substring(cmd13.length + (prefix.length + 1));

	if(content === prefix + cmd1) {
		var msgArray = [];
		msgArray.push('The current commands available are;');
		msgArray.push('```diff');
		msgArray.push('!============================================================================!');
		msgArray.push('+ ' + commands);
		msgArray.push('!============================================================================!');
		msgArray.push('```');
		bot.sendMessage(msg.channel, msgArray.join('\n'));
	}
	if(content == prefix + cmd2)
	{
		bot.reply(msg, 'Pong!');
		console.log('> ' + msg.sender.username + ' executed <ping>')
	}
	if(content == prefix + cmd3) {
		bot.sendMessage(msg.channel, 'Hello, ' + msg.sender.username + '! My invite link is https://discordapp.com/oauth2/authorize?&client_id=' + config.misc.appid + '&scope=bot');
	}
	if(content == prefix + cmd4) {
		var msgArray = [];
		msgArray.push('**PrelixBot v1.0.0 alpha-1**');
		msgArray.push('Using **discord.js** by **hydrabolt**');
		msgArray.push('Made by **Joann#8057** and **Stolen#5422**.');
		bot.sendMessage(msg.channel, msgArray);
		console.log('> ' + msg.sender.username + ' executed <info>')
	}
	if(content.startsWith(prefix + cmd5)) {
		if(masterUser.indexOf(msg.sender.id) > -1) { // expand the msg.sender.id if you got more than 2 masterusers!
		try {
		var evalArray = [];
		evalArray.push('```xl');
		evalArray.push('- - - - - - - - - - - - - - - - This - - - - - - - - - - - - - - - - ');
		evalArray.push(suffix5);
		evalArray.push('- - - - - - - - - - - - - - evaluates-to - - - - - - - - - - - - - - -');
		evalArray.push(eval(suffix5));
		evalArray.push('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
		evalArray.push('```');
		bot.sendMessage(msg.channel, evalArray.join('\n'));
		} catch (e) {
		evalArray = [];
		evalArray.push('```xl');
		evalArray.push('- - - - - - - - - - - - - - - - -This - - - - - - - - - - - - - - - -');
		evalArray.push(suffix5);
		evalArray.push('- - - - - - - - - - - - - - - - Failed- - - - - - - - - - - - - - - -')
		evalArray.push(e);
		evalArray.push('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
		evalArray.push('```');
		bot.sendMessage(msg.channel, evalArray.join('\n'));
		}
		console.log('> ' + msg.sender.username + ' executed <'+ cmd6 + ' ' + suffix5+'>')
		} else {
			bot.sendMessage(msg.channel, '**Uh oh!** It seems as you have no permission to execute this command!');
			console.log('> ' + msg.sender.username + ' attempted to execute <'+cmd6+'>')
		}
	}
	if(content == prefix + cmd6) {
		bot.sendMessage(msg.channel, 'lmao');
		console.log('> ' + msg.sender.username + ' executed <ayy>')
	}
	if(content == prefix + cmd7) {
		if(masterUser.indexOf(msg.sender.id) > -1) {
		bot.sendMessage(msg.channel, 'Restarting! Be right back! :)', (err, m) => {
			console.log('> ' + msg.sender.username + ' executed <'+cmd7+'>')
			bot.logout((err) => {
				console.log('> Disconnected via kill!');
    			process.exit(0);
			});
		});
		} else {
			bot.sendMessage(msg.channel, '**Uh oh!** It seems as you have no permission to execute this command!');
			console.log('> ' + msg.sender.username + ' attempted to execute <'+cmd7+'>')
		}
	}
	if(content.startsWith(prefix + cmd8)) {
		var num = parseInt(suffix8);
            var checkArray = [];
            if (num < bot.servers.length) {
            checkArray.push(bot.servers[num] + " *(" + bot.servers[num].id + ")* located at _'" + bot.servers[num].region + "' with " + bot.servers[num].members.length + " members registered and " + bot.servers[num].roles.length + " roles registered_.");
            checkArray.push("It's owned by __" + bot.servers[num].owner.name + "#" + bot.servers[num].owner.discriminator + "__ _(" + bot.servers[num].owner.id + ")_");
            bot.sendMessage(msg.channel, checkArray);
            } else {
                bot.reply(msg, "sorry! This server either doesn't exist or I've ran out of servers!");
        }
        console.log('> ' + msg.sender.username + ' executed <' + cmd8 + '>')
	}
	if(content == prefix + cmd9) {
		unirest.get("https://nijikokun-random-cats.p.mashape.com/random")
      .header("X-Mashape-Key", config.api.mashape)
      .header("Accept", "application/json")
      .end(function(result) {
        bot.reply(msg, result.body.source);
      });
		console.log('> ' + msg.sender.username + ' executed <' + cmd9 + '>')
	}
	if(content.startsWith(prefix + cmd10)) {
		bot.sendMessage(msg.channel, '\u200B' + suffix10);
		console.log('> ' + msg.sender.username + ' executed <' + cmd10 + '>')
	}
	if(content == prefix + cmd11) {
		bot.sendMessage(msg.channel, '\u200B' + "I'm used in " + bot.servers.length + ' servers, serving about ' + bot.users.length + ' users in ' + bot.channels.length + " channels.");
		console.log('> ' + msg.sender.username + ' executed <' + cmd11 + '>')
	}
	if(content.startsWith(prefix + cmd12)) {
		var itemArray = [];
		var id = parseInt(suffix12);
		try {
		itemArray.push('```diff');
		itemArray.push('!============================================================================!');
		itemArray.push(items.data.name[id]);
		itemArray.push(items.data.examine[id]);
		itemArray.push(items.data.price[id]);
		itemArray.push('!============================================================================!');
		itemArray.push('```');
		bot.sendMessage(msg.channel, itemArray.join('\n'))
		} catch (e) {
			bot.sendMessage(msg.channel, '\u200B' + "Sorry! It seems as this item doesn't exist in our database! Please make sure you use underscores instead of spaces!")
		}
		console.log('> ' + msg.sender.username + ' executed <' + cmd12 + '>')
	}
	if(content.startsWith(prefix + cmd13)) {
		var names = suffix13.split(" ");
	 var fname = names[0],
     sname = names.slice(1, names.length);
	if (suffix13.length > 0 && sname.length === 1 && msg.mentions.length === 0) { // Mentions kills the API
        unirest.get("https://love-calculator.p.mashape.com/getPercentage?fname=" + fname + "&sname=" + sname)
       .header("X-Mashape-Key", config.api.mashape)
       .header("Accept", "application/json")
	   .end(function(result) {
	  var msgArray = [];
	   msgArray.push(":heart_eyes: Love' is in the air, isn't it wonderful?");
	   msgArray.push(':anchor: Shipping ' +fname+ ' with ' + sname + '.');
	   msgArray.push(':lock: Success rate is about ' + result.body.percentage + "%, " + (result.body.result).toLowerCase());
	  bot.sendMessage(msg.channel, msgArray.join('\n'));
	 });
	} else { 
	bot.reply(msg, "You must type two names in order to ship someone! (Mentions don't work YET!)")
	}
	}
	if(content == prefix + cmd14) {
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
	
});	
PrelixBot.loginWithToken(config.login.token);
PrelixBot.on('ready', function() {
	console.log('> Success! Your bot is now online!');
	console.log('> Logged in as ' + bot.user.username + '#' + bot.user.discriminator + ', serving '  + bot.users.length + ' users in ' + bot.servers.length + ' servers!');
});
