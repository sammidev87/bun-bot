const { DiscordjsError } = require("discord.js");
const chalk = require("chalk");

module.exports = {
    name: `connecting`,
    /**
     * 
     * @param { DiscordjsError } err 
     */
    execute(err) {
        console.log(chalk.red(`An error occured with the database connection:\n${err}`));
    },
};