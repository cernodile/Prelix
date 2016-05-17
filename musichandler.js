var config = require('./config.json');
var masterUser = config.perms.masterUser;
var vipUser = config.perms.vip;
var YT = require('ytdl-core');
var ytapi = require("youtube-api");

var musichandler = {
  "songRequest": {
    "process": (bot, msg, config, suffix) => {
      var server = msg.author.server.id;
      try {
      if(!bot.voiceConnection.playing && bot.voiceConnection) {
        var ytdl = YT(suffix, {
        quality: 140
      });
      ytdl.on('error', function() {
        console.log("> YTDL: error, most likely from undefined request.");
        return;
      });
      ytdl.on('end', function() {
  	    console.log("> YTDL: song most likely finished.");
      });
      ytapi.authenticate({
      type: 'key',
      key: config.api.youtube
      }, (err, info) => {
        if (err) {
          console.log(err);
        }
        if (info) {
          console.log(info);
        }
      });
      bot.voiceConnection.playRawStream(ytdl, {volume: 0.50, stereo: true}, function(err, str) {
        if (err) {
          bot.sendMessage(msg.channel, "**Uh oh!** This doesn't seem to work!");
        console.log(err);
        }
        if (str) {
          bot.sendMessage(msg.channel, 'Sucessfully requested ' + ytapi.authenticate.info + '.');  
        }
        str.on('end', function() {
          try {
            setTimeout(function() {
          bot.voiceConnection.destroy();
          bot.sendMessage(msg.channel, "Nobody has requested any new songs, destroying voice connection!");
            }, 10000);
            } catch(e) {
           console.log(e); 
          }
        });
      });
      } else if (bot.voiceConnection.playing && bot.voiceConnection) {
        bot.sendMessage(msg.channel, "I'm already playing a song! Try again later!");
        return;
      }
	   } catch(e) {
		    bot.sendMessage(msg.channel, "Unabled to resolve request, have you connected me to voice and requested **YouTube NON-EMBED LINK**?"); 
		    console.log(e);
	    }
    }
  },
  "joinVoice": {
    "process": (bot, msg, config) => {
      try {
			if (!bot.voiceConnection) {
		bot.joinVoiceChannel(msg.author.voiceChannel.id);
		bot.sendMessage(msg.channel, "Joined the voice channel which I believe you're in - **" + msg.author.voiceChannel.name + '** (\u200B<\u200B#\u200B' + msg.author.voiceChannel.id + '\u200B>)');
			} else {
				bot.sendMessage(msg.channel, "Sorry! I'm already used in a server!");
			}
		} catch(e) {
			bot.sendMessage(msg.channel, "Oops! It seems as there's something wrong!");
			console.log(e);
      }
    }
  },
  "leaveVoice": {
    "process": (bot, msg, config) => {
      try {
			if (bot.voiceConnection) {
		bot.voiceConnection.destroy();
		bot.sendMessage(msg.channel, 'Leaving voice channel!');
			} else {
				bot.sendMessage(msg.channel, "I can't leave what I'm not in.");
			}
		} catch(e) {
			bot.sendMessage(msg.channel, "Oops! It seems as there's something wrong!");
			console.log(e);
      }
    }
  },
}
}

exports.musichandler = musichandler;
