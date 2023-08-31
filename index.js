const { Client, Intents } = require('discord.js');
const fs = require('fs');
const { prefix } = require('./config.json');

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('lorca 7/24');
});

app.listen(port);


const client = new Client({ 
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ]
});

client.once('ready', () => {
  console.log(`sexy bir${client.user.tag}  belirdi`);
});
client.commands = new Map();

const commandFiles = fs.readdirSync('./komutlar').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./komutlar/${file}`);
  client.commands.set(command.name, command);
}

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    command.execute(message, args, client); 
  } catch (error) {
    console.error(error);
    message.reply('Bir hata oluştu.');
  }
});

// TOKENİ .ENV KAYDI AÇARAK KULLANIN VEYA PARANTEZ İÇERİSİNİ "TOKENİNİZ" ŞEKLİNDE KULLANIN.
client.login(process.env.token);
