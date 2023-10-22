const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
require("dotenv").config();
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { connect, set } = require("mongoose");
const fs = require("fs");
const ms = require("ms");
const { token, mongoDbUrl } = process.env;
const emojis = require("../emojis.json");
const configuration = require("../config.json");
const colorDB = require("./schemas/colorDB");

//Create new client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildMember,
        Partials.ThreadMember,
        Partials.User,
        Partials.GuildScheduledEvent,
    ],
    allowedMentions: { parse: [ "everyone", "roles", "users" ] },
    rest: { timeout: ms("1m") },
});

//Collections
client.commands = new Collection();
client.voiceCollection = new Collection();
client.cooldowns = new Collection();
client.messageId = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];
client.emojilist = emojis;
client.config = configuration;
client.color = "#ffc0cb";

//Distube Client
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: true,
    plugins: [ new SoundCloudPlugin(), new SpotifyPlugin(), new YtDlpPlugin() ],
});

//Function folders loader
const functionFolders = fs.readdirSync(`./src/functions`);
for (const functionFolder of functionFolders) {
    const functionFiles = fs.readdirSync(`./src/functions/${functionFolder}`).filter(file => file.endsWith(`.js`));

    for (const functionFile of functionFiles) require(`./functions/${functionFolder}/${functionFile}`)(client);
}

//Command and Event handlers
client.handleEvents();
client.handleCommands();
client.handleComponents();

//Client login
client.login(token);

//MongoDB login
(async () => {
    set("strictQuery", false);
    await connect(mongoDbUrl).catch(console.error);
})();