var YT = require('ytdl-core')
var ytapi = require('youtube-api')
var playlist0 = []

var musichandler = {
  'songRequest': {
    'process': (bot, msg, config, suffix) => {
      try {
        if (!(bot.voiceConnections[0].playing) && (bot.voiceConnections[0]) && (bot.voiceConnections[0].id === msg.author.voiceChannel.id) && (bot.voiceConnections[0].server.id === msg.channel.server.id)) {
          var ytdl = YT(suffix, {
            quality: 140
          })
          ytdl.on('error', function () {
            console.log('> YTDL:[0] error, most likely from undefined request.')
            return
          })
          ytdl.on('end', function () {
            console.log('> YTDL[0]: song most likely finished.')
          })
          ytapi.authenticate({
            type: 'key',
            key: config.api.youtube
          }, (err, info) => {
            if (err) {
              console.log(err)
            }
            if (info) {
              console.log(info)
            }
          })
          YT.getInfo(suffix, function (err, info) {
            if (err) {
              bot.reply(msg, 'Invalid info recieved!')
              return
            }
            if (info) {
              bot.startTyping()
              if (info.length_seconds > 900) { // 15 minutes translated into seconds
                bot.reply(msg, 'too long, videos can be max 15 minutes long!')
                return
              }
              console.log(info.length_seconds)
              var mins = (Math.round(info.length_seconds / 60))
              var seconds = (Math.round(info.length_seconds % 60))
              bot.sendMessage(msg.channel, '`[0m 0s/' + mins + 'm ' + seconds + 's]` Sucessfully requested **' + info.title + '**, uploaded by **' + info.author + '**.')
              bot.stopTyping()
            }
            bot.voiceConnections[0].playRawStream(ytdl, {volume: 0.50, stereo: true}, function (err, str) {
              if (err) {
                bot.sendMessage(msg.channel, "**Uh oh!** This doesn't seem to work!")
                console.log(err)
              }
              if (str) {
              }
              str.on('end', function () {
                try {
                  setTimeout(function () {
                    try {
                      if (!(bot.voiceConnections[0].playing) || bot.voiceConnections[0] || playlist0.length === 0) {
                        try {
                          bot.voiceConnections[0].destroy()
                          bot.sendMessage(msg.channel, 'Nobody has requested any new songs, destroying voice connection!')
                        } catch (e) {
                          console.log(e)
                        }
                      } else if (playlist0.length > 0) {
                        var ytdl2 = YT(playlist0[1], {
                          quality: 140
                        })
                        bot.voiceConnections[0].playRawStream(ytdl2, {volume: 0.50, stereo: true}, function (err, str) {
                          if (err) {
                            console.log(err)
                          }
                          if (str) {
                            bot.sendMessage(msg.channel, 'Playing next song in queue.')
                          }
                        })
                      } else {
                        console.log('> Error! Voiceconnection[0]')
                      }
                    } catch (e) {
                      console.log('> ERRORED! voiceConnection[0] instance has encountered an issue!')
                    }
                  }, 5000)
                } catch (e) {
                  console.log(e)
                }
              })
            })
          })
        } else if ((bot.voiceConnections[0].server.id !== msg.channel.server.id) && (bot.voiceConnections[0].id !== msg.author.voiceChannel.id)) {
          bot.sendMessage(msg.channel, 'Please join the voice channel before requesting me anything!')
        } else if ((bot.voiceConnections[0].playing) && (bot.voiceConnections[0]) && (bot.voiceConnections[0].id === msg.author.voiceChannel.id) && (bot.voiceConnections[0].server.id === msg.channel.server.id)) {
          if (playlist0.length < 6) {
            playlist0.push(suffix)
            bot.sendMessage(msg.channel, 'Added the link to the queue!')
          } else {
            bot.sendMessage(msg.channel, "I'm already playing a song! Try again later!")
          }
          return
        } else if (!(bot.voiceConnections[1].playing) && (bot.voiceConnections[1]) && (bot.voiceConnections[1].id === msg.author.voiceChannel.id) && (bot.voiceConnections[1].server.id === msg.channel.server.id)) {
          ytdl = YT(suffix, {
            quality: 140
          })
          ytdl.on('error', function () {
            console.log('> YTDL[1]: error, most likely from undefined request.')
            return
          })
          ytdl.on('end', function () {
            console.log('> YTDL[1]: song most likely finished.')
          })
          ytapi.authenticate({
            type: 'key',
            key: config.api.youtube
          }, (err, info) => {
            if (err) {
              console.log(err)
            }
            if (info) {
              console.log(info)
            }
          })
          YT.getInfo(suffix, function (err, info) {
            if (err) {
              bot.reply(msg, 'Invalid info recieved!')
              return
            }
            if (info) {
              bot.startTyping()
              if (info.length_seconds > 900) { // 15 minutes translated into seconds
                bot.reply(msg, 'too long, videos can be max 15 minutes long!')
                return
              }
              console.log(info.length_seconds)
              var mins = (Math.round(info.length_seconds / 60))
              var seconds = (Math.round(info.length_seconds % 60))
              bot.sendMessage(msg.channel, '`[0m 0s/' + mins + 'm ' + seconds + 's]` Sucessfully requested **' + info.title + '**, uploaded by **' + info.author + '**.')
              bot.stopTyping()
            }
            bot.voiceConnections[1].playRawStream(ytdl, {volume: 0.50, stereo: true}, function (err, str) {
              if (err) {
                bot.sendMessage(msg.channel, "**Uh oh!** This doesn't seem to work!")
                console.log(err)
              }
              if (str) {
              }
              str.on('end', function () {
                try {
                  setTimeout(function () {
                    try {
                      if (!(bot.voiceConnections[1].playing) || bot.voiceConnections[1]) {
                        bot.voiceConnections[1].destroy()
                        bot.sendMessage(msg.channel, 'Nobody has requested any new songs, destroying voice connection!')
                      } else {
                        console.log('> ERRORED! voiceConnection[1] instance has encountered an issue!')
                      }
                    } catch (e) {
                      bot.voiceConnections[0].destroy()
                      bot.sendMessage(msg.channel, 'Nobody has requested any new songs, destroying voice connection!')
                    }
                  }, 10000)
                } catch (e) {
                  console.log(e)
                }
              })
            })
          })
        } else if ((bot.voiceConnections[1].playing) && (bot.voiceConnections[1]) && (bot.voiceConnections[1].id === msg.author.voiceChannel.id) && (bot.voiceConnections[1].server.id === msg.channel.server.id)) {
          bot.sendMessage(msg.channel, "I'm already playing a song! Try again later!")
          return
        } else if (!(bot.voiceConnections[2].playing) && (bot.voiceConnections[2]) && (bot.voiceConnections[2].id === msg.author.voiceChannel.id) && (bot.voiceConnections[2].server.id === msg.channel.server.id)) {
          ytdl = YT(suffix, {
            quality: 140
          })
          ytdl.on('error', function () {
            console.log('> YTDL[2]: error, most likely from undefined request.')
            return
          })
          ytdl.on('end', function () {
            console.log('> YTDL[2]: song most likely finished.')
          })
          ytapi.authenticate({
            type: 'key',
            key: config.api.youtube
          }, (err, info) => {
            if (err) {
              console.log(err)
            }
            if (info) {
              console.log(info)
            }
          })
          YT.getInfo(suffix, function (err, info) {
            if (err) {
              bot.reply(msg, 'Invalid info recieved!')
              return
            }
            if (info) {
              bot.startTyping()
              if (info.length_seconds > 900) { // 15 minutes translated into seconds
                bot.reply(msg, 'too long, videos can be max 15 minutes long!')
                return
              }
              console.log(info.length_seconds)
              var mins = (Math.round(info.length_seconds / 60))
              var seconds = (Math.round(info.length_seconds % 60))
              bot.sendMessage(msg.channel, '`[0m 0s/' + mins + 'm ' + seconds + 's]` Sucessfully requested **' + info.title + '**, uploaded by **' + info.author + '**.')
              bot.stopTyping()
            }
            bot.voiceConnections[2].playRawStream(ytdl, {volume: 0.50, stereo: true}, function (err, str) {
              if (err) {
                bot.sendMessage(msg.channel, "**Uh oh!** This doesn't seem to work!")
                console.log(err)
              }
              if (str) {
              }
              str.on('end', function () {
                try {
                  setTimeout(function () {
                    try {
                      if (!(bot.voiceConnections[2].playing) || bot.voiceConnections[2]) {
                        bot.voiceConnections[2].destroy()
                        bot.sendMessage(msg.channel, 'Nobody has requested any new songs, destroying voice connection!')
                      } else {
                        console.log('> ERRORED! voiceConnection[1] instance has encountered an issue!')
                      }
                    } catch (e) {
                      try {
                        bot.voiceConnections[1].destroy()
                        bot.sendMessage(msg.channel, 'Nobody has requested any new songs, destroying voice connection!')
                      } catch (e) {
                        bot.voiceConnections[0].destroy()
                        bot.sendMessage(msg.channel, 'Nobody has requested any new songs, destroying voice connection!')
                      }
                    }
                  }, 10000)
                } catch (e) {
                  console.log(e)
                }
              })
            })
          })
        } else if ((bot.voiceConnections[2].playing) && (bot.voiceConnections[2]) && (bot.voiceConnections[2].id === msg.author.voiceChannel.id) && (bot.voiceConnections[2].server.id === msg.channel.server.id)) {
          bot.sendMessage(msg.channel, "I'm already playing a song! Try again later!")
          return
        }
      } catch (e) {
        bot.sendMessage(msg.channel, 'Unable to resolve request, are you in the same voice channel/server? Requesting **YOUTUBE LINKS**?')
        console.log(e)
      }
    }
  },
  'skipSong': {
    'process': (bot, msg, config) => {
      /* try {
        if(!bot.voiceConnections[0]) {
          bot.sendMessage(msg.channel, "What are you even trying to skip when I'm not in the voice channel! 😂")
        } else if(bot.voiceConnections[0] && bot.voiceConnections[0].playing) {
          bot.sendMessage(msg.channel, "Skipping...")
          bot.voiceConnections[0].stopPlaying()
        } else if(bot.voiceConnections[0] && !bot.voiceConnections[0].playing) {
          bot.sendMessage(msg.channel, "Do you really expect me to skip nothing? 😂")
        } else {
          bot.sendMessage(msg.channel, "Something went wrong!")
        }
      } catch (e) {
        console.log(e)
      }*/
      bot.sendMessage(msg.channel, 'Temporarily unavailable service!')
    }
  },
  'joinVoice': {
    'process': (bot, msg, config) => {
      try {
        if (!(bot.voiceConnections[0])) {
          console.log('> Created voiceConnections[0] instance.')
          bot.joinVoiceChannel(msg.author.voiceChannel.id)
          bot.sendMessage(msg.channel, "Joined the voice channel which I believe you're in - **" + msg.author.voiceChannel.name + '** (\u200B<\u200B#\u200B' + msg.author.voiceChannel.id + '\u200B>)')
        } else if (!(bot.voiceConnections[0].id === msg.author.voiceChannel.id) && !(bot.voiceConnections[1])) {
          console.log('> Created voiceConnections[1] instance.')
          bot.joinVoiceChannel(msg.author.voiceChannel.id)
          bot.sendMessage(msg.channel, "Joined the voice channel which I believe you're in - **" + msg.author.voiceChannel.name + '** (\u200B<\u200B#\u200B' + msg.author.voiceChannel.id + '\u200B>)')
        } else if (!(bot.voiceConnections[0].id === msg.author.voiceChannel.id) && !(bot.voiceConnections[1].id === msg.author.voiceChannel.id) && !(bot.voiceConnections[2])) {
          console.log('> Created voiceConnections[2] instance.')
          bot.joinVoiceChannel(msg.author.voiceChannel.id)
          bot.sendMessage(msg.channel, "Joined the voice channel which I believe you're in - **" + msg.author.voiceChannel.name + '** (\u200B<\u200B#\u200B' + msg.author.voiceChannel.id + '\u200B>)')
        } else {
          bot.sendMessage(msg.channel, "Sorry! I'm limited to three voice connection instances only!")
        }
      } catch (e) {
        bot.sendMessage(msg.channel, "Oops! It seems as there's something wrong!")
        console.log(e)
      }
    }
  },
  'leaveVoice': {
    'process': (bot, msg, config) => {
      try {
        if (bot.voiceConnection) {
          bot.voiceConnection.destroy()
          bot.sendMessage(msg.channel, 'Leaving voice channel!')
        } else {
          bot.sendMessage(msg.channel, "I can't leave what I'm not in.")
        }
      } catch (e) {
        bot.sendMessage(msg.channel, "Oops! It seems as there's something wrong!")
        console.log(e)
      }
    }
  }
}

exports.musichandler = musichandler
