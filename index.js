const https = require('https');
const fs = require('fs');

require('dotenv').config();

var channelObj = JSON.parse(fs.readFileSync("./channels.json", "utf8"));

const tmi = require('tmi.js');
const client = new tmi.Client({
	options: { debug: true },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: 'lmfaobot',
		password: process.env.TOKEN
	},
	channels: channelObj.channels
});
client.connect();

const dadJoke = (channel) => {
    https.get('https://icanhazdadjoke.com/', {headers: {"Accept": "application/json"}}, (res) => {
        let data = '';
        res.on('data', (d) => {
            data += d;
        });
        res.on('end', () => {
            const parsed = JSON.parse(data);
            console.log(parsed);
            client.say(channel, parsed.joke);
        });
    }).on('error', (err) => console.log(err));
}

client.on('chat', (channel, userstate, message, self) => {
	if(self) return;
    
    const parts = message.split(' ');

    //Own channel
    if (channel == 'lmfaobot') {
        if (parts[0] == '!join') {
            client.say(channel, `@${userstate['display-name']}, joining your channel! Happy joking!`);
            console.log(userstate['username']);
            client.join(userstate['username']);
            channelObj.channels.push(userstate['username']);
            fs.writeFile('./channels.json', JSON.stringify(channelObj), (err) => {
                if (err) throw err;
            });
        }
    }

    //Commands
    if (parts[0] == '!joke') {
        console.log("Joke chosen");

        if (parts.length > 1) { //Parameter specify
            if (parts[1] == 'dad') {
                dadJoke(channel);
            }
        } else {
            //Default to dad joke
            dadJoke(channel);
        }
    }
});