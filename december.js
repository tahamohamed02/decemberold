require('events').EventEmitter.defaultMaxListeners = 100;
/*
const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://december---bot.glitch.me/`);
}, 280000);
*/

const Discord = require("discord.js");
const client = new Discord.Client();
const moment = require("moment");
const zalgo = require("zalgolize");
const math = require("math-expression-evaluator");
const figlet = require("figlet");
const fs = require("fs");
//const Canvas = require("canvas");
const jimp = require("jimp");
const ytdl = require('ytdl-core');
const getYoutubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyChx1xksHRy1C-M5YdbJ3eJwUbTvNHSUSA"); //يتغير كل مده 
const SQLite = require('sqlite');  
 const path = require('path');
const prefix = ".";


////

client.on('message', msg => {
                        let args = msg.content.split(" ").slice(1).join(" ")
if (msg.content.split(" ")[0].toLowerCase() === "-createcolors") {
    if(!args) return msg.channel.send('**Please type number of colors**  :1234: ');
             if (!msg.member.hasPermission('MANAGE_ROLES')) return;
              msg.channel.send(`** Done Colors Was Successful Created ${args}**`);
                  setInterval(function(){})
                    let count = 0;
                    let ecount = 0;
          for(let x = 1; x < `${parseInt(args)+1}`; x++){
            msg.guild.createRole({name:x,
              color: 'RANDOM'})
              }
            }
});

//Music
const Client = new Discord.Client({ disableEveryone: true});
   


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
let cmds = {
  play: { cmd: 'play', a: ['p'] },
  skip: { cmd: 'skip', a: ['s'] },
  stop: { cmd: 'stop' },
  pause: { cmd: 'pause' },
  resume: {cmd: 'resume'},
  volume: { cmd: 'volume', a: ['vol'] },
  queue: { cmd: 'queue'},
  nowplaying: { cmd: 'nowplaying', a: ['np'] }
};



Object.keys(cmds).forEach(key => {
var value = cmds[key];
  var command = value.cmd;
  client.commands.set(command, command);

  if(value.a) {
    value.a.forEach(alias => {
    client.aliases.set(alias, command)
  })
  }
})




let active = new Map();



client.on('message', async msg => {

    if(msg.author.bot) return undefined;
  if(!msg.content.startsWith(prefix)) return undefined;

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();

    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';

    let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))

    let s;

    if(cmd === 'play') {
              if(blacklist[client.user.id + msg.author.id]) return msg.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
        const voiceChannel = msg.member.voiceChannel;
        if(!voiceChannel) return msg.channel.send(`:slight_smile: ** you are not in a voice channel. ** `);
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if(!permissions.has('CONNECT')) {
            return msg.channel.send(`:no_mouth: **I can't join in this voice channel.**`);
        }

        if(!permissions.has('SPEAK')) {
            return msg.channel.send(`:no_mouth: **I cann'ot Speak in this voice chnnel.**`);
        }
      voiceChannel.join()
if(!args[0]) return msg.channel.send(`
:notes: **Songs Command.** 

\`${prefix}play <SONG NAME>\` to play a song. 
\`${prefix}play <URL>\` to play a song, or stream via a link. `);
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();

			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send();//(`${playlist.title} Added to December Queue.`);
		} else {
			try {

				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(args, 1);

					// eslint-disable-next-line max-depth
					var video = await youtube.getVideoByID(videos[0].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send(':no_mouth: **I can\'t find anything.**');
				}
			}

			return handleVideo(video, msg, voiceChannel);
		}

        async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = active.get(msg.guild.id);



let hrs = video.duration.hours > 0 ? (video.duration.hours > 9 ? `${video.duration.hours}:` : `0${video.duration.hours}:`) : '';
let min = video.duration.minutes > 9 ? `${video.duration.minutes}:` : `0${video.duration.minutes}:`;
let sec = video.duration.seconds > 9 ? `${video.duration.seconds}` : `0${video.duration.seconds}`;
let dur = `${hrs}${min}${sec}`

  let ms = video.durationSeconds * 1000;

	const song = {
		id: video.id,
		title: video.title,
    duration: dur,
    msDur: ms,
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 100,
      requester: msg.author,
			playing: true,
      repeating: false
		};
		active.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			active.delete(msg.guild.id);
			return msg.channel.send(`:no_mouth: **I cann'ot join this voice channel.**`);
		}
	} else {
		serverQueue.songs.push(song);

		if (playlist) return undefined;
		if(!args) return msg.channel.send(':slight_smile: **nothing.**');
		else return msg.channel.send(':watch: Searching... [`' + args + '`]').then(m => {
      setTimeout(() => {//:watch: Loading... [let]
        m.edit(`:notes: Added **${song.title}**`  + ' `' + song.duration + '` to December Queue List .');
      }, 750)
    }) 
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = active.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		active.delete(guild.id);
		return;
	}
	//console.log(serverQueue.songs);
  if(serverQueue.repeating) {
	console.log('Repeating');
  } else {
	serverQueue.textChannel.send(':notes: Added ** ' + song.title + '** `' + song.duration + '` to December Queue List .');
}
	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			//if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			//else console.log(reason);
      if(serverQueue.repeating) return play(guild, serverQueue.songs[0])
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);


}
} else if(cmd === 'stop') {
          if(blacklist[client.user.id + msg.author.id]) return msg.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
        if(msg.guild.me.voiceChannel !== msg.member.voiceChannel) return msg.channel.send(`:no_mouth: You are not in the **${msg.guild.me.voiceChannel.name}** of this voice channel.`)
        let queue = active.get(msg.guild.id);
        if(queue.repeating) return msg.channel.send(':slight_smile: **You cannot stopped songs. because repeat mode is on.**')
        queue.songs = [];
        queue.connection.dispatcher.end();
        return msg.channel.send(':slight_smile: ** all music has been stopped, also playlist is cleared.**');

    } else if(cmd === 'skip') {
        if(blacklist[client.user.id + msg.author.id]) return msg.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)

      let vCh = msg.member.voiceChannel;

      let queue = active.get(msg.guild.id);

        if(!vCh) return msg.channel.send(':slight_smile: **You are not in the correct voice channel.**');

        if(!queue) return msg.channel.send(':slight_smile: ** no songs playing to skip .**');

        if(queue.repeating) return msg.channel.send(':slight_smile: **You cannot skip because repeat mode is on.**');

        let req = vCh.members.size - 1;

        if(req == 1) {
            msg.channel.send('**:notes: Skipped **  ');
            return queue.connection.dispatcher.end('Skipping ..')
        }

        if(!queue.votes) queue.votes = [];

        if(queue.votes.includes(msg.member.id)) return msg.say(`:slight_smile: **You are already voting for skip, please wait .** ${queue.votes.length}/${req}`);

        queue.votes.push(msg.member.id);

        if(queue.votes.length >= req) {
            msg.channel.send(`**:notes: Skipped **`);

            delete queue.votes;

            return queue.connection.dispatcher.end('Skipping ..')
        }

        msg.channel.send(`:slight_smile: **You voted for skip, wait ${queue.votes.length}/${req} .**`)

    } else if(cmd === 'pause') {
        if(blacklist[client.user.id + msg.author.id]) return msg.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)

      let queue = active.get(msg.guild.id);

        let vCh = msg.member.voiceChannel;

        if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send(`:slight_smile: **You are not in the correct voice channel.**`);

        if(!queue) {
            return msg.channel.send(':slight_smile: **No songs playing to paused.**')
        }

        if(!queue.playing) return msg.channel.send(':slight_smile: **No songs playing to paused.**')

        let disp = queue.connection.dispatcher;

        disp.pause('Pausing..')

        queue.playing = false;

        msg.channel.send(':slight_smile: **Paused.** ')

    } else if (cmd === 'resume') {
        if(blacklist[client.user.id + msg.author.id]) return msg.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)

      let queue = active.get(msg.guild.id);

        let vCh = msg.member.voiceChannel;

        if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send(`:slight_smile: **You are not in the correct voice channel.**`);

        if(!queue) return msg.channel.send(':slight_smile: **No songs paused to resume.**')

        if(queue.playing) return msg.channel.send(':slight_smile: **No songs paused to resume.**')

        let disp = queue.connection.dispatcher;

        disp.resume('Resuming..')

        queue.playing = true;

        msg.channel.send(':slight_smile: **Resumed.**')

    } else if(cmd === 'volume') {
        if(blacklist[client.user.id + msg.author.id]) return msg.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)

      let queue = active.get(msg.guild.id);

      if(!queue || !queue.songs) return msg.channel.send(':slight_smile: **There are no songs currently playing to changed volume .**');

      let vCh = msg.member.voiceChannel;

      if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send(':slight_smile: **You are not in the correct voice channel.**');

      let disp = queue.connection.dispatcher;

      if(isNaN(args[0])) return msg.channel.send(`:sound: **Volume level now is** ${queue.volume}`);

      if(parseInt(args[0]) > 150) return msg.channel.send(':slight_smile: **You cannot increase the volume by more than 150 .**')
//:speaker: Volume changed from 20 to 20 ! The volume has been changed from ${queue.volume} to ${args[0]}
      msg.channel.send(':loud_sound: **Volume changed from** `' + queue.volume + '` **to** `' + args[0] + '` .');

      queue.volume = args[0];

      disp.setVolumeLogarithmic(queue.volume / 150);

    } else if (cmd === 'queue') {
        if(blacklist[client.user.id + msg.author.id]) return msg.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)

      let queue = active.get(msg.guild.id);

      if(!queue) return msg.channel.send(':no_mouth: **There are no songs currently playing .**');

      let embed = new Discord.RichEmbed()
      let text = '';
      for (var i = 0; i < queue.songs.length; i++) {
          let num;

        text += ` **${queue.songs[i].title}** [${queue.songs[i].duration}]\n`
      }
      embed.setDescription(`**Music playlist** . \n\n ${text}`)
      msg.channel.send(embed)

    } else if(cmd === 'repeat') {
        if(blacklist[client.user.id + msg.author.id]) return msg.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)

      let vCh = msg.member.voiceChannel;

      if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send('You are not in my voice channel');

      let queue = active.get(msg.guild.id);

      if(!queue || !queue.songs) return msg.channel.send('There is no music playing to repeat it.');

      if(queue.repeating) {
        queue.repeating = false;
        return msg.channel.send(':red_circle: **Repeating** __Off__');
      } else {
        queue.repeating = true;
        return msg.channel.send(':green_circle: **Repeating** __On__');
      }


} else if(cmd ===  'nowplaying') {
        if(blacklist[client.user.id + msg.author.id]) return msg.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)

      let q = active.get(msg.guild.id);

      let now = npMsg(q)

      msg.channel.send(now.mes, now.embed)
      .then(me => {
        setInterval(() => {
          let noww = npMsg(q)
          me.edit(noww.mes, noww.embed)
        }, 5000)
      })
      function npMsg(queue) {

        let m = !queue || !queue.songs[0] ? '😶 **nothing Currently,**' : "Music is playing now..."

      const eb = new Discord.RichEmbed();

      eb.setColor(msg.guild.me.displayHexColor)

      if(!queue || !queue.songs[0]){

        eb.setTitle("😶 **nothing Currently,**");
            eb.setDescription("\u23F9 "+bar(-1)+" "+volumeIcon(!queue?100:queue.volume));
      } else if(queue.songs) {

        if(queue.requester) {

          let u = msg.guild.members.get(queue.requester.id);

          if(!u)
            eb.setAuthor('Unkown ID:' + queue.requester.id + '')
          else
            eb.setAuthor(u.user.tag, u.user.displayAvatarURL)
        }

        if(queue.songs[0]) {
        try {
            eb.setTitle(queue.songs[0].title);
            eb.setURL(queue.songs[0].url);
        } catch (e) {
          eb.setTitle(queue.songs[0].title);
        }
}
        eb.setDescription(embedFormat(queue))

      }

      return {
        mes: m,
        embed: eb
      }

    }

      function embedFormat(queue) {

        if(!queue || !queue.songs) {
          return "No music playing\n\u23F9 "+bar(-1)+" "+volumeIcon(100);
        } else if(!queue.playing) {
          return "No music playing\n\u23F9 "+bar(-1)+" "+volumeIcon(queue.volume);
        } else {

          let progress = (queue.connection.dispatcher.time / queue.songs[0].msDur);
          let prog = bar(progress);
          let volIcon = volumeIcon(queue.volume);
          let playIcon = (queue.connection.dispatcher.paused ? "\u23F8" : "\u25B6")
          let dura = queue.songs[0].duration;

          return playIcon + ' ' + prog + ' `[' + formatTime(queue.connection.dispatcher.time) + '/' + dura + ']`' + volIcon;


        }

      }

      function formatTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return (hours > 0 ? hours + ":" : "") + minutes + ":" + seconds;
}

      function bar(precent) {

        var str = '';

        for (var i = 0; i < 12; i++) {

          let pre = precent
          let res = pre * 12;

          res = parseInt(res)

          if(i == res){
            str+="\uD83D\uDD18";
          }
          else {
            str+="▬";
          }
        }

        return str;

      }

      function volumeIcon(volume) {

        if(volume == 0)
           return "\uD83D\uDD07";
       if(volume < 30)
           return "\uD83D\uDD08";
       if(volume < 70)
           return "\uD83D\uDD09";
       return "\uD83D\uDD0A";

      }

    }

});

/////////////////////////////////////////////////////////////////////////////////////////////////////
client.on("ready", () => {
  console.log("im Active");
  console.log(`Users Size ${client.users.size} `);
  console.log(`Guilds Size ${client.guilds.size} `);
  console.log("Let's go");
});



//////////////////////////////////////// LOG CODE ////////////////////////////////////////
const log = JSON.parse(fs.readFileSync("./decemberlog.json", "utf8"));
client.on("message", message => {
  if (!message.channel.guild) return;

  let room = message.content.split(" ").slice(1);
  let findroom = message.guild.channels.find("name", `${room}`);
  if (message.content.startsWith(prefix + "log")) {
            if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.channel.guild) return message.channel.send("");
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send("");
    if (!room)
      return message.channel.send(
        ":no_mouth: **Please Type The Channel Name**"
      );
    if (!findroom)
      return message.channel.send(":no_mouth: ** I do not see this room ** ");
    let embed = new Discord.RichEmbed()
      .setTitle("**Done Create Channel Log successfully**")
      .addField("in a channel :", `${room}`)
      .addField("Done By :", `${message.author}`)
      .setThumbnail(message.author.avatarURL)
      .setFooter(`${client.user.username}`);
    message.channel.sendEmbed(embed);
    log[message.guild.id] = {
      channel: room,
      onoff: "On"
    };
    fs.writeFile("./decemberlog.json", JSON.stringify(log), err => {
      if (err) console.error(err);
    });
  }
});

client.on("message", message => {
  if (message.content.startsWith(prefix + "toggle-log")) {
            if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send("");
    if (!log[message.guild.id])
      log[message.guild.id] = {
        onoff: "Off"
      };
    if (log[message.guild.id].onoff === "Off")
      return [
        message.channel.send(`**:green_circle: log Is __On__ !**`),
        (log[message.guild.id].onoff = "On")
      ];
    if (log[message.guild.id].onoff === "On")
      return [
        message.channel.send(`**:red_circle: log Is __Off__ **`),
        (log[message.guild.id].onoff = "Off")
      ];
    fs.writeFile("./decemberlog.json", JSON.stringify(log), err => {
      if (err)
        console.error(err).catch(err => {
          console.error(err);
        });
    });
  }
});

client.on("messageDelete", message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (!message.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES"))
    return;
  if (!log[message.guild.id])
    log[message.guild.id] = {
      onoff: "Off"
    };
  if (log[message.guild.id].onoff === "Off") return;
  var logChannel = message.guild.channels.find(
    c => c.name === `${log[message.guild.id].channel}`
  );
  if (!logChannel) return;

  let messageDelete = new Discord.RichEmbed()
    .setTitle("**DELETE MESSAGE**")
    .setColor("RED")
    .setThumbnail(message.author.avatarURL)
    .setDescription(
      `:wastebasket: ** Done Delete Message ** 
**In Channel ** ${message.channel.name}
**Sent by . . .** <@${message.author.id}>
 **Message:**\n\`\`\`${message}\`\`\``
    )
    .setTimestamp()
    .setFooter(message.guild.name, message.guild.iconURL);

  logChannel.send(messageDelete);
});
client.on("messageUpdate", (oldMessage, newMessage) => {
  if (oldMessage.author.bot) return;
  if (!oldMessage.channel.type === "dm") return;
  if (!oldMessage.guild.member(client.user).hasPermission("EMBED_LINKS"))
    return;
  if (!oldMessage.guild.member(client.user).hasPermission("MANAGE_MESSAGES"))
    return;
  if (!log[oldMessage.guild.id])
    log[oldMessage.guild.id] = {
      onoff: "Off"
    };
  if (log[oldMessage.guild.id].onoff === "Off") return;
  var logChannel = oldMessage.guild.channels.find(
    c => c.name === `${log[oldMessage.guild.id].channel}`
  );
  if (!logChannel) return;

  if (oldMessage.content.startsWith("https://")) return;

  let messageUpdate = new Discord.RichEmbed()
    .setTitle("**MESSAGE EDIT**")
    .setThumbnail(oldMessage.author.avatarURL)
    .setColor("#fa0000")
    .setDescription(
      ` ** Done Edit Message .**
** in Channel ** \`${oldMessage.channel.name}\`
** Sent By . . . ** <@${oldMessage.author.id}>
**Old Message:**
\`\`\`${oldMessage}\`\`\`\n
**New Message:**
\`\`\`${newMessage}\`\`\``
    )
    .setTimestamp()
    .setFooter(oldMessage.guild.name, oldMessage.guild.iconURL);

  logChannel.send(messageUpdate);
});

client.on("roleCreate", role => {
  if (!role.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!role.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
  if (!log[role.guild.id])
    log[role.guild.id] = {
      onoff: "Off"
    };
  if (log[role.guild.id].onoff === "Off") return;
  var logChannel = role.guild.channels.find(
    c => c.name === `${log[role.guild.id].channel}`
  );
  if (!logChannel) return;

  role.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL;

    let roleCreate = new Discord.RichEmbed()
      .setTitle("**CREATE-ROLE**")
      .setThumbnail(userAvatar)
      .setDescription(
        ` **Done Create Role . !
** **Name Role** \`${role.name}\`
** Done By . ** <@${userID}> `
      )
      .setColor("#1e00fa")
      .setTimestamp()
      .setFooter(role.guild.name, role.guild.iconURL);

    logChannel.send(roleCreate);
  });
});
client.on("roleDelete", role => {
  if (!role.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!role.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
  if (!log[role.guild.id])
    log[role.guild.id] = {
      onoff: "Off"
    };
  if (log[role.guild.id].onoff === "Off") return;
  var logChannel = role.guild.channels.find(
    c => c.name === `${log[role.guild.id].channel}`
  );
  if (!logChannel) return;

  role.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL;

    let roleDelete = new Discord.RichEmbed()
      .setTitle("**DELETE ROLE**")
      .setThumbnail(userAvatar)
      .setDescription(
        ` ** Done Delete Role . !**
**Name Role** \`${role.name}\`
**Done By.** <@${userID}> `
      )
      .setColor("RED")
      .setTimestamp()
      .setFooter(role.guild.name, role.guild.iconURL);

    logChannel.send(roleDelete);
  });
});

client.on("roleUpdate", (oldRole, newRole) => {
  if (!oldRole.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!oldRole.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG"))
    return;
  if (!log[oldRole.guild.id])
    log[oldRole.guild.id] = {
      onoff: "Off"
    };
  if (log[oldRole.guild.id].onoff === "Off") return;
  var logChannel = oldRole.guild.channels.find(
    c => c.name === `${log[oldRole.guild.id].channel}`
  );
  if (!logChannel) return;

  oldRole.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL;

    if (oldRole.name !== newRole.name) {
      if (log[oldRole.guild.id].onoff === "Off") return;
      let roleUpdateName = new Discord.RichEmbed()
        .setTitle("**NAME ROLE UPTADE**")
        .setThumbnail(userAvatar)
        .setColor("BLUE")
        .setDescription(
          ` **Uptade Name Role . ! **

**Old Name:** \`${oldRole.name}\`
**New Name:** \`${newRole.name}\`

**Done By.** <@${userID}> `
        )
        .setTimestamp()
        .setFooter(oldRole.guild.name, oldRole.guild.iconURL);

      logChannel.send(roleUpdateName);
    }
    if (oldRole.hexColor !== newRole.hexColor) {
      if (oldRole.hexColor === "#000000") {
        var oldColor = "`Default`";
      } else {
        var oldColor = oldRole.hexColor;
      }
      if (newRole.hexColor === "#000000") {
        var newColor = "`Default`";
      } else {
        var newColor = newRole.hexColor;
      }
      if (log[oldRole.guild.id].onoff === "Off") return;
      let roleUpdateColor = new Discord.RichEmbed()
        .setTitle("**COLOR ROLE UPTADE**")
        .setThumbnail(userAvatar)
        .setColor("BLUE")
        .setDescription(
          ` **Uptade Color Role . ! **

­­­­­­­­­­­­­­­­­­­­­­­** Role Name  \`${oldRole.name}\`**

**Old Color:** ${oldColor}
**New Color:** ${newColor}

** Done By.** <@${userID}>
`
        )
        .setTimestamp()
        .setFooter(oldRole.guild.name, oldRole.guild.iconURL);

      logChannel.send(roleUpdateColor);
    }
  });
});

client.on("channelCreate", channel => {
  if (!channel.guild) return;
  if (!channel.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!channel.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG"))
    return;
  if (!log[channel.guild.id])
    log[channel.guild.id] = {
      onoff: "Off"
    };
  if (log[channel.guild.id].onoff === "Off") return;
  var logChannel = channel.guild.channels.find(
    c => c.name === `${log[channel.guild.id].channel}`
  );
  if (!logChannel) return;

  if (channel.type === "text") {
    var roomType = "Text";
  } else if (channel.type === "voice") {
    var roomType = "Voice";
  } else if (channel.type === "category") {
    var roomType = "Category";
  }

  channel.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL;

    let channelCreate = new Discord.RichEmbed()
      .setTitle("**CREATE-CHANNEL**")
      .setThumbnail(userAvatar)
      .setDescription(
        ` **Done Create Channel **

** Name Channel ** \`${channel.name}\`
** Done by. ** <@${userID}>

`
      )

      .setColor("GREEN")
      .setTimestamp()
      .setFooter(channel.guild.name, channel.guild.iconURL);

    logChannel.send(channelCreate);
  });
});
client.on("channelDelete", channel => {
  if (!channel.guild) return;
  if (!channel.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!channel.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG"))
    return;
  if (!log[channel.guild.id])
    log[channel.guild.id] = {
      onoff: "Off"
    };
  if (log[channel.guild.id].onoff === "Off") return;
  var logChannel = channel.guild.channels.find(
    c => c.name === `${log[channel.guild.id].channel}`
  );
  if (!logChannel) return;

  if (channel.type === "text") {
    var roomType = "Text";
  } else if (channel.type === "voice") {
    var roomType = "Voice";
  } else if (channel.type === "category") {
    var roomType = "Category";
  }

  channel.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL;

    let channelDelete = new Discord.RichEmbed()
      .setTitle("**DELETE-CHANNEL**")
      .setThumbnail(userAvatar)
      .setDescription(
        ` ** Done Delete Channel .! ** 

** Name Channel ** \`${channel.name}\`
** Done By.** <@${userID}>

`
      )
      .setColor("RED")
      .setTimestamp()
      .setFooter(channel.guild.name, channel.guild.iconURL);

    logChannel.send(channelDelete);
  });
});
client.on("channelUpdate", (oldChannel, newChannel) => {
  if (!oldChannel.guild) return;
  if (!log[oldChannel.guild.id])
    log[oldChannel.guild.id] = {
      onoff: "Off"
    };
  if (log[oldChannel.guild.id].onoff === "Off") return;
  var logChannel = oldChannel.guild.channels.find(
    c => c.name === `${log[oldChannel.guild.id].channel}`
  );
  if (!logChannel) return;

  if (oldChannel.type === "text") {
    var channelType = "Text";
  } else if (oldChannel.type === "voice") {
    var channelType = "Voice";
  } else if (oldChannel.type === "category") {
    var channelType = "Category";
  }

  oldChannel.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL;

    if (oldChannel.name !== newChannel.name) {
      let newName = new Discord.RichEmbed()
        .setTitle("**EDIT CHANNEL**")
        .setThumbnail(userAvatar)
        .setColor("BLUE")
        .setDescription(
          `** Edit Name Chanel .!**

**Old Name** \`${oldChannel.name}\`
**New Name** \`${newChannel.name}\`

** Done By. ** <@${userID}>

`
        )
        .setTimestamp()
        .setFooter(oldChannel.guild.name, oldChannel.guild.iconURL);
      logChannel.send(newName);
    }
  });
});

client.on("guildBanAdd", (guild, user) => {
  if (!guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
  if (!log[user.guild.id])
    log[guild.guild.id] = {
      onoff: "Off"
    };
  if (log[user.guild.id].onoff === "Off") return;
  var logChannel = guild.channels.find(
    c => c.name === `${log[guild.guild.id].channel}`
  );
  if (!logChannel) return;

  guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL;

    if (userID === client.user.id) return;

    let banInfo = new Discord.RichEmbed()
      .setTitle("**BANNED**")
      .setThumbnail(userAvatar)
      .setColor("#fd0000")
      .setDescription(
        `** Done Banned Member From The server .! ** 

** User Banned ** ${user.username}
**Done By . ** <@${userID}>

`
      )
      .setTimestamp()
      .setFooter(guild.name, guild.iconURL);

    logChannel.send(banInfo);
  });
});
client.on("guildBanRemove", (guild, user) => {
  if (!guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
  if (!log[guild.guild.id])
    log[guild.guild.id] = {
      onoff: "Off"
    };
  if (log[guild.guild.id].onoff === "Off") return;
  var logChannel = guild.channels.find(
    c => c.name === `${log[guild.guild.id].channel}`
  );
  if (!logChannel) return;

  guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL;

    if (userID === client.user.id) return;

    let unBanInfo = new Discord.RichEmbed()
      .setTitle("**UNBANNED**")
      .setThumbnail(userAvatar)
      .setColor("#fd0000")
      .setDescription(
        `** Done Unbanned Member From The Server .! **

** User Unbanned** ${user.username}
**Done By.** <@${userID}>

`
      )

      .setTimestamp()
      .setFooter(guild.name, guild.iconURL);

    logChannel.send(unBanInfo);
  });
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
  if (!oldMember.guild) return;
  if (!log[oldMember.guild.id])
    log[oldMember.guild.id] = {
      onoff: "Off"
    };
  if (log[oldMember.guild.id].onoff === "Off") return;
  var logChannel = oldMember.guild.channels.find(
    c => c.name === `${log[(oldMember, newMember.guild.id)].channel}`
  );
  if (!logChannel) return;

  oldMember.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL;
    var userTag = logs.entries.first().executor.tag;

    if (oldMember.nickname !== newMember.nickname) {
      if (oldMember.nickname === null) {
        var oldNM = "`His original name`";
      } else {
        var oldNM = oldMember.nickname;
      }
      if (newMember.nickname === null) {
        var newNM = "`His original name`";
      } else {
        var newNM = newMember.nickname;
      }

      let updateNickname = new Discord.RichEmbed()
        .setTitle("**NICK NAME MEMBER UPTADE**")
        .setThumbnail(userAvatar)
        .setColor("#32ff00")
        .setDescription(
          `** Done Edit Nickname Member From The Server .! **

**User.** ${oldMember} 

**Old NickName.** \`${oldNM}\`
**New Nickname.** \`${newNM}\`

**Done By. **  <@${userID}>

`
        )
        .setTimestamp()
        .setFooter(oldMember.guild.name, oldMember.guild.iconURL);

      logChannel.send(updateNickname);
    }
    if (oldMember.roles.size < newMember.roles.size) {
      let role = newMember.roles
        .filter(r => !oldMember.roles.has(r.id))
        .first();
      if (!log[oldMember.guild.id])
        log[oldMember.guild.id] = {
          onoff: "Off"
        };
      if (log[oldMember.guild.id].onoff === "Off") return;
      let roleAdded = new Discord.RichEmbed()
        .setTitle("**ADDED ROLE TO MEMBER**")
        .setThumbnail(oldMember.guild.iconURL)
        .setColor("#006dff")
        .setDescription(
          `** Done Add Role To Member From The Server .! ** 

** Name ** <@${oldMember.id}>
** Role Name ** \`${role.name}\`
** Done By.** <@${userID}> 

`
        )
        .setTimestamp()
        .setFooter(userTag, userAvatar);

      logChannel.send(roleAdded);
    }
    if (oldMember.roles.size > newMember.roles.size) {
      let role = oldMember.roles
        .filter(r => !newMember.roles.has(r.id))
        .first();
      if (!log[oldMember.guild.id])
        log[oldMember.guild.id] = {
          onoff: "Off"
        };
      if (log[(oldMember, newMember.guild.id)].onoff === "Off") return;
      let roleRemoved = new Discord.RichEmbed()
        .setTitle("**REMOVED ROLE FROM MEMBER**")
        .setThumbnail(oldMember.guild.iconURL)
        .setColor("#006dff")
        .setDescription(
          `** Done Removed Role From Someone From in The server .!**

**Name** <@${oldMember.user.id}>
**Role Name ** \`${role.name}\`
**Done By. ** <@${userID}>
`
        )
        .setTimestamp()
        .setFooter(userTag, userAvatar);

      logChannel.send(roleRemoved);
    }
  });
  if (oldMember.guild.owner.id !== newMember.guild.owner.id) {
    if (!log[oldMember.guild.id])
      log[oldMember.guild.id] = {
        onoff: "Off"
      };
    if (log[(oldMember, newMember.guild.id)].onoff === "Off") return;
    let newOwner = new Discord.RichEmbed()
      .setTitle("**UPDATE GUILD OWNER**")
      .setThumbnail(oldMember.guild.iconURL)
      .setColor("#ff0004")
      .setDescription(
        `** Done Transfer Owner Ship This Server .! **

**Old Owner** <@${oldMember.user.id}>
** New Owner **  <@${newMember.user.id}>
 `
      )

      .setTimestamp()
      .setFooter(oldMember.guild.name, oldMember.guild.iconURL);

    logChannel.send(newOwner);
  }
});

client.on("voiceStateUpdate", (voiceOld, voiceNew) => {
  if (!voiceOld.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!voiceOld.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG"))
    return;
  if (!log[voiceOld.guild.id])
    log[voiceOld.guild.id] = {
      onoff: "Off"
    };
  if (log[(voiceOld, voiceOld.guild.id)].onoff === "Off") return;
  var logChannel = voiceOld.guild.channels.find(
    c => c.name === `${log[(voiceOld, voiceNew.guild.id)].channel}`
  );
  if (!logChannel) return;

  voiceOld.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userTag = logs.entries.first().executor.tag;
    var userAvatar = logs.entries.first().executor.avatarURL;

    if (voiceOld.serverMute === false && voiceNew.serverMute === true) {
      let serverMutev = new Discord.RichEmbed()
        .setTitle("**MUTE VOICE**")
        .setThumbnail(
          "https://images-ext-1.discordapp.net/external/pWQaw076OHwVIFZyeFoLXvweo0T_fDz6U5C9RBlw_fQ/https/cdn.pg.sa/UosmjqDNgS.png"
        )
        .setColor("GREEN")
        .setDescription(
          ` ** Done Give vmute to someone in the server .! ** 

**Name ** ${voiceOld}
** Channel Name ** \`${voiceOld.voiceChannel.name}\`
**Done By.** <@${userID}>
`
        )
        .setTimestamp()
        .setFooter(userTag, userAvatar);

      logChannel.send(serverMutev);
    }
    if (voiceOld.serverMute === true && voiceNew.serverMute === false) {
      if (!log[voiceOld.guild.id])
        log[voiceOld.guild.id] = {
          onoff: "Off"
        };
      if (log[(voiceOld, voiceOld.guild.id)].onoff === "Off") return;
      let serverUnmutev = new Discord.RichEmbed()
        .setTitle("**UNMUTE VOICE**")
        .setThumbnail(
          "https://images-ext-1.discordapp.net/external/u2JNOTOc1IVJGEb1uCKRdQHXIj5-r8aHa3tSap6SjqM/https/cdn.pg.sa/Iy4t8H4T7n.png"
        )
        .setColor("GREEN")
        .setDescription(
          `** Done Give Unvmute to someone in the server .! **

** Name ** ${voiceOld}
**Channel Name** \`${voiceOld.voiceChannel.name}\`
** Done By.** <@${userID}>

 `
        )
        .setTimestamp()
        .setFooter(userTag, userAvatar);

      logChannel.send(serverUnmutev);
    }
    if (voiceOld.serverDeaf === false && voiceNew.serverDeaf === true) {
      if (!log[voiceOld.guild.id])
        log[voiceOld.guild.id] = {
          onoff: "Off"
        };
      if (log[(voiceOld, voiceOld.guild.id)].onoff === "Off") return;
      let serverDeafv = new Discord.RichEmbed()
        .setTitle("**DEAFEN VOICE**")
        .setThumbnail(
          "https://images-ext-1.discordapp.net/external/7ENt2ldbD-3L3wRoDBhKHb9FfImkjFxYR6DbLYRjhjA/https/cdn.pg.sa/auWd5b95AV.png"
        )
        .setColor("GREEN")
        .setDescription(
          `** Done Give Deafen to someone in the server .! ** 

**Name** ${voiceOld}
**Channel Name ** \`${voiceOld.voiceChannel.name}\`
**Done By.** <@${userID}>
`
        )
        .setTimestamp()
        .setFooter(userTag, userAvatar);

      logChannel.send(serverDeafv);
    }
    if (voiceOld.serverDeaf === true && voiceNew.serverDeaf === false) {
      if (!log[voiceOld.guild.id])
        log[voiceOld.guild.id] = {
          onoff: "Off"
        };
      if (log[(voiceOld, voiceOld.guild.id)].onoff === "Off") return;
      let serverUndeafv = new Discord.RichEmbed()
        .setTitle("**UNDEAFEN VOICE**")
        .setThumbnail(
          "https://images-ext-2.discordapp.net/external/s_abcfAlNdxl3uYVXnA2evSKBTpU6Ou3oimkejx3fiQ/https/cdn.pg.sa/i7fC8qnbRF.png"
        )
        .setColor("GREEN")
        .setDescription(
          `** Done Give Undeafen to someone in the server .!** 

**Name** ${voiceOld}
**Channel Name ** \`${voiceOld.voiceChannel.name}\`
**Done By.** <@${userID}> 

`
        )
        .setTimestamp()
        .setFooter(userTag, userAvatar);

      logChannel.send(serverUndeafv);
    }
  });
});

//////////////////////////////////////// END LOG ////////////////////////////////////////

client.on("ready", () => {
  client.user.setActivity(`.help || .bot`);
});

client.on("message", message => {
  let command = message.content.split(" ")[0];
  if (command == prefix + "unban") {
            if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.member.hasPermission("BAN_MEMBERS")) return;
    let args = message.content
      .split(" ")
      .slice(1)
      .join(" ");
    if (args == "all") {
      message.guild.fetchBans().then(zg => {
        zg.forEach(NoNo => {
          message.guild.unban(NoNo);
        });
      });
      return message.channel.send("**✅ Done Unbanned all members **");
    }
    if (!args)
      return message.channel.send(
        ":no_mouth: **Please tybe `ID` this user or `all` **"
      );
    message.guild
      .unban(args)
      .then(m => {
        message.channel.send(`**✅ Done Unbanned ${m.username}**`);
      })
      .catch(stry => {
        message.channel.send(
          `:no_mouth:  **I don't see ${args} in the ban list.**`
        );
      });
  }
});



client.on("message", message => {
  if (message.content === prefix + "close") {
            if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.member.hasPermission("MANAGE_CHANNELS"))
      return message.channel.send("");
    message.channel
      .overwritePermissions(message.guild.id, {
        SEND_MESSAGES: false
      })
      .then(() => {
        message.channel.send(`:lock: <#${message.channel.id}> **has closed .** `);
      });
  }

  if (message.content === prefix + "unclose") {
            if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.member.hasPermission("MANAGE_CHANNELS"))
      return message.channel.send("");
    message.channel
      .overwritePermissions(message.guild.id, {
        SEND_MESSAGES: null
      })
      .then(() => {
        message.channel.send(`:unlock: <#${message.channel.id}> **has Unclosed .** `);
      });
  }
});

client.on("message", message => {
    var args = message.content.substring(prefix.length).split(" ");
    if (message.content.startsWith(prefix + "clear")) {    
              if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)

if(!message.member.hasPermission('MANAGE_MESSAGES')) return;
    let args = message.content.split(" ").slice(1);
    let messagecount = parseInt(args)+1;
    if (args > 99)
      return message
        .channel.send(`:no_mouth: ** The number can't be more than 99 .** `)
        .then(messages => messages.delete(5000));
    if (!messagecount) {
      let clear_count = 75
      message.channel.bulkDelete(clear_count+1);
      
       message.channel.send(` \`\`\` ${clear_count} messages has cleared . \`\`\` `).then(ms => {
       ms.delete(5000);
     });
      return
    }
      message.channel.bulkDelete(messagecount);
      message.channel.send(` \`\`\` ${messagecount-1} messages has cleared . \`\`\``).then(ms2 => {
        ms2.delete(5000);
      });
  }
}); 

client.on("message", message => {
    if (message.content.startsWith(prefix + "ping")) {
        if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    let start = Date.now();
      const ping = new Discord.RichEmbed()
      .setColor('#2fb5c0')
      .setDescription(`
Time taken: ${Date.now() - start} ms
Discord API: ${client.ping.toFixed(0)} ms`);
      message.channel.sendEmbed(ping)
  }
});

client.on("message", message => {
  if (message.content.startsWith(prefix + "link")) {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    message.channel
      .createInvite({
        thing: true,
        maxUses: 100,
        maxAge: 86400
      })
      .then(invite => message.author.sendMessage(invite.url));
    message.channel.send("**تم إرسال الرابط في رساله خاصة** ");

    message.author.send(``);
  }
});

/*
client.on("message", async message => {
  let mention = message.mentions.members.first();
  let command = message.content.split(" ")[0];
  let args = message.content.split(" ").slice(1);
  if (message.content.startsWith(prefix + "unmute")) {
  if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)

    2;
    if (!message.member.hasPermission("MANAGE_ROLES"))
      return message.channel.sendMessage("");
    if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES"))
      return message.channel.sendMessage(
        ":no_mouth:  **I couldn't unmute that user, Please Check me role and permissions Then try again**"
      );

    let taha =
      message.guild.member(message.mentions.users.first()) ||
      message.guild.members.get(args[0]);
           //   if(message.guild.member(taha).highestRole.position >= message.guild.member(message.member).highestRole.position) return message.channel.send(`:no_mouth: **You cannot Unmute this user because he has a higher role .**`); 

    if (!taha)
      return message.channel
        .send("**:no_mouth: I don't see this member.**")
        .then(msg => {});

    let role = message.guild.roles.find(r => r.name === "Mute");

    if (!role || !taha.roles.has(role.id))
      return message.channel.sendMessage(
        ` :no_mouth: ** \`${mention.user.username}\` not muted.**   `
      );

    await taha.removeRole(role);
    message.channel.sendMessage(`** the user \`${mention.user.username}\` has been Unmute!** :blush:`);
    return;
  }
});
*/
client.on("message", message => {
  if (!message.channel.guild) return;
  if (message.content.startsWith(prefix + "move")) {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (message.member.hasPermission("MOVE_MEMBERS")) {
      if (message.mentions.users.size === 0) {
        return message.channel.send(
          " **:no_mouth:  I don't see this member.** "
        );
      }
      if (message.member.voiceChannel != null) {
        if (message.mentions.members.first().voiceChannel != null) {
          var authorchannel = message.member.voiceChannelID;
          var usermentioned = message.mentions.members.first().id;
          var embed = new Discord.RichEmbed();

          message.guild.members
            .get(usermentioned)
            .setVoiceChannel(authorchannel)
            .then(m => message.channel.sendMessage(""));
        } else {
          message.channel.send(":no_mouth: **Member not in voice channel!** ");
        }
      } else {
        message.channel.send(":no_mouth: **You're not in voice channel!** ");
      }
    } else {
    }
  }
});

client.on("message", message => {
  if (message.content.startsWith(prefix + "bot")) {
        if (!message.guild) return;

    const embed = new Discord.RichEmbed()
      .setTitle("**December Bot**")
      .setThumbnail("https://cdn.discordapp.com/icons/675537297894146088/5fabc8a053abf34e05eff979632cca58.png?size=1024")
      .setDescription("")
      .addField(
        " ­",
        "[Click here to add me to your server](https://discordapp.com/oauth2/authorize?client_id=675652908687163403&scope=bot&permissions=271640639)",
        true
      )
      .addField(
        "­ ",
        "[Click here to join a Support Server](https://discord.gg/mJyzyaZ)"
      )
      .setFooter("");
    message.react(`✅`); //taha mohamed
    message.author.sendMessage(embed);
  }
});


client.on('message', message => { // edit by taha mohamed
  var prefix = ".";
   if(!message.channel.guild) return;
if(message.content.startsWith(prefix + 'bc')) {
if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('');
const args = message.content.split(" ").slice(1).join(" ")
if (!args) return message.channel.send('**! :rolling_eyes: -  Please write a text to send the Broadcast **');
  message.channel.send(`\`${message.guild.members.filter(m => m.presence.status !== 'all').size}\`** ! :white_check_mark:  Number of members received**  `).then(m => m.delete(300000));
message.guild.members.forEach(m => {
var NormalRep = args.replace(`[server]' ,message.guild.name).replace('[user]', m).replace('[by]`)
m.send(NormalRep);
})
}
});



client.on("message", message => {
  if (message.content.startsWith(prefix + "support")) {
            if (!message.guild) return;

    const embed = new Discord.RichEmbed()
      .setTitle("**link support server.**")
      .setThumbnail("")
      .setDescription("")
      .addField(
        "­ ",
        "[Click here to join a Support Server](https://discord.gg/mJyzyaZ)"
      )
      .setFooter("");
    message.react(`✅`); //taha mohamed
    message.author.sendMessage(embed);
  }
});

/*

client.on("message", message => {
  if (message.content.startsWith(prefix + "server")) {
    if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)

//  if (!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return;
    if (message.author.bot || message.channel.type == "dm") return;
    let onlineM = message.guild.members.filter(
      m => m.presence.status !== "offline"
    );
    let verifyL = ["0", "1", "2", "3", "4"];

    let serverEmbed = new Discord.RichEmbed()
      .setAuthor(
        `${message.guild.name}`,
        message.guild.iconURL || message.guild.avatarURL
      )
      .setColor("#ff00bf")
      .addField("Server ID:", `${message.guild.id}`, true)
      .addField(
        "Created On",
        `${moment(message.guild.createdAt).format("D/MM/YYYY h:mm a")}`,
        true
      )
      .addField("Owned.", `<@${message.guild.ownerID}>`, true)
      .addField(
        `Members ${message.guild.memberCount}`,
        `**${onlineM.size}** Active`,
        true
      )
      .addField(
        `Channels ${message.guild.channels.size}`,
        `**${
          message.guild.channels.filter(m => m.type == "text").size
        }** Text  **${
          message.guild.channels.filter(m => m.type == "voice").size
        }** Voice`,
        true
      )
      .addField(
        "Others",
        `Region: ${message.guild.region} \n**Verification Level**: ${
          verifyL[message.guild.verificationLevel]
        }`,
        true
      )
      .addField(
        ` **Roles** ${message.guild.roles.size}`,
        `To show roles use **.roles**`,
        true
      );

    message.channel.send(serverEmbed);
  }
});
*/

client.on("message", message => {
  if (!message.guild || message.author.bot) return;
  if (message.content.startsWith(prefix + "colors")) {

    var fsn = require("fs-nextra");
    fs.readdir("./2profile.png", async (err, files) => {
      // اسم الصوره
      var { Canvas } = require("canvas-constructor");
      var x = 0;
      var y = 0;
      if (message.guild.roles.filter(role => !isNaN(role.name)).size <= 0)
        return;
      message.guild.roles
        .filter(role => !isNaN(role.name))
        .sort((b1, b2) => b1.name - b2.name)
        .forEach(() => {
          x += 110;
          if (x > 110 * 12) {
            x = 110;
            y += 90;
          }
        });
      var image = await fsn.readFile(`./2profile.png`); // اسم الصوورة
      var xd = new Canvas(100 * 11, y + 350)
        .addBeveledImage(image, 0, 0, 100 * 11, y + 350, 100)
        .setTextBaseline("middle")
        .setColor("white")
        .setTextSize(55);
      x = 0;
      y = 150;
      message.guild.roles
        .filter(role => !isNaN(role.name))
        .sort((b1, b2) => b1.name - b2.name)
        .forEach(role => {
          x += 84.5;
          if (x > 100 * 10) {
            x = 87;
            y += 80;
          }
          xd.setTextBaseline("middle")
            .setTextAlign("center")
            .setColor(role.hexColor)
            .addBeveledRect(x, y, 60, 60, 15)
            .setColor("white");
          if (`${role.name}`.length > 2) {
            xd.setTextSize(27);
          } else if (`${role.name}`.length > 1) {
            xd.setTextSize(40);
          } else {
            xd.setTextSize(50);
          }
          xd.addText(role.name, x + 30, y + 30);
        });
      message.channel.sendFile(xd.toBuffer());
    });
  }
});

client.on("message", message => {
  let args = message.content.split(" ").slice(1);
  if (message.content.startsWith(prefix + "color")) {
    const embedd = new Discord.RichEmbed()
      .setFooter(
        "by" + message.author.username,
        message.author.avatarURL
      )
      .setDescription(`**There's No Color With This Number ** :no_mouth: `)
      .setColor(`ff0000`);

    if (!isNaN(args) && args.length > 0)
      if (!message.guild.roles.find("name", `${args}`))
        return message.channel.sendEmbed(embedd);

    var a = message.guild.roles.find("name", `${args}`);
    if (!a) return;
    const embed = new Discord.RichEmbed()

      .setFooter(
        "Done By  " + message.author.username,
        message.author.avatarURL
      )
      .setDescription(`**Done Changed color successfully .**  `)

      .setColor(`${a.hexColor}`);
    message.channel.sendEmbed(embed);
    if (!args) return;
    setInterval(function() {});
    let count = 0;
    let ecount = 0;
    for (let x = 1; x < 201; x++) {
      message.member.removeRole(message.guild.roles.find("name", `${x}`));
    }
    message.member.addRole(message.guild.roles.find("name", `${args}`));
  }
});


client.on("message", async message => {
  if (!message.guild || message.author.bot) return;
  var command = message.content.toLowerCase().split(" ")[0];
  var args = message.content.toLowerCase().split(" ");
  var user = message.guild.member(
    message.mentions.users.first() ||
      message.guild.members.find(m => m.id === args[1])
  );

  if (command == prefix + "topinv") {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!args[1] !== "inv") if (message.channel.type !== "text") return;
    message.guild.fetchInvites().then(res => {
      let invs = new Discord.Collection();
      res.forEach(i => {
        if (!message.guild.member(i.inviter.id)) return;
        if (!invs.has(i.inviter.id)) invs.set(i.inviter.id, i.uses);
        else invs.set(i.inviter.id, invs.get(i.inviter.id) + i.uses);
      });
      let desc = "";

      console.log(invs.sort((a, b) => b - a));
      desc += invs
        .sort((a, b) => b - a)
        .firstKey(10)
        .map(
          (id, index) =>
            "#" +
            (index + 1) +
            " - " +
            (message.guild.member(id)
              ? message.guild.member(id)
              : "``Unknown``") +
            " **invites:** `" +
            invs.sort((a, b) => b - a).array()[index] +
            "`"
        )
        .join("\n");
      let embed = new Discord.RichEmbed()
        .setAuthor(
          `${message.guild.name}`,
          message.guild.iconURL || message.guild.avatarURL
        )
        .setTitle("**:fire: The best people in top invites.** ")
        .setTimestamp()
        .setColor("#706c6c")
        .setFooter(message.author.username, message.author.avatarURL)
        .setDescription(desc);
      message.channel.send(embed);
    });
  }
});
client.on("message", message => {
  let command = message.content.split(" ")[0];
  if (command == prefix + "deafen") {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.member.hasPermission("DEAFEN_MEMBERS")) return;
    if (message.mentions.users.size < 1)
      return message.channel.sendMessage(
        " :no_mouth:  **I don't see this member.** "
      );
    let user =
      message.mentions.members.first() ||
      message.guild.members.get(message.content.split(" ")[1]);
    if (!user.voiceChannel)
      return message.channel.send(
        `**:no_mouth: This member isn't in a voicechannel**`
      );
    user.setDeaf(true);
    message.channel.send(`:white_check_mark:  **Done Deafen ** ${user}`);
  }
  if (command == prefix + "undeafen") {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.member.hasPermission("DEAFEN_MEMBERS")) return;
    if (message.mentions.users.size < 1)
      return message.channel.sendMessage(
        " :no_mouth:  **I don't see this member.** "
      );
    let user =
      message.mentions.members.first() ||
      message.guild.members.get(message.content.split(" ")[1]);
    if (!user.voiceChannel)
      return message.channel.send(
        `**:no_mouth: This member isn't in a voicechannel**`
      );
    user.setDeaf(false);
    message.channel.send(`:white_check_mark:  **Done Undeafen **${user}`);
  }
});
/*
let ar = JSON.parse(fs.readFileSync(`./autorole-december.json`, `utf8`));
client.on("guildMemberAdd", member => {
  if (!ar[member.guild.id])
    ar[member.guild.id] = {
      onoff: "Off",
      role: "Member"
    };
  if (ar[member.guild.id].onoff === "Off") return;
  member
    .addRole(member.guild.roles.find(`name`, ar[member.guild.id].role))
    .catch(console.error);
});
client.on("message", message => {
  if (!message.guild) return;
  if (!ar[message.guild.id])
    ar[message.guild.id] = {
      onoff: "Off",
      role: "Member"
    };
  if (message.content.startsWith(prefix + `autorole`)) {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    let perms = message.member.hasPermission(`ADMINISTRATOR`);
    if (!perms) return message.channel.send("");
    let args = message.content.split(" ").slice(1);
    if (!args.join(" ")) return message.author.send(``);
    let state = args[0];
    if (
      !state.trim().toLowerCase() == "toggle" ||
      !state.trim().toLowerCase() == "setrole"
    )
      return message.reply(``);
    if (state.trim().toLowerCase() == "toggle") {
      if (ar[message.guild.id].onoff === "Off")
        return [
          message.channel.send(`**:green_circle: Autorole is __On__ **`),
          (ar[message.guild.id].onoff = "On")
        ];
      if (ar[message.guild.id].onoff === "On")
        return [
          message.channel.send(`**:red_circle: Autorole Is __Off__ **`),
          (ar[message.guild.id].onoff = "Off")
        ];
    }
    if (state.trim().toLowerCase() == "set") {
      let newRole = message.content
        .split(" ")
        .slice(2)
        .join(" ");
      if (!newRole)
        return message.channel.send(
          `:no_mouth: Use **.autorole set + Role Name**`
        );
      if (!message.guild.roles.find(`name`, newRole))
        return message.channel.send(
          ` :no_mouth:  ** I Don't See The Role .** `
        );
      ar[message.guild.id].role = newRole;
      message.channel.send(`**The AutoRole Has Been Changed to ${newRole} .**`);
    }
  }
  if (message.content === prefix + "info autorole") {
    let perms = message.member.hasPermission(`ADMINISTRATOR`);
    if (!perms) return message.channel.send("");
    var embed = new Discord.RichEmbed()
      .addField(
        `Status Autorole . `,
        `
State : __${ar[message.guild.id].onoff}__
Role : __${ar[message.guild.id].role}__`
      )
      .setColor(`BLUE`);
    message.channel.send({ embed });
  }
  fs.writeFile("./autorole-december.json", JSON.stringify(ar), err => {
    if (err) console.error(err);
  });
});

client.on("message", message => {
  if (message.content.startsWith(prefix + "auto-role-setup")) {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.member.hasPermission(`ADMINISTRATOR`))
      return message.channel.send(
        ":no_mouth: **I'm really sorry but it's up to the administration**"
      );
    if (message.author.bot || message.channel.type == "dm") return;
    let mnt = message.mentions.users.first();
    let user = mnt || message.author;
    let userEmbed = new Discord.RichEmbed()
      .setColor("#fd0000")
      .setThumbnail(user.avatarURL)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setDescription(``)
      .addField(
        `How To setup The auto role ?`,
        `Use **.autorole set + Role Name** For Set auto role`
      )
      .addField(
        `Do you want to turn off or turn on Auto role ?`,
        `Use **.autorole toggle** For Turn on or off`
      )
      .addField(
        `Do you want to know the state of Auto role?`,
        `Use **.infoauto** For informations this auto role`
      )
      .addField(
        "­ ",
        "[Or Click here to join a Support Server](https://discord.gg/mJyzyaZ)"
      );
    message.author.send(userEmbed).catch(console.error);
    return message.react("✅");
  }
});
*/
client.on("message", message => {
  let args = message.content.split(" ");
  if (message.content.startsWith(prefix+"avatar")) {
  let member = message.mentions.users.first();
 
  if(args[0] && !args[1]) {
        const embed = new Discord.RichEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setColor("#fd00ff")
      .setTitle("Image Link")
      .setURL(`${message.author.avatarURL}`)
      .setImage(`${message.author.avatarURL}`)
      .setFooter(  message.author.tag, message.author.avatarURL);
     message.channel.sendEmbed(embed);
  }
  if(member) {
      const embed = new Discord.RichEmbed()
      .setAuthor(member.tag, member.avatarURL)
      .setColor("#fd00ff")
      .setTitle("Image Link")
      .setURL(`${member.avatarURL}`)
      .setImage(`${member.avatarURL}`)
      .setFooter(message.author.tag, message.author.avatarURL);
     message.channel.sendEmbed(embed);
                  } else if(!message.content.startsWith(prefix)) return;
  if(message.content.startsWith(prefix + "avatar server")) {
    let decemberbot = new Discord.RichEmbed()
    .setColor("fd00ff")
    .setAuthor(message.guild.name, message.guild.iconURL)
    .setTitle("Image Link")
    .setURL(message.guild.iconURL)
    .setImage(message.guild.iconURL)
    .setFooter(`${message.author.tag}`, message.author.avatarURL)
    message.channel.send(decemberbot)
    
     }else if(args[1] && !member) {
          client.fetchUser(args[1]).then(user => {
    const embed = new Discord.RichEmbed()
      .setAuthor(user.tag, user.avatarURL)
      .setColor("#fd00ff")
      .setTitle("Image Link")
      .setURL(`${user.avatarURL}`)
      .setImage(`${user.avatarURL}`)
      .setFooter(message.author.tag, message.author.avatarURL);
     message.channel.sendEmbed(embed);

      
  })
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////


client.on("message", message => {

  if (message.content.startsWith(prefix + "user")) {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (message.author.bot || message.channel.type == "dm") return;
    let mnt = message.mentions.users.first();
    let user = mnt || message.author;
    moment.locale("En-ly");
    message.guild.fetchInvites().then(invs => {
      let personalInvites = invs.filter(
        i => i.inviter.id === message.author.id
      );
      let Invites = invs.filter(i => i.inviter.id);
      let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);
      let userEmbed = new Discord.RichEmbed()
        .setColor("#fd0000")
        .setThumbnail(user.avatarURL)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setDescription(``)

      
        .addField(
          `Join Discord :`,
          `**${moment(user.createdAt).format("D/MM/YYYY h:mm a")}**`,
          true
        )
        .addField(
          `Join Server :`,
          `**${moment(user.joinedAt).format("D/MM/YYYY h:mm a")}**`,
          true
        )
        .addField(`Invites :`, `**${inviteCount}**`);
      message.channel.send(userEmbed).catch(console.error);
    });
  }
});


///////////////////////////////////////////// WELCOMERS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const { Canvas } = require('canvas-constructor','canvas');

const fetch = require('node-fetch');
const fsn = require('fs-nextra');
const invites = {};
const waiting = require('util').promisify(setTimeout);
client.on('ready', () => {
  waiting(1000); 
  client.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
     invites[g.id] = guildInvites; 
    });
  });
});

const welcomerJSON = JSON.parse((require ('fs')).readFileSync('./welcomerJSON.json'));
function saveWelcomerJ() {
    (require('fs')).writeFileSync('./welcomerJSON.json', JSON.stringify(welcomerJSON), (err) => {
        if (err) throw err;
    })
}

client.on ('message', (message) => {
    if (message.content.split(' ')[0] == prefix+"set-welcomer") {
        var args = message.content.split(' ').slice(1).join(' ');
        if (!args) return message.channel.send(`Use **${prefix}set-welcomer [CHANNEL NAME]** to create the welcome channel , 
Use **${prefix}set-welcomer off** to turn off this welcome`);
        if (!welcomerJSON[message.guild.id]) welcomerJSON[message.guild.id] = {
            "status": "off",
            "channel": 1111
        };
        saveWelcomerJ();
        if (args == "off") {
            welcomerJSON[message.guild.id].status = "off";
            saveWelcomerJ();
            message.channel.send(':white_check_mark: **The welcome channel has been turning off Successfully ,**')
        } else {
            var channel = message.guild.channels.find (channel => channel.name == args);
            if (!channel) return message.channel.send(':no_mouth: I Don\'t see **('+args+')**');
            welcomerJSON[message.guild.id] = {
                "status": "on",
                "channel": channel.id
            }
            saveWelcomerJ();
            message.channel.send(":white_check_mark: **Done Create The Welcome To (<#"+channel.id+">) Channel.**");
        }
    }
})
client.on ('guildMemberAdd', async (member) => {
    if (!welcomerJSON[member.guild.id]) welcomerJSON[member.guild.id] = {
        "status": "off",
        "channel": 1111
    }
    saveWelcomerJ();
    if (welcomerJSON[member.guild.id].status == "off") return null;
    let channel = await member.guild.channels.get (welcomerJSON[member.guild.id].channel);
    if (!channel) return null;
    try {
    member.guild.fetchInvites().then (async guildInvites => {
    var ei = invites[member.guild.id]
    invites [member.guild.id] = guildInvites
    if(guildInvites) {
    var invite = guildInvites.find (i => ei.get (i.code).uses < i.uses)
    var inviter = invite.inviter;
    var imageUrlRegex = /\?size=2048$/g;
    var wlcImage = await fsn.readFile('./decemberWELCOMER.png');
      
      
    var inviterResult = await fetch(invite.inviter.displayAvatarURL.replace(imageUrlRegex, '?size=128'));
      
    if (inviterResult.ok) {
      
      
      var inviterAvatar = await inviterResult.buffer();
      
    } else if (!inviterResult.ok) {
      
      var inviterAvatar = await fsn.readFile('./11.png'); 
      
    }

      
    var result = await fetch(member.user.displayAvatarURL.replace(imageUrlRegex, '?size=128'));
    
    if (result.ok) {
      
    var avatar = await result.buffer();
      
    } else if (!result.ok) {
      
    
      var avatar = await fsn.readFile('./11.png'); 
      
    }

    let name = member.user.username.length > 10 ? member.user.username.substring(0, 11) + '...'
    : member.user.username;
  

       const buffer = new Canvas(647, 279)
      .addImage(wlcImage, 0, 0, 645 , 275)
      .addCircularImage(avatar, 166.2, 161.8, 117) 
      .setTextAlign('left')
      .setTextFont('36pt Times New Roman')
      .setColor('#090909')
       
      .addText(name, 290, 230)
      .setTextAlign('left')
      .setTextFont('24pt Times New Roman')
      //.addText(member.guild.members.size, 555, 355)  
      .toBuffer();
         const decemberWLC = member.guild.channels.find(
      channel => channel.id === `${welcomerJSON[member.guild.id].channel}`
    );
      if (!decemberWLC) return;
          setTimeout(() => {
      decemberWLC.send(`
\`#\` **User** ${member}  
\`#\` **Invite By** <@${inviter.id}>


`);
    }, 2500);

      
    try {
    var { Attachment } = await require('discord.js');
    const filename = `december-wlc-${member.id}.jpg`;
    const attachment = new Attachment(buffer, filename);
    await channel.send(attachment);
    
 } catch (error) {
    return; 
  } 
    } else if(!guildInvites) {
      
          var wlcImage = await fsn.readFile('./decemberWELCOMER.png');
      
      
    var inviterResult = await fetch(invite.inviter.displayAvatarURL.replace(imageUrlRegex, '?size=128'));
      
    if (inviterResult.ok) {
      
      var inviterAvatar = await inviterResult.buffer();
      
    } else if (!inviterResult.ok) {
      
      var inviterAvatar = await fsn.readFile('./11.png');
      
    } 

      
    var result = await fetch(member.user.displayAvatarURL.replace(imageUrlRegex, '?size=128'));
    
    if (result.ok) { 
      
    var avatar = await result.buffer();
      
    } else if (!result.ok) {
      
    
      var avatar = await fsn.readFile('./11.png');
      
    } 

    let name = member.user.username.length > 12 ? member.user.username.substring(0, 11) + '...'
    : member.user.username;
  

       const buffer = new Canvas(279, 647)
      .addImage(wlcImage, 0, 0, 279, 647)
      .addCircularImage(avatar, 161.2, 157.8, 117)
      .setTextAlign('left')
      .setTextFont('40pt Times New Roman')
      .setColor('#FFFFFF')
      .toBuffer();

    try { 
    var { Attachment } = await require('discord.js');
    const filename = `december-wlc-${member.id}.jpg`;
    const attachment = new Attachment(buffer, filename);
    await channel.send(attachment);
    
 } catch (error) {
    return;
  } 
      
    } 
      
  }) 
    
  } catch (error) {
    return; 
  }


})













//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let warning = JSON.parse(fs.readFileSync("./warning.json", "utf8"));
client.on("message", message => {
  if (
    message.author.bot ||
    message.channel.type == "dm" ||
    !message.channel.guild
  )
    return;
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);
  if (message.content.startsWith(prefix + "warn")) {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    if (!warning[message.guild.id]) warning[message.guild.id] = { warns: [] };
    let T = warning[message.guild.id].warns;
    let user = message.mentions.users.first();
    if (!user)
      return message.channel.send(`:no_mouth: **I do not see this member.**`);
    let reason = message.content
      .split(" ")
      .slice(2)
      .join(" ");
    if (!reason)
      return message.channel.send(`:no_mouth: **Please put a reason .**`);
    let W = warning[message.guild.id].warns;
    let ID = 0;
    let leng = 0;
    W.forEach(w => {
      ID++;
      if (w.id !== undefined) leng++;
    });
    if (leng === 90)
      return message.channel.send(
        `:no_mouth: **You have reached the limit for sending warnings Try tomorrow . **`
      );
    T.push({
      user: user.id,
      by: message.author.id,
      reason: reason,
      time: moment(Date.now()).format("llll"),
      id: ID + 1
    });
    message.channel.send(
      `:white_check_mark: **@${user.username} Has been warned .**`
    );
    fs.writeFile("./warning.json", JSON.stringify(warning), err => {
      if (err) console.error(err);
    });
    fs.writeFile("./warning.json", JSON.stringify(warning), err => {
      if (err) console.error(err);
    });
    user.send(
      new Discord.RichEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField(":warning: **You have a warning . ! **", reason)
        .setTimestamp()
        .setColor("#ff0000")
    );
    return;
  }
  if (command == "warnings") {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    if (!warning[message.guild.id]) warning[message.guild.id] = { warns: [] };
    let count = 0;
    let page = message.content.split(" ")[1];
    if (!page || isNaN(page)) page = 1;
    if (page > 4)
      return message.channel.send(":no_mouth: **Maximum 4 pages . **");
    let embed = new Discord.RichEmbed().setFooter(
      message.author.username,
      message.author.avatarURL
    );
    let W = warning[message.guild.id].warns;
    W.forEach(w => {
      if (!w.id) return;
      count++;
      if (page == 1) {
        if (count > 24) return null;
        let reason = w.reason;
        let user = w.user;
        let ID = w.id;
        let By = w.by;
        let time = w.time;
        embed.addField(
          `${time}`,
          `**Warn Number** (**${ID}**) 
**Done By.** <@${By}>
**Warning to**: <@${user}>
**The warning  :- **\n\`\`\`${reason}\`\`\``
        );
        embed.setThumbnail(message.author.avatarURL);
        if (count == 24)
          embed.addField("**More !**", `${message.content.split(" ")[0]} 2`);
      }
      if (page == 2) {
        if (count <= 24) return null;
        if (count > 45) return null;
        let reason = w.reason;
        let user = w.user;
        let ID = w.id;
        let By = w.by;
        let time = w.time;
        embed.addField(
          `⏱ ${time}`,
          `**Warn Number** (**${ID}**) 
**Done By.** <@${By}>
**Warning to**: <@${user}>
**The warning  :- **\n\`\`\`${reason}\`\`\``
        );
        embed.setThumbnail(message.author.avatarURL);
        if (count == 45)
          embed.addField("** More !**", `${message.content.split(" ")[0]} 3`);
      }
      if (page == 3) {
        if (count <= 45) return null;
        if (count > 69) return null;
        let reason = w.reason;
        let user = w.user;
        let ID = w.id;
        let By = w.by;
        let time = w.time;
        embed.addField(
          `${time}`,
          `**Warn Number** (**${ID}**) 
**Done By.** <@${By}>
**Warning to**: <@${user}>
**The warning  :- **\n\`\`\`${reason}\`\`\``
        );
        embed.setThumbnail(message.author.avatarURL);
        if (count == 69)
          embed.addField("** More !**", `${message.content.split(" ")[0]} 4`);
      }
      if (page == 4) {
        if (count <= 69) return null;
        if (count > 92) return null;
        let reason = w.reason;
        let user = w.user;
        let ID = w.id;
        let By = w.by;
        let time = w.time;
        embed.addField(
          `${time}`,
          `**Warn Number** (**${ID}**) 
**Done By.** <@${By}>
**Warning to**: <@${user}>
**The warning  :- **\n\`\`\`${reason}\`\`\``
        );
        embed.setThumbnail(message.author.avatarURL);
        if (count == 64) embed.addField("**FULL**", `** **`);
      }
    });
    embed.setTitle(`**${count} Warnings** [ ${page} ]`);
    message.react("✅");
    message.author.send(embed);
  }
  if (command == "removewarn") {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)

    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    if (!warning[message.guild.id]) warning[message.guild.id] = { warns: [] };
    let args = message.content.split(" ")[1];
    if (!args)
      return message.channel.send(
        `:no_mouth: **Please Choose the warning number or use \`all\` to remove all warnings**`
      );
    let user = message.mentions.members.first();
    if (user) {
      let C = 0;
      let a = warning[message.guild.id].warns;
      a.forEach(w => {
        if (w.user !== user.id) return;
        delete w.user;
        delete w.reason;
        delete w.id;
        delete w.by;
        delete w.time;
        C++;
      });
      if (C === 0)
        return message.channel.send(
          `:no_mouth: **I don't see this warning. **`
        );
      return message.channel.send(
        ":white_check_mark:  ** " + C + " Warning has cleared . **  "
      );
    }
    if (args == "all") {
      let c = 0;
      let W = warning[message.guild.id].warns;
      W.forEach(w => {
        if (w.id !== undefined) c++;
      });
      warning[message.guild.id] = { warns: [] };
      fs.writeFile("./warning.json", JSON.stringify(warning), err => {
        if (err) console.error(err);
      });
      fs.writeFile("./warning.json", JSON.stringify(warning), err => {
        if (err) console.error(err);
      });
      return message.channel.send(
        ":white_check_mark:  ** " + c + " Warning has cleared . ** "
      );
    }
    if (isNaN(args))
      return message.channel.send(
        `:no_mouth: **Please Choose the warning number or use \`all\` to remove all warnings**`
      );
    let W = warning[message.guild.id].warns;
    let find = false;
    W.forEach(w => {
      if (w.id == args) {
        delete w.user;
        delete w.reason;
        delete w.id;
        delete w.by;
        delete w.time;
        find = true;
        return message.channel.send("**✅ 1 Warning has cleared . **");
      }
    });
    if (find == false)
      return message.channel.send(`:no_mouth: **I don't see this warning. **`);
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on("message", message => {
  let command = message.content.split(" ")[0];
  if (message.content.startsWith(prefix + "nick")) {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.member.hasPermission("MANAGE_NICKNAMES")) return;
      if (!message.guild.member(client.user).hasPermission("MANAGE_NICKNAMES"))
        return message.channel.send(
          `**:rolling_eyes: ! Please Check me role and permissions Then try again**`
        );
    var user =
      message.guild.members.get(message.content.split(" ")[1]) ||
      message.mentions.members.first();
    let MrNono = message.content
      .split(" ")
      .slice(2)
      .join(" ");
    if (!user)
      return message.channel.send(`:no_mouth: **I do not see this member. **`);
    if (!MrNono) {
      user
        .setNickname("", `Done By : ${message.author.tag}`)
        .catch(MrNoNo => {});
      return message.channel.send(
        `:white_check_mark: ** ${user} His name has been returned . **`
      );
    }
    user
      .setNickname(MrNono, `Done By : ${message.author.tag}`)
      .catch(NoNo => {});
    message.channel.send(
      `✅ **Done changed nickname** ${user} **to** **\`${MrNono}\`**`
    );
  }
});

client.on("message", msg => {
  if (msg.content.startsWith(prefix + "invite")) {
    if (!msg.guild) return;
    msg.author.send(`
:blush: **A bot invitation link for your server .**
https://discordapp.com/oauth2/authorize?client_id=675652908687163403&scope=bot&permissions=271640639`);
    msg.react("✅");
  }
});
/*
client.on("message", async message => {
  if (message.content.startsWith(prefix + "bannedlist")) {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.guild) return;
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.channel.send("");
    message.guild.fetchBans().then(bans => {
      let b = bans.size;
      let bb = bans.map(a => `${a}`).join(" - ");
      let embed = new Discord.RichEmbed()

        .setAuthor(
          `${message.guild.name}`,
          message.guild.iconURL || message.guild.avatarURL
        )
        .setThumbnail(message.author.avatarURL)

        .setColor("#fc0000")
        .setTitle(`**All Banned On Server**`)
        .addField(` ­`, `** \`${b}\`  ${bb}**`)

        .setFooter(
          `${message.author.username}`,
          message.author.iconURL || message.author.avatarURL
        );

      message.channel.sendEmbed(embed);
    });
  }
});
*/
//////////////////////////////////////////////
/*
let spread = JSON.parse(fs.readFileSync("./antilinks december.json", "utf8"));

client.on("message", message => {
  if (message.content.startsWith(prefix + "antilinks-off")) {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.channel.guild) return message.channel.send("");
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send("");
    spread[message.guild.id] = {
      onoff: "Off"
    };
    message.channel.send(`✅ **Anti link is Off . **`);
    fs.writeFile("./antilinks december.json", JSON.stringify(spread), err => {
      if (err)
        console.error(err).catch(err => {
          console.error(err);
        });
    });
  }
});
client.on("message", message => {
  if (message.content.startsWith(prefix + "antilinks-on")) {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.channel.guild) return message.channel.send("");
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send("");
    spread[message.guild.id] = {
      onoff: "On"
    };
    message.channel.send(`✅ **Anti link is On . **`);
    fs.writeFile("./antilinks december.json", JSON.stringify(spread), err => {
      if (err)
        console.error(err).catch(err => {
          console.error(err);
        });
    });
  }
});
client.on("message", message => {
  var args = message.content.split(/[ ]+/);
  if (message.content.includes("http://www.facebook.com/")) {
    if (!spread[message.guild.id])
      spread[message.guild.id] = {
        onoff: "Off"
      };
    if (spread[message.guild.id].onoff === "Off") return;
    message.delete();
    return message.channel.send(``);
  }
});

client.on("message", message => {
  var args = message.content.split(/[ ]+/);
  if (message.content.includes("https://www.youtube.com/")) {
    if (!spread[message.guild.id])
      spread[message.guild.id] = {
        onoff: "Off"
      };
    if (spread[message.guild.id].onoff === "Off") return;
    message.delete();
    return message.channel.send(``);
  }
});

client.on("message", message => {
  var args = message.content.split(/[ ]+/);
  if (message.content.includes("https://www.discordapp.com/")) {
    if (!spread[message.guild.id])
      spread[message.guild.id] = {
        onoff: "Off"
      };
    if (spread[message.guild.id].onoff === "Off") return;
    message.delete();
    return message.channel.send(``);
  }
});
client.on("message", message => {
  var args = message.content.split(/[ ]+/);
  if (message.content.includes("https://discord.gg/")) {
    if (!spread[message.guild.id])
      spread[message.guild.id] = {
        onoff: "Off"
      };
    if (spread[message.guild.id].onoff === "Off") return;
    message.delete();
    return message.channel.send(``);
  }
});
*/
///////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






client.on("message", message => {
  if (message.content.startsWith(prefix + "photo-setup")) {
    if (!message.member.hasPermission(`ADMINISTRATOR`))
      return message.channel.send(
        ":no_mouth: **I'm really sorry but it's up to the administration**"
      );
    if (message.author.bot || message.channel.type == "dm") return;
    let mnt = message.mentions.users.first();
    let user = mnt || message.author;
    let userEmbed = new Discord.RichEmbed()
      .setColor("#ff00d8")
      .setThumbnail(user.avatarURL)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setDescription(``)
      .addField(
        `How To setup The photo channel  ..?`,
        `Use **.setphoto [CHANNEL]** to create a photo channel`
      )
      .addField(
        `Do you want to turn off or turn on the photo channel ?`,
        `Use **.togglephoto** to Turn on , or turn off`
      )
      .addField(
        `Want to know the photo channel info ?`,
        `Use **.infophoto** For informations this photo channel`
      )
      .addField(
        "­ ",
        "[Or Click here to join a Support Server](https://discord.gg/mJyzyaZ)"
      );
    message.author.send(userEmbed).catch(console.error);
    return message.react("✅");
  }
});
///////////////////////////////////////////////// Help \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

client.on("message", message => {
   if (message.content.startsWith(prefix + "help")) {
    if (!message.guild) return;
     const embed = new Discord.RichEmbed()
           .setAuthor(message.author.username, message.author.avatarURL)
      .setThumbnail(message.author.avatarURL)
       .setColor('#ff00d8')
     .addField(`­`,
`**${prefix}english help** to show help list for language english 

**${prefix}arabic help** لاظهار قائمة المساعده باللغه العربيه
­
`)
     .setFooter(message.guild.name, message.guild.iconURL)
    message.channel.sendMessage(embed);
  }
});

client.on("message", message => {
   if (message.content.startsWith(prefix + "english help")) {
    if (!message.guild) return;
     const embed = new Discord.RichEmbed()
      .setThumbnail(message.author.avatarURL)
       .setColor('#ff00d8')
        .addField(`Special protection`,`
🙂 **I'm really sorry, but the special protection is left to Premium . **`)
    
    .addField(`Administrative Commands .`,`
**${prefix}photo-setup** Learn how to create a photo channel
**${prefix}set-welcomer [Name Channel]** to setup welcome
**${prefix}toggle-welcome** to turn off or turn on welcome
**${prefix}toggle-invitedby** to turn off or turn on inviter by
**${prefix}auto-role-setup** For information or run autorole
**${prefix}info autorole** to show info autorole 
**${prefix}log** to create channel log
**${prefix}toggle-log** to turn off or turn on log 
**${prefix}antilinks-on** to run anti-links
**${prefix}antilinks-off** to turn off anti-links
**${prefix}send [CHANNEL]** to send message in any channel 
**${prefix}1set auto reply** to set auto reply 1
**${prefix}2set auto reply** to set auto reply 2
**${prefix}3set auto reply ** to set auto reply 3
**${prefix}delete auto reply1** to delete auto reply 1
**${prefix}delete auto reply2** to delete auto reply 2
**${prefix}delete auto reply3** to delete auto reply 3`)
     .addField(`Moderator Commands.`,`
**${prefix}unban** to unban member or all
**${prefix}close** to close channel
**${prefix}unclose** to unclose channel
**${prefix}kick** to kick a person
**${prefix}ban** to ban a person
**${prefix}move** to move someone
**${prefix}nick** to change member nickname
**${prefix}clear** to clear chat
**${prefix}deafen** to deafen a person.
**${prefix}undeafen** to undeafen a person
**${prefix}warn** to warn a person
**${prefix}warnings** to show all warnings
**${prefix}removewarn** to delete a specific warn or all
**${prefix}mute** to mute a member
**${prefix}unmute** to unmute a member
**${prefix}server** to show info server.`)
    
    .addField(`General Commands.`,`
**${prefix}setup-info** to Register Your Accounts On Social Media.
**${prefix}information** to show all your information.
**${prefix}removeinfo** for remove your info
**${prefix}info-setup** To know how to record your information.
**${prefix}user** To show personal information
**${prefix}avatar** to show your Image.
**${prefix}avatar [ID]** To Show Image any person 
**${prefix}avatar server** to show Image Server .
**${prefix}topinv** To know people Top invite.
**${prefix}top** Learn about people top interaction.
**${prefix}topvoice** Learn about people top voice 5 interaction.
**${prefix}toptext** Learn about people top text 5 interaction.
**${prefix}colors** to show all colors in a server
**${prefix}color** to choose the color in the server.
**${prefix}link** to get the link this server.
**${prefix}profile** to show your profile .
**${prefix}daily** To take your daily salary 
**${prefix}coins** to show your coins ,
**${prefix}rep** to give a reputation to a person 
**${prefix}note** To register a note on your profile .`)
    
    .addField(`Music Commands.`, `
 **${prefix}play** to play a song or stream.  
**${prefix}skip** to skip the song.
**${prefix}stop** to clear songs playlist
**${prefix}pause** to pause song.
**${prefix}resume** to resume song
**${prefix}vol** to changed volume
**${prefix}repeat** to repeat a song
**${prefix}np** to show song playing
**${prefix}queue** to show all songs
`)
    
    .addField(`Other.`,`
**${prefix}bot** to show all information bot
**${prefix}ping** To know the speed of the bot connection
**${prefix}support** to join the server support this bot.`)
     .addField(`Do you want Premium bot .?`,`
[Go to support server if you want premium](https://discord.gg/mJyzyaZ)`)
    message.react(`✅`); //taha mohamed
    message.author.sendMessage(embed);
  }
});




client.on("message", message => {
   if (message.content.startsWith(prefix + "arabic help")) {
    if (!message.guild) return;
     const embed = new Discord.RichEmbed()
      .setThumbnail(message.author.avatarURL)
       .setColor('#ff00d8')
        .addField(`الحمايه الخاصه`,`
🙂 **أنا آسف حقًا ، ولكن الحماية الخاصة تُترك لـ النسخه المدفوعة**`)
    
    .addField(`الاوامر الادارية`,`
**${prefix}photo-setup** لمعرفه كيفيه عمل قناه الصور 
**${prefix}set-welcomer [اسم القناة]** لصنع قناه الترحيب
**${prefix}toggle-welcome** لتشغيل او ايقاف الترحيب
**${prefix}toggle-invitedby** لتشغيل او ايقاف خاصيه الداعي في الترحيب
**${prefix}auto-role-setup** لمعرفه كيفيه تشغيل الاوتو رول
**${prefix}info autorole** لاظهار معلومات الاوتو رول
**${prefix}log** لانشاء قناه اللوج
**${prefix}toggle-log** لتشغيل او ايقاف قناه اللوج
**${prefix}antilinks-on** لتشغيل مضاد الروابط
**${prefix}antilinks-off** لايقاف مضاد الروابط
**${prefix}send [اسم القناة]** لارسال رساله محدده في اي شات 
**${prefix}1set auto reply** لـ صنع رد تلقائي 1
**${prefix}2set auto reply** لـ صنع رد تلقائي 2 
**${prefix}3set auto reply ** لـ صنع رد تلقائي 3
**${prefix}delete auto reply1** لحذف الرد التلقائي رقم 1
**${prefix}delete auto reply2** لحذف الرد التلقائي رقم 2
**${prefix}delete auto reply3** لحذف الرد التلقائي رقم 3`)
     .addField(`اوامر المشرفين`,`
**${prefix}unban** لفك الحظر عن شخص او الكل
**${prefix}close** لفتح الشات
**${prefix}unclose** لـفتح الشات
**${prefix}kick** لـ ركل عضو
**${prefix}ban** لحظر عضو
**${prefix}move** لسحب شخص بين المكالمات الصوتية
**${prefix}nick** لتغير كنية شخص 
**${prefix}clear** لمسح رسائل الشات
**${prefix}deafen** لـغلق سماعه شخص
**${prefix}undeafen** لـفك سماعه لشخص
**${prefix}warn** لتحذير شخص
**${prefix}warnings** لاظهار جميع التحذيرات في هذا الخادم
**${prefix}removewarn** لحذف تحذير معين او الكل
**${prefix}mute** لاسكات شخص
**${prefix}unmute** لفك الاسكات عن شخص
**${prefix}server** لاظهار معلومات السيرفر`)
    
    .addField(`الأوامر العامة`,`
**${prefix}setup-info** لتسجيل معلوماتك في السوشيال ميديا 
**${prefix}information** لاظهار معلوماتك
**${prefix}removeinfo** لحذف المعلومات الخاصه بك
**${prefix}info-setup** لمعرفه كيفيه تسجيل المعلومات الخاصه بك 
**${prefix}user** لاظهار معلوماتك
**${prefix}avatar** لاظهار صورتك الشخصية
**${prefix}avatar [ID]** لاظهار صوره اي شخص 
**${prefix}avatar server** لاظهار صوره الخادم.
**${prefix}topinv** لمعرفة الناس دعوة الأعلى.
**${prefix}top** لتعرف على الأشخاص التفاعل العلوي
**${prefix}topvoice** لتعرف افضل 5 اشخاص في تفاعل المكالمات الصوتيه
**${prefix}toptext** لتعرف افضل 5 اشخاص في تفاعل الكتابة
**${prefix}colors** لاظهار جميع الالوان في هذا الخادم
**${prefix}color** لاختيار لون في هذا الخادم
**${prefix}link** للحصول على رابط هذا الخادم 
**${prefix}profile** لاظهار ملفك الشخصي
**${prefix}daily** لاخذ راتبك اليومي
**${prefix}coins** لاظهار عملاتك النقديه الحاليه
**${prefix}rep** لاعطاء نقطه السمعه لـ شخص ماً
**${prefix}note** لتسجيل نبذه مختصره في الملفي الشخصي الخاص بك .`)
    
    .addField(`اوامر الموسيقي`, `
**${prefix}play** لـتشغيل موسيقي 
**${prefix}skip** لتخطي الموسيقي الحاليه
**${prefix}stop** لحذف قائمة التشغيل
**${prefix}pause** لايقاف الموسيقي مؤقتا
**${prefix}resume** لاستئناف الموسيقي
**${prefix}vol** لتغير حجم الصوت
**${prefix}repeat** لـتكرار الموسيقي
**${prefix}np** لاظهار الموسيقي الحاليه
**${prefix}queue** لاظهار جميع الموسيقي 
`)
    
    .addField(`اخري`,`
**${prefix}bot** لاظهار معلومات البوت
**${prefix}ping** لمعرفة سرعه اتصال البوت
**${prefix}support** لـ رابط خادم الدعم الفني للبوت`)
     .addField(`هل تريد النسخه المدفوعه .؟`,`
[اضغط هنا للدخول لخادم الدعم الفني والشراء](https://discord.gg/mJyzyaZ)`)
    message.react(`✅`); //taha mohamed
    message.author.sendMessage(embed);
  }
});

///////////////////////////////////////////////// End Help \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



/////////////////////////////////////////////// Code Register Your Info ///////////////////////////////////////////////
const infos = JSON.parse(require("fs").readFileSync("./december-info.json", "utf8"));
function saveinfos() {
    require("fs").writeFileSync("./december-info.json", JSON.stringify(infos, null, 2), function (error) {
        if (error) throw error;
    });
};
client.on("message", async (message) => {
    if (!message['guild'] ||
       message['author'].bot) return false;
  var prefix = ".",
       command = message['content'].split(' ')[0];
  switch (command) {
    case prefix + "setup-info":
          if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)

        if (!infos[message['author'].id]) infos[message['author'].id] = {
                        "instagram": "nothing.",
                        "facebook": "nothing.",
                        "twitter": "nothing.",
                        "pubg": "nothing.",
                                "WhatsApp": "nothing."
          
        };
        saveinfos();
 
        var args = message['content'].split(' ');
        var username = args.slice(2).join(" ");
        if (!args[1]) return message.channel.send(':no_mouth: ** I can\'t see this site **');
        if (!["instagram", "facebook", "twitter", "pubg", "whatsapp"].includes(args[1].toLowerCase())) return message.channel.send(":no_mouth: ** I can\'t see this site **");
        switch (args[1].toLowerCase()) {
        case 'instagram':
            if (!username) return message.channel.send(":no_mouth: **Write your name On instagram .**");
            infos[message['author'].id].instagram = username;
            saveinfos();
            return message.channel.send(":blush: **Your name has been saved in instagram . **");
            break;
        case 'facebook':
            if (!username) return message.channel.send(":no_mouth: **Write your name On Facebook .**");
            infos[message['author'].id].facebook = username;
            saveinfos();
            return message.channel.send(":blush: **Your name has been saved in Facebook . **");
            break;
        case 'pubg':
            if (!username) return message.channel.send(":no_mouth: **Write your name Or ID on PubgMobile .**");
            infos[message['author'].id].pubg = username;
            saveinfos();
            return message.channel.send(":blush: **Your name/ID has been saved in PupgMobile .** ");
            break;
        case 'twitter':
            if (!username) return message.channel.send(":no_mouth: **Write your name on Twitter .**");
            infos[message['author'].id].twitter = username;
            saveinfos();
            return message.channel.send(":blush: **Your name has been saved in twitter . **");
            break;
                    case 'whatsapp':
            if (!username) return message.channel.send(":no_mouth: **Write your mobile number in WhatsApp . **");
            infos[message['author'].id].WhatsApp = username;
            saveinfos();
            return message.channel.send(":blush: **Your Number Phone has been saved in Whatsapp .** ");
            break;
 
        }
        break;
    case prefix + "removeinfo":
        if (!infos[message['author'].id]) infos[message['author'].id] = {
                        "instagram": "",
                        "facebook": "nothing.",
                        "twitter": "nothing.",
                        "pubg": "nothing.",
                                "WhatsApp": "nothing."
        };
        saveinfos();
        const msg = await message['channel'].send(":no_mouth:  **Are you ready to delete all your information? Write , yes  Or  no ** ");
 
        message['channel'].awaitMessages(m => (m['author'].id == message['author'].id) && ((m['content'].startsWith("yes")) || m['content'].startsWith("no")), {
          
                time: 1000 * 64,
                errors: ["time"],
                max: 1
            })
            .then(async (collected) => {
                if (collected['first']().content.startsWith("yes")) {
                    infos[ message['author'].id] = {
                        "instagram": "nothing.",
                        "facebook": "nothing.",
                        "twitter": "nothing.",
                        "pubg": "nothing.",
                                "WhatsApp": "nothing."
                    }
                    saveinfos();
                    msg.delete();
                    message.channel.send(":blush: **All your information has been deleted .**");
                } else if (collected['first']().content.startsWith("no")) {
                    msg.delete();
                    return message.channel.send(":no_mouth: ** The process is closed .**   ");
                }
            })
        break;
    }
});

client.on("message", message => {
  var canvas = require ('canvas');
  if (message.author.bot) return;
  if (!message.channel.guild) return;
  if (message.content.startsWith(prefix + "information")) {
  var user = ((message['mentions'].users.first()) || (message['author']));
        if (!infos[ user['id']]) infos[user['id']] = {
                        "instagram": "nothing.",
                        "facebook": "nothing.",
                        "twitter": "nothing.",
                        "pubg": "nothing.",
                                "WhatsApp": "nothing."
        };
        saveinfos();
    var human = message.mentions.users.first();

    var author;
    if (human) {
      author = human;
    } else {
      author = message.author;
    }
    var mentionned = message.mentions.members.first();
    var ah;
    if (mentionned) {
      ah = mentionned;
    } else {
      ah = message.member;
    }
    var ment = message.mentions.users.first();
    var getvalueof;
    if (ment) {
      getvalueof = ment;
    } else {
      getvalueof = message.author;
    }
    var mentionned = message.mentions.users.first();

    var client;
    if (mentionned) {
      var client = mentionned;
    } else {
      var client = message.author;
    }
    let Image = Canvas.Image,
      canvas = Canvas.createCanvas(593, 547),
      ctx = canvas.getContext("2d");
    const rg = ["./december.png"]; 
    fs.readFile(`${rg[Math.floor(Math.random() * rg.length)]}`, function(
      err,
      Background
    ) {
      if (err) return console.log(err);
      let id = Canvas.Image;
      let ground = new Image();
      ground.src = Background;
        ctx.drawImage(ground, 0, 0, 593, 547);
    });

    let url = getvalueof.displayAvatarURL.endsWith(".webp")
      ? getvalueof.displayAvatarURL.slice(5, -20) + ".png"
      : getvalueof.displayAvatarURL;
    jimp.read(url, (err, ava) => {
      if (err) return console.log(err);
      ava.getBuffer(jimp.MIME_PNG, (err, buf) => {
        if (err) return console.log(err);

        // N A M E
        ctx.font = "bold 26px Arial";
        ctx.fontSize = "26px";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(`${getvalueof.username}`, 301, 49);

        // whats app
        
        ctx.font = "bold 26px Arial";
        ctx.fontSize = "26px";
        ctx.fillStyle = "#8ad356";
        ctx.textAlign = "center";
        ctx.fillText(infos[user['id']].WhatsApp,  317, 405);

        // facebook
        ctx.font = "bold 26px Arial";
        ctx.fontSize = "26px";
        ctx.fillStyle = "#0935df";
        ctx.textAlign = "center";
        ctx.fillText(infos[user['id']].facebook, 316, 235);
        
        // instagram 
        ctx.font = "bold 26px Arial";
        ctx.fontSize = "26px";
        ctx.fillStyle = "#b44b7c";
        ctx.textAlign = "center";
        ctx.fillText(infos[user['id']].instagram, 316, 316);
        
        //twitter 
        ctx.font = "bold 26px Arial";
        ctx.fontSize = "26px";
        ctx.fillStyle = "#7de1ec";
        ctx.textAlign = "center";
        ctx.fillText(infos[user['id']].twitter, 316, 153);
        
        //pubg Mobile
        ctx.font = "bold 26px Arial";
        ctx.fontSize = "26px";
        ctx.fillStyle = "#ffef00";
        ctx.textAlign = "center";
        ctx.fillText(infos[user['id']].pubg, 317, 484);
        
        //avatar 
        /*
        let Avatar = Canvas.Image;
        let ava = new Avatar();
        ava.src = buf;
        ctx.beginPath();
        ctx.beginPath();
        ctx.arc(69.5, 114, 40, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(ava, 28, 73, 87, 86);
*/
        message.channel.startTyping();
        message.channel.stopTyping();
        message.channel.sendFile(canvas.toBuffer());
      });
    });
  }
});
/////////////////////////////////////////////// End Code Register Your Info ///////////////////////////////////////////////


client.on("message", message => {
  if (message.content.startsWith(prefix + "info-setup")) {
    if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (message.author.bot || message.channel.type == "dm") return;
    let mnt = message.mentions.users.first();
    let user = mnt || message.author;
    let userEmbed = new Discord.RichEmbed()
      .setColor("#fd0000")
      .setThumbnail(user.avatarURL)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setDescription(``)
      .addField(
        `How To setup The your info In Pubg ?`,
        `**${prefix}setinfo pubg [ID PUBG]** to Setup info pubg`)
      .addField(
        `How To setup The your info In Facebook ?`,
        `**${prefix}setinfo facebook [NAME]** to setup info Facebook`
      )
          .addField(
        `How To setup The your info In Instagram?`,
        `**${prefix}setinfo Instagram [NAME]** to setup info Instagram`
      )
          .addField(
        `How To setup The your info In WhatsApp?`,
        `**${prefix}setinfo WhatsApp [Number]** to setup info WhatsApp`
      )
    .addField(
      `How To setup The your info In twitter`,
    `**${prefix}setinfo twitter [NAME]** to setup info twitter`)
      .addField(
        "Do you still not understand .?",
        "[Click here to Join Support Server](https://discord.gg/mJyzyaZ)"
      );
    message.author.send(userEmbed).catch(console.error);
    return message.react("✅");
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////



client.on("message", message => {
  if (message.author.codes) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);

  if (message.content.startsWith(prefix + "ban")) {
    if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.guild.member(message.author).hasPermission("BAN_MEMBERS"))
      return message.channel.send(``);
    if (!message.guild.member(client.user).hasPermission("BAN_MEMBERS"))
      return message.channel.sendMessage(
        " :no_mouth:  **I couldn't ban that user, Please Check me role and permissions Then try again**"
      );
    let user = message.mentions.users.first();
     if(!user) return message.channel.send(`:no_mouth:  **I don't see this member.**`);
      if(user.id === message.author.id) return message.channel.send(' :no_mouth: **You cannot banned yourself  .**');
       if(message.guild.member(user).highestRole.position >= message.guild.member(message.member).highestRole.position) return message.channel.send(`:no_mouth: **You cannot banned this user because he has a higher role .**`);    
        if (!message.guild.member(user).bannable)
         return message.channel.sendMessage(
          "  :no_mouth:  **I couldn't ban that user, Please Check me role and permissions Then try again**"
      );
          message.guild.member(user).ban(7, user);

           message.channel.send(
      `**the user \`${user.username}\` has been Banned,** :airplane: `
    );
  }
});

client.on("message", message => {
  if (message.author.codes) return;
  if (!message.content.startsWith(prefix)) return;

  var command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  var args = message.content.split(" ").slice(1);

  if (message.content.startsWith(prefix + "kick")) {
    if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    if (!message.guild.member(message.author).hasPermission("KICK_MEMBERS"))
      return message.channel.send(``);
    if (!message.guild.member(client.user).hasPermission("KICK_MEMBERS"))
      return message.channel.sendMessage(
        " :no_mouth:  **I couldn't kick that user, Please Check me role and permissions Then try again**"
      );
    let user = message.mentions.users.first();

        if(!user) return message.channel.send(`:no_mouth:  **I don't see this member.**`);
     if(user.id === message.author.id) return message.channel.send(' :no_mouth: **You cannot kick yourself out .**');
      if(message.guild.member(user).highestRole.position >= message.guild.member(message.member).highestRole.position) return message.channel.send(`:no_mouth: **You cannot kick this user because he has a higher role .**`); 

    if (!message.guild.member(user).bannable)
      return message.channel.sendMessage(
        " :no_mouth:  **I couldn't kick that user, Please Check me role and permissions Then try again**"
      );

    message.guild.member(user).kick(7, user);

    message.channel.send(
      `**the user \`${user.username}\` has been Kicked,** :airplane: `
    );
    
  }
});



//
client.on ('message', async (message) => {
   if (!message.guild || message.author.bot) return;
    if (message.content.startsWith (prefix + 'send')) {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
     if (!message.member.hasPermission("ADMINISTRATOR")) return;
      message.delete ().catch (err => undefined);
       if (!message.content.split(' ') [1]) return message.channel.send (":no_mouth: ** i do not see this channel**").then (M => M.delete (5000 * 2));
        var channel = message.guild.channels.find (r => r.name === message.content.split(' ') [1]);
         if (!channel) return message.channel.send (":no_mouth: ** i do not see this channel**").then (M => M.delete (5000 * 2));
          if (!message.content.split(' ').slice(2).join(' ')) return message.channel.send (":blush: **Please write your message .**").then (M => M.delete (5000 * 2));
           if (message.content.split(' ').slice(2).join(' ').length >= 2048)  return message.channel.send ("");
            channel.send (new Discord.RichEmbed()
             .setThumbnail("")
              .setAuthor( `${message.guild.name}`,  message.guild.iconURL || message.guild.avatarURL )
                .setColor('#ff00d8')
                 .setDescription (message.content.split(' ').slice(2).join(' ')));
      
                      
    }
})
//
/*
client.on ('message', async (message) => {
   if (!message.guild || message.author.bot) return;
    if (message.content.startsWith (prefix + 'talk')) {
     if (!message.member.hasPermission("ADMINISTRATOR")) return;
      message.delete ().catch (err => undefined);
       if (!message.content.split(' ') [1]) return message.channel.send ("انا لا اري هذه القناه").then (M => M.delete (5000 * 2));
        var channel = message.guild.channels.find (r => r.name === message.content.split(' ') [1]);
         if (!channel) return message.channel.send ("انا لا اري هذه القناه").then (M => M.delete (5000 * 2));
          if (!message.content.split(' ').slice(2).join(' ')) return message.channel.send ("اكتب الرساله المراد ارسالها للقناة الان").then (M => M.delete (5000 * 2));
           if (message.content.split(' ').slice(2).join(' ').length >= 2000)  return message.channel.send ("الرساله اكتر من 2 الف حرف ولا يمكنني ارسالها);
            channel.send (new Discord.RichEmbed()
                      .setAuthor( `${message.guild.name}`,  message.guild.iconURL || message.guild.avatarURL )
                      .setColor('RANDOM')
                       .setDescription (message.content.split(' ').slice(2).join(' ')));
      
                      
    }
})
*/
/// كود عمل روم صور فقط 
const pics = JSON.parse(fs.readFileSync('./pics.json' , 'utf8'));
 client.on('message', message => {
         if (!message.channel.guild) return;
 
  let room = message.content.split(" ").slice(1);
  let findroom = message.guild.channels.find('name', `${room}`)
  if(message.content.startsWith(prefix + "setphoto")) {
    if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
      if(!message.channel.guild) return;
      if(!message.member.hasPermission('ADMINISTRATOR')) return;
      if(!room) return message.channel.send(':no_mouth: **I don\'t see this channel .**')
      if(!findroom) return message.channel.send(':no_mouth:  **I don\'t see this channel . **')
      let embed = new Discord.RichEmbed()
      .setTitle('**The photo channel was created successfully .**')
      .addField('In Channel:', `${room}`)
      .addField('Done By', `${message.author}`)
      .setThumbnail(message.author.avatarURL)
      .setFooter(``)
      message.channel.sendEmbed(embed)
      pics[message.guild.id] = {
      channel: room,
      onoff: 'On'
      },
      fs.writeFile("./pics.json", JSON.stringify(pics), (err) => {
      if (err) console.error(err)
     
      })
    }})
 
 
 
client.on('message', message => {
 
  if(message.content.startsWith(prefix + "togglephoto")) {
    if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
          if (!message.channel.guild) return;
 
      if(!message.channel.guild) return;
      if(!message.member.hasPermission('ADMINISTRATOR')) return;
      if(!pics[message.guild.id]) pics[message.guild.id] = {
        onoff: 'Off'
      }
        if(pics[message.guild.id].onoff === 'Off') return [message.channel.send(`:green_circle: **The photo channel is On **`), pics[message.guild.id].onoff = 'On']
        if(pics[message.guild.id].onoff === 'On') return [message.channel.send(`:red_circle: **The photo channel is Off **`), pics[message.guild.id].onoff = 'Off']
        fs.writeFile("./pics.json", JSON.stringify(pics), (err) => {
          if (err) console.error(err)
         
          })
        }
       
      })
     
             client.on('message', message => {
                       if (!message.channel.guild) return;
  if(message.author.bot) return;
 
        if(!pics[message.guild.id]) pics[message.guild.id] = {
        onoff: 'Off'
      }
        if(pics[message.guild.id].onoff === 'Off') return;
 
  if(message.channel.name !== `${pics[message.guild.id].channel}`) return;
 
   let types = [
    'jpg',
    'jpeg',
    'png',
    'http://prntscr.com/'
  ]
   if (message.attachments.size <= 0) {
    message.delete();
    message.channel.send(``)
    .then(msg => {
      setTimeout(() => {
        msg.delete();
      }, 5000)
  })
  return;
}
   if(message.attachments.size >= 1) {
    let filename = message.attachments.first().filename
    console.log(filename);
    if(!types.some( type => filename.endsWith(type) )) {
      message.delete();
      message.channel.send(``)
      .then(msg => {
        setTimeout(() => {
          msg.delete();
        }, 5000)
      })
      .catch(err => {
        console.error(err);
    });
    }
  }
 })
client.on('message', message => {
  if(message.content.startsWith(prefix + "infophoto")) {
    if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
          if(!message.member.hasPermission('ADMINISTRATOR')) return;
let embed = new Discord.RichEmbed()
.addField('► Status', `${pics[message.guild.id].onoff}`)
.addField('► in Channel', `${pics[message.guild.id].channel}`)
.setThumbnail(message.author.avatarURL)
message.channel.sendEmbed(embed)
  }})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 




/*

const muteconf = require('./mutes.json');
 
client.on("guildMemberAdd", async (member) => {
        if (muteconf[member.user.id+"."+member.guild.id].mutt == "on") {
          let role = member.guild.roles.find(r => r.name === 'Mute');
          if (!role) return;
          member.addRole(role.id)
        } else {
            return;
        }
});
 
client.on('message', async message =>{
 
  if (message.author.omar) return;
  if (!message.content.startsWith(prefix)) return;
  if(!message.channel.guild) return;
  if(!message.member.hasPermission('MANAGE_ROLES'));
  if(!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return message.channel.send(":no_mouth: **I couldn't Mute that user, Please Check me role and permissions Then try again**");
  var command = message.content.split(" ")[0];
  command = command.slice(prefix.length);
  var args = message.content.split(" ").slice(1);
  if (message.content.startsWith(prefix + "mute")) {
    if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
      let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if(!tomute) return message.channel.send(":no_mouth: **I don't see this member.**");
          if (!message.guild.member(tomute).bannable)
      return message.channel.sendMessage(":no_mouth: **I couldn't Mute that user, Please Check me role and permissions Then try again**");
            if(message.guild.member(tomute).highestRole.position >= message.guild.member(message.member).highestRole.position) return message.channel.send(`:no_mouth: **You cannot Mute this user because he has a higher role .**`); 
     if(tomute.id === message.author.id) return message.channel.send(' :no_mouth: **You cannot Mute yourself .**');
      if(tomute.hasPermission("MANAGE_MESSAGES")) return;
      let muterole = message.guild.roles.find(`name`, "Mute");
 
      if(!muterole){
        try{
          muterole = await message.guild.createRole({
            name: "Mute",
            color: "#000000",
            permissions:[]
          })
          message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muterole, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false
            });
          });
        }catch(e){
          console.log(e.stack);
        }
      }
 
      await(tomute.addRole(muterole.id));
      message.channel.send(`**the user \`${tomute.user.username}\` has been Mute,** :zipper_mouth: `);
  //    if(!muteconf[tomute.id+"."+message.guild.id]){
        muteconf[tomute.id+"."+message.guild.id] = {
         mutt: "on",
         roleid: muterole.id
        };
      fs.writeFileSync('./mutes.json', JSON.stringify(muteconf, null, 4));
        message.delete();
 
    }
  });
  */
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
client.on('message', async message => {
            if(!reply[message.guild.id]) reply[message.guild.id] = {
          onoff: 'Off'
        }
          if(reply[message.guild.id].onoff === 'Off') return;
   if(message.content === reply[message.guild.id].msg) {
       message.channel.send(reply[message.guild.id].reply)
   }}
)
const reply = JSON.parse(fs.readFileSync('./reply.json' , 'utf8'));
client.on('message', async message => {
    let messageArray = message.content.split(" ");
   if(message.content.startsWith(prefix + "1set auto reply")) {
     if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    let filter = m => m.author.id === message.author.id;
    let thisMessage;
    let thisFalse;

    if(!message.member.hasPermission("ADMINISTRATOR")) return;
    
    
    message.channel.send(':pencil: **Type The Message Now . **').then(msg => {

        message.channel.awaitMessages(filter, {
          max: 1,
          time: 90000,
          errors: ['time']
        })
        .then(collected => {
            collected.first().delete();
            thisMessage = collected.first().content;
            let boi;
            msg.edit(' :slight_smile: **Type reply Message now .**').then(msg => {
      
                message.channel.awaitMessages(filter, {
                  max: 1,
                  time: 90000,
                  errors: ['time']
                })
                .then(collected => {
                    collected.first().delete();
                    boi = collected.first().content;
                    msg.edit('­').then(msg => {
        
                      message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 90000,
                        errors: ['time']
                      })
                      let embed = new Discord.RichEmbed()
                      .setTitle(':white_check_mark: **Auto Reply Has Been Create Successfully .**')
                      .addField('The Message', `**${thisMessage}**`)
                      .addField('The Reply ', `**${boi}**`)
                      .setThumbnail(message.author.avatarURL)
                      .setFooter(message.guild.name, message.guild.iconURL);
                     message.channel.sendEmbed(embed)
    reply[message.guild.id] = {
        msg: thisMessage,
        reply: boi,
        onoff: 'On'
    }
    fs.writeFile("./reply.json", JSON.stringify(reply), (err) => {
    if (err) console.error(err)
  })
   } 
            )
        })
    })
})
    })
}})      
///////////////////////////
client.on('message', async message => {
                if(!reply2[message.guild.id]) reply2[message.guild.id] = {
          onoff: 'Off'
        }
          if(reply2[message.guild.id].onoff === 'Off') return;
   if(message.content === reply2[message.guild.id].msg) {
       message.channel.send(reply2[message.guild.id].reply)
   }}
)
const reply2 = JSON.parse(fs.readFileSync('./replys2.json' , 'utf8'));
client.on('message', async message => {
    let messageArray = message.content.split(" ");
   if(message.content === '.2set auto reply') {
     if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    let filter = m => m.author.id === message.author.id;
    let thisMessage;
    let thisFalse;

    if(!message.member.hasPermission("ADMINISTRATOR")) return;

    
    message.channel.send(':pencil: **Type The Message Now . **').then(msg => {

        message.channel.awaitMessages(filter, {
          max: 1,
          time: 90000,
          errors: ['time']
        })
        .then(collected => {
            collected.first().delete();
            thisMessage = collected.first().content;
            let boi;
            msg.edit(' :slight_smile: **Type reply Message now .**').then(msg => {
      
                message.channel.awaitMessages(filter, {
                  max: 1,
                  time: 90000,
                  errors: ['time']
                })
                .then(collected => {
                    collected.first().delete();
                    boi = collected.first().content;
                    msg.edit('­').then(msg => {
        
                      message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 90000,
                        errors: ['time']
                      })
                      let embed = new Discord.RichEmbed()
                      .setTitle(':white_check_mark: **Auto Reply 2 Has Been Create Successfully .**')
                      .addField('The Message', `**${thisMessage}**`)
                      .addField('The Reply ', `**${boi}**`)
                      .setThumbnail(message.author.avatarURL)
                      .setFooter(message.guild.name, message.guild.iconURL);
                     message.channel.sendEmbed(embed)
    reply2[message.guild.id] = {
        msg: thisMessage,
        reply: boi,
               onoff: 'On'
    }
    fs.writeFile("./replys2.json", JSON.stringify(reply2), (err) => {
    if (err) console.error(err)
  })
   } 
            )
        })
    })
})
    })
}})     
/////////////////////////////////////////
client.on('message', async message => {
                if(!reply3[message.guild.id]) reply3[message.guild.id] = {
          onoff: 'Off'
        }
          if(reply3[message.guild.id].onoff === 'Off') return;
   if(message.content === reply3[message.guild.id].msg) {
       message.channel.send(reply3[message.guild.id].reply)
   }}
)

const reply3 = JSON.parse(fs.readFileSync('./replys3.json' , 'utf8'));
client.on('message', async message => {
    let messageArray = message.content.split(" ");
   if(message.content.startsWith(prefix + "3set auto reply")) {
     if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
    let filter = m => m.author.id === message.author.id;
    let thisMessage;
    let thisFalse;

    if(!message.member.hasPermission("ADMINISTRATOR")) return;

    
    message.channel.send(':pencil: **Type The Message Now . **').then(msg => {

        message.channel.awaitMessages(filter, {
          max: 1,
          time: 90000,
          errors: ['time']
        })
        .then(collected => {
            collected.first().delete();
            thisMessage = collected.first().content;
            let boi;
            msg.edit(' :slight_smile: **Type reply Message now .**').then(msg => {
      
                message.channel.awaitMessages(filter, {
                  max: 1,
                  time: 90000,
                  errors: ['time']
                })
                .then(collected => {
                    collected.first().delete();
                    boi = collected.first().content;
                    msg.edit('­').then(msg => {
        
                      message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 90000,
                        errors: ['time']
                      })
                      let embed = new Discord.RichEmbed()
                      .setTitle(':white_check_mark: **Auto Reply 3 Has Been Create Successfully .**')
                      .addField('The Message', `**${thisMessage}**`)
                      .addField('The Reply ', `**${boi}**`)
                      .setThumbnail(message.author.avatarURL)
                      .setFooter(message.guild.name, message.guild.iconURL);
                     message.channel.sendEmbed(embed)
    reply3[message.guild.id] = {
        msg: thisMessage,
        reply: boi,
               onoff: 'On'
    }
    fs.writeFile("./replys3.json", JSON.stringify(reply3), (err) => {
    if (err) console.error(err)
  })
   } 
            )
        })
    })
})
    })
}})    
////////////////
////////////////////////////////////////////////// turn off + turn on . the auto reply ////////////////////
/* // تحت التصليح
client.on('message', message => {
    if(message.content.startsWith(prefix + "auto reply1 on")) {
        if(!message.channel.guild) return;
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
reply[message.guild.id] = {
onoff: 'On',
}
message.channel.send(`:green_circle: **The Auto Reply 1 __On__ **`)
          fs.writeFile("./reply.json", JSON.stringify(reply), (err) => {
            if (err) console.error(err)
            .catch(err => {
              console.error(err);
          });
            });
          }

        })

client.on('message', message => {
    if(message.content.startsWith(prefix + "auto reply2 on")) {
        if(!message.channel.guild) return;
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
reply2[message.guild.id] = {
onoff: 'On',
}
message.channel.send(`:green_circle: **The Auto Reply 2 __On__ **`)
          fs.writeFile("./replys2.json", JSON.stringify(reply2), (err) => {
            if (err) console.error(err)
            .catch(err => {
              console.error(err);
          });
            });
          }

        })
        client.on('message', message => {
            if(message.content.startsWith(prefix + "auto reply3 on")) {
                if(!message.channel.guild) return;
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
        reply3[message.guild.id] = {
        onoff: 'On',
        }
        message.channel.send(`:green_circle: **The Auto Reply 3 __On__ **`)
                  fs.writeFile("./replys3.json", JSON.stringify(reply3), (err) => {
                    if (err) console.error(err)
                    .catch(err => {
                      console.error(err);
                  });
                    });
                  } 
        
                })
                
*/
                
  /*
   client.on('message', message => {
    if(message.content.startsWith(prefix + "delete auto reply1")) {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
        if(!message.channel.guild) return;
                    if(!message.member.hasPermission("ADMINISTRATOR")) return;
reply[message.guild.id] = {
onoff: 'Off',
}
message.channel.send(`:slight_smile: **The Auto Reply 1 Been Deleted **`)
          fs.writeFile("./reply.json", JSON.stringify(reply), (err) => {
            if (err) console.error(err)
            .catch(err => {
              console.error(err);
          });
            });
          }

        })

client.on('message', message => {
    if(message.content.startsWith(prefix + "delete auto reply2")) {
      if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
        if(!message.channel.guild) return;
                    if(!message.member.hasPermission("ADMINISTRATOR")) return;
reply2[message.guild.id] = {
onoff: 'Off',
}
message.channel.send(`:slight_smile: **The Auto Reply 2 Been Deleted **`)
          fs.writeFile("./replys2.json", JSON.stringify(reply2), (err) => {
            if (err) console.error(err)
            .catch(err => {
              console.error(err);
          });
            });
          }

        })
        client.on('message', message => {
            if(message.content.startsWith(prefix + "delete auto reply3")) {
              if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
                if(!message.channel.guild) return;
                    if(!message.member.hasPermission("ADMINISTRATOR")) return;

        reply3[message.guild.id] = {
        onoff: 'Off',
        }
        message.channel.send(`:slight_smile: **The Auto Reply 3 Been Deleted **`)
                  fs.writeFile("./replys3.json", JSON.stringify(reply3), (err) => {
                    if (err) console.error(err)
                    .catch(err => {
                      console.error(err);
                  });
                    });
                  }
        
                })
*/
//////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////// profile 

const { User, MessageMentions } = require('discord.js') 
const ms = require('parse-ms'); 
const pretty = require("pretty-ms")
const devs = ["554553279003099146"]
const ids = ["554553279003099146"]

SQLite.open(path.join(__dirname, 'profile.db')).then(() => {
SQLite.run(`CREATE TABLE IF NOT EXISTS profileSystem (id VARCHAR(30), credits BIGINT, lastDaily BIGINT, xp BIGINT, level BIGINT, rep BIGINT, lastRep BIGINT,info TEXT)`)}).catch(err => console.error(err))
let funcs = {generateInt: (low, high) => {return Math.floor(Math.random() * (high - low + 1) + low);},getLevelFromExp: (exp) => {let level = 0;
while (exp >= funcs.getLevelExp(level)) {exp -= funcs.getLevelExp(level);level++;}return level;},
getLevelExp: (level) => {return 5 * (Math.pow(level, 2)) + 50 * level + 100;}}
client.on('message', async msg => {
if(!msg.channel.guild) return;
SQLite.get(`SELECT * FROM profileSystem WHERE id = '${msg.author.id}'`).then(res => {var s;let xp = funcs.generateInt(1, 5);
if(!res) s = `INSERT INTO profileSystem VALUES ('${msg.author.id}', 1, 0, ${xp}, 0, 0, 0, "")`
if(res) {xp = res.xp + xp;
let level = funcs.getLevelFromExp(xp);let lvl = res.level;
/*if(res.level != level) {
lvl++;
msg.channel.send('Level UP!, ' + msg.author + ' just reached level ' + level)} */

s = `UPDATE profileSystem SET xp = ${xp}, level = ${lvl} WHERE id = '${msg.author.id}'`}SQLite.run(s);}).catch(err => console.error(err))
if(!msg.content.startsWith(prefix)) return undefined;let args = msg.content.split(' ');
if(args[0].toLowerCase() == `${prefix}coin` || args[0].toLowerCase() === `${prefix}coins`) {let xp = funcs.generateInt(1, 5);
const mention = msg.mentions.users.first() || client.users.get(args[1]) || msg.author;const mentionn = msg.mentions.users.first() || client.users.get(args[1]);
if(blacklist[client.user.id + msg.author.id]) return msg.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
let res = await SQLite.get(`SELECT * FROM profileSystem WHERE id = '${mention.id}'`)
if(!res) SQLite.run(`INSERT INTO profileSystem VALUES ('${mention.id}', 1, 0, ${xp}, 0, 0, 0, ""`)
let credits;if(!res) credits = 0;else credits = res.credits;
let resOfAuthor = await SQLite.get(`SELECT * FROM profileSystem WHERE id = '${msg.author.id}'`)
if(!resOfAuthor) SQLite.run(`INSERT INTO profileSystem VALUES ('${msg.author.id}', 1, 0, ${xp}, 0, 0, 0, ""`)
let creditsOfAuthor = resOfAuthor.credits;
if(!args[2]){msg.channel.send(`:money_mouth: **${mention.username} Your Current Coins is \`$${credits}\` .**`)}else if(mentionn && args[2]) {
if(args[2] < 1) return msg.channel.send(``);if(mention.bot) return msg.channel.send(`:no_mouth: **you cann'ot give coins to bot . **`);if(mentionn.id === msg.author.id) return msg.channel.send(`:no_mouth: **you cann'ot give coins to yourself . **`);
if(args[2].includes("-")) return msg.channel.send(``);if(args[2].includes(".")) return msg.channel.send(`:no_mouth: **you cann'ot give coins to bot . **`);
let resOfMen = await SQLite.get(`SELECT * FROM profileSystem WHERE id = '${mentionn.id}'`);
if(!resOfMen) SQLite.run(`INSERT INTO profileSystem VALUES ('${mentionn.id}', 1, 0, ${xp}, 0, 0, 0, ""`)
let creditsOfMen = resOfMen.credits;
if(isNaN(args[2])) return msg.channel.send(`:no_mouth: **Please write the right number Of coins to send . **`);if(args[2] > creditsOfAuthor) return msg.channel.send(`:no_mouth: **You do not have this number of coins . **`);
let first = Math.floor(Math.random() * 9);let second = Math.floor(Math.random() * 9);let third = Math.floor(Math.random() * 9);let fourth = Math.floor(Math.random() * 9);let num = `${first}${second}${third}${fourth}`;
let canvas = Canvas.createCanvas(150 , 50)
let ctx = canvas.getContext('2d');
const background = await Canvas.loadImage("https://cdn.discordapp.com/attachments/688018863698346077/688279962792493110/70e34c1810f9c476.png");
ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
let url = msg.author.displayAvatarURL.endsWith(".webp") ? msg.author.displayAvatarURL.slice(5, -20) + ".gif" : msg.author.displayAvatarURL;
jimp.read(url, (err, ava) => {if(err) return console.log(err);ava.getBuffer(jimp.MIME_PNG, (err, buf) => {if(err) return console.log(err);
ctx.font = "20px Arial";ctx.fontSize = "20px";ctx.fillStyle = "#FFFFFF";
msg.channel.send(`**${msg.author.username} ,** If you are ready to send \`$${args[2]}\` coins to **${mentionn}** , write the number below`).then(essss => {
ctx.fillText(num, canvas.width / 3.0, canvas.height / 1.6);
msg.channel.sendFile(canvas.toBuffer()).then(m => {msg.channel.awaitMessages(r => r.author.id === msg.author.id, { max: 1, time: 60000, errors:['time'] }).then(collected => {if(collected.first().content === num) {
client.channels.get("691759589951143956").send(`
ــــــــــــــــــــــــــــــــــــــــــــــــــــ
**The sender : ${msg.author.username} | (\`${msg.author.id}\`)
to : ${mentionn.username} | ( \`${mentionn.id}\`)
the amount : \`$${args[2]}\` **
ــــــــــــــــــــــــــــــــــــــــــــــــــــ`);
msg.channel.send(`**:moneybag: ${msg.author.username},** transferred \`$${args[2]}\` Coins to **${mentionn.username} ( ${mentionn.id} ) .**`);
mention.send(`:moneybag: **Successful Operation .**
**Done transfer for you \`$${args[2]}\` Coins from ${msg.author.username} ( ${msg.author.id} )**`);
m.delete();
let newAuthorCredits = (creditsOfAuthor - parseInt(args[2]));
let newMenCredits = (creditsOfMen + parseInt(args[2]));
SQLite.run(`UPDATE profileSystem SET credits = ${newAuthorCredits} WHERE id = '${msg.author.id}'`);
SQLite.run(`UPDATE profileSystem SET credits = ${newMenCredits} WHERE id = '${mentionn.id}'`);}else{m.delete();
essss.delete();}})})})})})}else{msg.channel.send(``);}}else 
if(msg.content.startsWith(prefix + "daily")){
  if(blacklist[client.user.id + msg.author.id]) return msg.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
let daily = 86400000;let xp = funcs.generateInt(1, 5);let amount = funcs.generateInt(257,1101);
let res = await SQLite.get(`SELECT * FROM profileSystem WHERE id = '${msg.author.id}'`)
if(!res) SQLite.run(`INSERT INTO profileSystem VALUES ('${msg.author.id}', 1, 0, ${xp}, 0, 0, 0, ""`)
let curDaily = res.lastDaily;let credits = res.credits;if(curDaily != null && daily - (Date.now() - curDaily) > 0) {let timeObj = ms(daily - (Date.now() - curDaily));
msg.channel.send(`** 🕑 You've already get the daily coins , it try again at \`${timeObj.hours} Hours, ${timeObj.minutes} Minutes and ${timeObj.seconds} Seconds.\` **`)}else{msg.channel.send(`** :moneybag: ${msg.author.username} You're got \`\`$${amount}\`\` daily Coins .**`);
SQLite.run(`UPDATE profileSystem SET credits = ${credits + amount}, lastDaily = ${Date.now()} WHERE id = '${msg.author.id}'`);}}
    });

client.on('message',async message => {
   
if(!message.channel.guild) return;
if(message.author.bot || message.channel.type === 'dm' || !message.content.startsWith(prefix)) return;let args = message.content.split(" ").slice(1);let cmd = message.content.split(" ")[0].substring(prefix.length);let xp = funcs.generateInt(1, 5); 
if(cmd === "note") {let december = args.join(" ");if(message.mentions.users.size >= 1) return;
if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
if(december.length < 1) return message.channel.send(`:no_mouth: **Write your note before send .**`)
if(december.length > 29) return message.channel.send(`:no_mouth: **You cannot type more than 29 characters .**`)
let res = await SQLite.get(`SELECT * FROM profileSystem WHERE id = '${message.author.id}'`);if(!res) SQLite.run(`INSERT INTO profileSystem VALUES ('${message.author.id}', 1, 0, ${xp}, 0, 0, 0, ""`)
SQLite.run(`UPDATE profileSystem SET info = "${december}" WHERE id = '${message.author.id}'`)
message.react('✅')}})
client.on('message',async msg => {
if(!msg.channel.guild) return;
if(msg.content.startsWith (prefix + "rep"))
  
{let rep = 86400000;let xp = funcs.generateInt(1, 5);let men = msg.mentions.users.first();
  if(blacklist[client.user.id + msg.author.id]) return msg.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
if(!men) return msg.channel.send(`:no_mouth: **${msg.author.username},** i don't see this member !`);
if(men.id === msg.author.id) return msg.channel.send('😶 **You cann\'ot give Reputation to yourself.**');
if(men.bot) return msg.channel.send('😶 **You cann\'ot give bots Reputation . **')
let resOfMen = await SQLite.get(`SELECT * FROM profileSystem WHERE id = '${men.id}'`);
let resOfAuthor = await SQLite.get(`SELECT * FROM profileSystem WHERE id = '${msg.author.id}'`)
if(!resOfMen) SQLite.run(`INSERT INTO profileSystem VALUES ('${men.id}', 1, 0, 0, 0, 0, 0, "")`)
if(!resOfAuthor) SQLite.run(`INSERT INTO profileSystem VALUES ('${msg.author.id}', 1, 0, ${xp}, 0, 0, 0, ""`)
let curRep = resOfAuthor.lastRep;if(curRep != null && rep - (Date.now() - curRep) > 0) {let timeObj = ms(rep - (Date.now() - curRep));
msg.channel.send(`:clock4: **| You already gived your Reputation point to someone, try again after** \`${timeObj.hours} Hours, ${timeObj.minutes} Minutes and ${timeObj.seconds} Seconds.\` `)}else{
msg.channel.send(`:up: **${msg.author.username} ,** Was given a Reputation point to **${men} ** !`)
SQLite.run(`UPDATE profileSystem SET lastRep = ${Date.now()} WHERE id = '${msg.author.id}'`)
SQLite.run(`UPDATE profileSystem SET rep = ${resOfMen.rep + 1} WHERE id = '${men.id}'`)}}
  
if(msg.content.startsWith ("+coins")) {
if(!ids.includes(msg.author.id)) return;
let men = msg.mentions.users.first() || msg.author;
let args = msg.content.split(" ").slice(1);let res = await SQLite.get(`SELECT * FROM profileSystem WHERE id = '${men.id}'`);
if(!res) SQLite.run(`INSERT INTO profileSystem VALUES ('${men.id}', 200, 0, 0, 0, 0, 0, "")`)
let resu;
if(men.id === msg.author.id && !msg.mentions.users.first()) resu = args[0];
else resu = args[1];
if(!resu || isNaN(resu)) return msg.channel.send(':no_mouth: **Please specify the amount of coins first ,**');
SQLite.run(`UPDATE profileSystem SET credits = ${res.credits + parseInt(resu)} WHERE id = '${men.id}'`)
msg.channel.send(`:slight_smile: **Done Added \`$${args[1]}\` Coins to ${men} , (${men.id})**`)}else 
if(msg.content.startsWith ("+rep")) {
  
let args = msg.content.split(" ").slice(1);
if(!ids.includes(msg.author.id)) return;let men = msg.mentions.users.first() || msg.author;
let res = await SQLite.get(`SELECT * FROM profileSystem WHERE id = '${men.id}'`);
if(!res) SQLite.run(`INSERT INTO profileSystem VALUES ('${men.id}', 200, 0, 0, 0, 0, 0, "")`)
let resu;
if(men.id === msg.author.id && !msg.mentions.users.first()) resu = args[0];
else resu = args[1];
if(!resu || isNaN(resu)) return msg.channel.send(':no_mouth: **Please specify how much you want to add rep , **');
SQLite.run(`UPDATE profileSystem SET rep = ${res.rep + parseInt(resu)} WHERE id = '${men.id}'`)
msg.channel.send(`:slight_smile: ** Done Added \`+${args[1]}\` Reputation to ${men} , (${men.id})**`)}
  });
client.on("message",async message => {let xp = funcs.generateInt(1, 5);
if(!message.channel.guild) return;
let args = message.content.split(' ');
const getvalueof = message.mentions.users.first() || client.users.get(args[1]) || message.author;
if (message.content.startsWith(prefix + "profile")) {
  if(blacklist[client.user.id + message.author.id]) return message.channel.send(`:disappointed: **You are blacklisted from using this bot . **`)
let res = await SQLite.get(`SELECT * FROM profileSystem WHERE id = ${getvalueof.id}`)
if(!res) SQLite.run(`INSERT INTO profileSystem VALUES ('${getvalueof.id}', 1, 0, ${xp}, 0, 0, 0, ""`)
let Image = Canvas.Image,canvas = Canvas.createCanvas(307, 300),ctx = canvas.getContext('2d');
const rg = ["./profile.png", "./1profile.png","./2profile.png","./3profile.png","./4profile.png","./5profile.png","./6profile.png","./7profile.png","./8profile.png"];
fs.readFile(`${rg[Math.floor(Math.random() * rg.length)]}`, function (err, Background) {  
if (err) return console.log(err);let BG = Canvas.Image;let ground = new Image;ground.src = Background;ctx.drawImage(ground, 0, 0, 307, 300);})/// PHOTO SIZE
let url = getvalueof.displayAvatarURL.endsWith(".webp") ? getvalueof.displayAvatarURL.slice(5, -20) + ".png" : getvalueof.displayAvatarURL;
jimp.read(url, (err, ava) => {if (err) return console.log(err);
ava.getBuffer(jimp.MIME_PNG, async( err, buf) => {if (err) return console.log(err);
ctx.font = 'Arial 23px profile';ctx.fontSize = '62px'; ctx.fillStyle = "#fff";ctx.textAlign = "center"; ctx.fillText(`${getvalueof.username}`, 154, 178)/////USERNAME
let leaderboard = await SQLite.all(`SELECT * FROM profileSystem ORDER BY xp DESC, credits DESC`);
ctx.font = "20px Arial";ctx.fontSize = '20px';ctx.fillStyle = "#FFFFFF";ctx.textAlign = "center";////RANK
for(var i = 0;i<leaderboard.length;i++) {if(leaderboard[i].id == getvalueof.id) {ctx.fillText(`#${i+1}`, 52, 134)}}///RANK
ctx.font = "20px Arial";ctx.fontSize = '20px';ctx.fillStyle = '#FFFFFF'; ctx.textAlign = "center";ctx.fillText(`${res.credits}`, 254 , 134)////credits
ctx.font = "20px Arial";ctx.fontSize = '10px';ctx.fillStyle = "#FFFFFF";ctx.textAlign = "center";ctx.fillText(`${res.level}`, 253, 71)
ctx.font = "20px Arial";ctx.fontSize = "20px";ctx.fillStyle = "#FFFFFF";ctx.textAlign = "center";ctx.fillText(`${res.rep}`, 54,71);///REPS
ctx.font = "18px Arial";ctx.fontSize = "18px";ctx.fillStyle = "#FFFFFF";ctx.textAlign = "center";ctx.fillText(`${res.info}`,151,266)
//  الاكس بي //ctx.font = "15px Arial";ctx.fontSize = '15px'; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";ctx.fillText(`${res.xp}`, 130, 270)////XP
 
                                                  
                               
                                                  
let Avatar = Canvas.Image;let ava = new Avatar;
ava.src = buf;ctx.beginPath(); ctx.arc(153.5, 85.5, 50, 0, Math.PI*2, true); ctx.clip();ctx.drawImage(ava, 100, 34, 110, 110);
message.channel.startTyping();message.channel.sendFile(canvas.toBuffer());message.channel.stopTyping();});});}})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////// Black List Code ////////////////////

const developers = ["554553279003099146"]
const blacklist = JSON.parse(fs.readFileSync('./blacklist.json', 'utf8'));
client.on('message',message=>{
  var prefix = "";
if(message.author.bot)return
if (!developers.includes(message.author.id)) return;
if(message.content.startsWith(prefix + "+black list")) {
let args = message.content.split(" ")[2]
var user = client.users.get(args)
if(!user)return message.channel.send(':no_mouth: **Please write id member . **')
if(user.id == message.author.id || user.id == client.user.id) return message.channel.send(`:no_mouth: You Cann'ot Add **${user} (${user.id}) ,** To the Blacklisted .`)
if(blacklist[client.user.id+user.id]) return message.channel.send(`:no_mouth: **(${user.id})** It is already blacklisted . `)
blacklist[client.user.id+user.id] = {};
message.channel.send("**:slight_smile: Done Add " + `${user}` +" "+ `(${user.id})` +" to Blacklistd .**")
saveblacklist() 
} else if(message.content.startsWith(prefix + "-blacklist all")){
client.users.forEach(m => {
  delete blacklist[client.user.id + m.id];
}) 
message.channel.send(":slight_smile: **All Blacklistd Has Removed ,**")
} else if(message.content.startsWith(prefix + "-black list")) {
  let user = message.content.split(" ")[2]
  if(!user) return message.channel.send(":no_mouth: **Please write id member . **")
  if(!blacklist[client.user.id+user])return message.channel.send(`:no_mouth: i don't see **(${user})** in the blacklist .`)
  delete blacklist[client.user.id+user];
message.channel.send("**:slight_smile: Done Removed " + `<@${user}>` +" Form Blacklistd .**")
  
} else   
  if (message.content.startsWith(prefix + ".blacklist")) {
const blacklistss = [];
client.users.forEach(m => {
if(!blacklist[client.user.id + m.id]) return
blacklistss.push(`<@${m.id}>`);
});
let MS = blacklistss.join("\n")
let embed = new Discord.RichEmbed()
.setAuthor(message.author.tag , message.author.avatarURL)
.setTitle('**People in the blacklist**')
.setDescription(`${MS} `)
.setColor('#ff0303')
message.channel.send(embed) 
  }
  })

function saveblacklist() {
    fs.writeFileSync("./blacklist.json", JSON.stringify(blacklist, null, 4))
}

////////////////// end Black List Code ////////////////////

client.on("guildMemberAdd", member => {
  member.createDM().then(function (channel) {
  return channel.send(` Welcome **Mr** ( **${member}** )  in ( **${member.guild.name}** ),
if you want any help on december bot please come in the **Support Server**, 
:link: https://discord.gg/mJyzyaZ`)
}).catch(console.error)
})















///////////////////////////////////////////////////////



  
//////////////////////////////////////////////////////////////////////////////
 client.login('NzA5MjExNDc5MDA1NDYyNjE4.GF97HH.O4-j4pn5yW1LgnQ2DSWSUXGZ9bu0mxj9O9gnyw');  