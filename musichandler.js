var config = require('./config.json');
var masterUser = config.perms.masterUser;
var vipUser = config.perms.vip;
var YT = require('ytdl-core');
var ytapi = require("youtube-api");

var musichandler = {
  "songRequest": {
    "process": (bot, msg, config, suffix) => {
      try {
      if(!bot.voiceConnection.playing) {
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
      bot.voiceConnection.playRawStream(ytdl, {volume: 0.50, stereo: true});
      bot.sendMessage(msg.channel, 'Requested ' + ytapi.authenticate.info + '.'); 
      console.log(ytapi.authenticate.info);
      } else if (bot.voiceConnection.playing) {
        bot.sendMessage(msg.channel, "I'm already playing a song! Try again later!");
        return;
      }
	   } catch(e) {
		    bot.sendMessage(msg.channel, "Oops! It seems as there's something wrong!");
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
  }
}

exports.musichandler = musichandler;