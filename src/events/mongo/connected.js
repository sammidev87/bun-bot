const { Client } = require("discord.js");
const chalk = require("chalk");

module.exports = {
    name: `connected`,
    /**
     * 
     * @param { Client } client 
     */
    async execute(client) {
        console.log(chalk.green("[Database Status]: Connected."));
    },
};