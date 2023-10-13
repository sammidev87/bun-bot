const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const { token } = process.env;

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync(`./src/commands`);
        const { commands, commandArray } = client;

        for (const commandFolder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${commandFolder}`).filter(file => file.endsWith(`.js`));

            for (const commandFile of commandFiles) {
                const command = require(`../../commands/${commandFolder}/${commandFile}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
            }
        }

        const clientId = `1030857193349718056`;
        const rest = new REST({ version: `9` }).setToken(token);
        try {
            console.log(`Started refreshing application (/) commands.`);

            await rest.put(Routes.applicationCommands(clientId), { body: commandArray });

            console.log(`Successfully reloaded application (/) commands.`);
        } catch (error) {
            console.error(error);
        }

        console.log(`✅ Commands have been registered successfully!`);
    };
};