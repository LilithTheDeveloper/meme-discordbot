//#region Imports, Versioning and stuff
//SOMESTUFF
const VERSION = "0.1";
const AUTHOR = "Lilith the Succubus";

//REQUIRED ''IMPORTS''
const Discord = require('discord.js'); //duh
const fs = require('fs'); //filesystem

//Main Instance of the bot, call this for everything
const bot = new Discord.Client();

//Code for dynamic command handling
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    bot.commands.set(command.name, command);
}
//Filesystem Handling - I think every json file should end up in the config directory. Just to not clutter the main directory too much.
const configJSON = 'config.json';
const subredditJSON = 'subreddits.json';

var files = [configJSON, subredditJSON];

const trackerPath = './config/'

fileCheck();

const config = require('./config/config.json');

//#endregion

bot.on('ready', () => {
    console.log('This bot is now active\nVersion: ' + VERSION);
})

bot.on('message', msg => {

    //Exit when incoming message does not start with specifed prefix or is sent by the bot
    if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

    //Remove Prefix and create Array with each of the arguments
    let args = msg.content.substring(config.prefix.length).toLowerCase().split(/ +/);

    //First argument passed is set to command
    let command = args[0];

    //Exit if the command doesn't exit
    if (!bot.commands.has(command)) return;

    try {
        if (msg.content.includes("info")) {
            msg.channel.send(bot.commands.get(command).description);
        }
        if (msg.content.includes("style")) {
            msg.channel.send(bot.commands.get(command).style);
        }
        else if (msg.content.includes("debug")) {
            bot.commands.get(command).debug(msg, args);
        }
        else {
            if (bot.commands.get(command).experimental && !config.experimental_commands) {
                return msg.reply("ERROR: The command you tried to use is experimental.\nThe use may severly break the bot or other features\nTo activate it's use, change \`experimental_commands\` in the config from \`true\` to \`false\`");
            } else {
                bot.commands.get(command).execute(msg, args);
            }
        }
    } catch (error) {
        console.error(error);
        msg.reply('ERROR: Invalid Syntax');
    }
})

//FILE INITIALIZATION 
function fileCheck() {
    var dir = "config"

    var config_prefab = {
        prefix: "!",
        token: "<Enter Bot Token>",
        server_id: "<Enter Server ID>",
        experimental_commands: false,
    }

    var subreddit_prefab = {
        subreddits: [],
    }

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    var emptyJson = "";
    for (var file of files) {
        if (fs.existsSync(trackerPath + file)) {
            console.warn(`${file} exists. Moving on.`);
        }
        else {
            console.warn(`${file} file missing -> Creating a new one`);
            switch (file) {
                case "config.json":
                    emptyJson = JSON.stringify(config_prefab);
                    break;
                case "subreddits.json":
                    emptyJson = JSON.stringify(subreddit_prefab);
                    break;
                default:
                    emptyJson = JSON.stringify([]);
                    break;
            }
            var path = trackerPath + file;
            //Needs to be syncronized to correcty write to files
            fs.writeFileSync(path, emptyJson, function (err, result) {
                if (err) console.log('error', err);
            });
        }
    }
}

bot.login(config.token)
    .then(console.log("Bot Login"))
    .catch(error => console.log("The provided token is invalid. Please check your config file in config/config.json for a valid bot token.\n" + error))