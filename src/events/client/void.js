const { Client, Message, Events } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,

    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    async execute(message, client) {

        const { channel } = message;

        //Deleted Count
        if (channel.id === "1149804294879596564") {
            message.delete();
        }
    }

};