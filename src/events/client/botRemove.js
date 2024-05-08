const { Client, Message } = require("discord.js");
const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,

    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    async execute(message, client) {

        const { guild } = message;

        if (![ `1037958833529696276`, `1070558674210267207`, `1093819305130467400`, `1234386481376923680` ].includes(guild.id)) {
            guild.leave();
        }

    }

};