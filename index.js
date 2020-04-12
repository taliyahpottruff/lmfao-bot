const https = require('https');

require('dotenv').config();

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
	channels: [ 'piper_pottruff', 'tbkdasenator' ]
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