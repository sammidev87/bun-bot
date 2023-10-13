const { Client, Guild, Events } = require("discord.js");
const banChannelDB = require("../../schemas/banChannelDB");
const charactersDB = require("../../schemas/charactersDB");
const confessionDB = require("../../schemas/confessionDB");
const confessionReplyDB = require("../../schemas/confessionReplyDB");
const countingDB = require("../../schemas/countingDB");
const createVCDB = require("../../schemas/createVCDB");
const economyDB = require("../../schemas/economyDB");
const embedDB = require("../../schemas/embedDB");
const kickChannelDB = require("../../schemas/kickChannelDB");
const levelsChannelDB = require("../../schemas/levelsChannelDB");
const levelsDB = require("../../schemas/levelsDB");
const magicItemsDB = require("../../schemas/magicItemsDB");
const pickDB = require("../../schemas/pickDB");
const pollDB = require("../../schemas/pollDB");
const qotdDB = require("../../schemas/qotdDB");
const reactionRolesDB = require("../../schemas/reactionRolesDB");
const safeWordDB = require("../../schemas/safeWordDB");
const shopDB = require("../../schemas/shopDB");
const ticketChannel = require("../../schemas/ticketChannel");
const ticketDB = require("../../schemas/ticketDB");
const warnChannelDB = require("../../schemas/warnChannelDB");
const warnDB = require("../../schemas/warnDB");

module.exports = {
    name: Events.GuildDelete,

    /**
     * 
     * @param { Guild } guild
     * @param { Client } client 
     */
    async execute(guild, client) {

        banChannelDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        charactersDB.deleteMany({ GuildID: guild.id }).catch(err => console.error(err));
        confessionDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        confessionReplyDB.deleteMany({ Guild: guild }).catch(err => console.error(err));
        countingDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        createVCDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        economyDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        embedDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        kickChannelDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        levelsChannelDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        levelsDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        magicItemsDB.deleteMany({ GuildID: guild.id }).catch(err => console.error(err));
        pickDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        pollDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        qotdDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        reactionRolesDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        safeWordDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        shopDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        ticketChannel.deleteMany({ GuildID: guild.id }).catch(err => console.error(err));
        ticketDB.deleteMany({ GuildID: guild.id }).catch(err => console.error(err));
        warnChannelDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));
        warnDB.deleteMany({ Guild: guild.id }).catch(err => console.error(err));

    }
};