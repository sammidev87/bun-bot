const { Client } = require("discord.js");
const chalk = require("chalk");

module.exports = {
    name: `connecting`,
    /**
     * 
     * @param { Client } client 
     */
    execute(client) {
        console.log(chalk.cyan("[Database Status]: Connecting..."));
    },
};