const { Client } = require("discord.js");
const { connection } = require("mongoose");

module.exports = {
    name: `close`,
    /**
     * 
     * @param { Client } client 
     */
    async execute(client) {
        connection.removeAllListeners();
    },
};