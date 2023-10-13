const { Client } = require("discord.js");
const chalk = require("chalk");

module.exports = {
    name: `disconnected`,
    /**
     * 
     * @param { Client } client 
     */
    execute(client) {
        console.log(chalk.red("[Database Status]: Disconnected!"));
    },
};