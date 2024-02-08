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

        if (![ `1037958833529696276`, `1116042495185408092`, `1070558674210267207`, `1119139239112736778`, `1093819305130467400`, `1203789396713930832` ].includes(guild.id)) {
            guild.leave();
        }

    }

};