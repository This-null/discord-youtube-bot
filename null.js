const Discord = require("discord.js");
const client = new Discord.Client();
client.db = require("quick.db");
client.request = new (require("rss-parser"))();
client.config = require("./ekmek.js");


function handleUploads() {
    if (client.db.fetch(`postedVideos`) === null) client.db.set(`postedVideos`, []);
    setInterval(() => {
        client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${client.config.youtubeID}`)
        .then(data => {
            if (client.db.fetch(`postedVideos`).includes(data.items[0].link)) return;
            else {
                client.db.set(`videoData`, data.items[0]);
                client.db.push("postedVideos", data.items[0].link);
                let parsed = client.db.fetch(`videoData`);
                let channel = client.channels.cache.get(client.config.ping);
                if (!channel) return;
                let message = client.config.mesaj
                    .replace(/{author}/g, parsed.author)
                    .replace(/{title}/g, Discord.Util.escapeMarkdown(parsed.title))
                    .replace(/{url}/g, parsed.link);
                channel.send(message);
            }
        });
    }, client.config.sure);
}


client.on('ready', () => {
    handleUploads();
    client.user.setStatus("idle");
    setInterval(() => {
    const oyuncuk = Math.floor(Math.random() * (client.config.oyun.length));
    client.user.setActivity(`${client.config.oyun[oyuncuk]}`, {type: "LISTENING"});
  }, 10000);
  console.log(`${client.user.tag} Kullanıma Hazır.`);

});


client.login(client.config.token);
