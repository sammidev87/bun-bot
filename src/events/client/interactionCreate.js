const { Client, ChatInputCommandInteraction, InteractionType, Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { customId, commandName } = interaction;
        const { commands, buttons, selectMenus, modals } = client;

        if (interaction.isChatInputCommand()) {

            const command = commands.get(commandName);
            if (!command) return Error(`There is no code for this command!`);

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: `Something went wrong while trying to execute this command...`, ephemeral: true });
            }

        } else if (interaction.isButton()) {

            const button = buttons.get(customId);
            if (!button) return Error(`There is no code for this button!`);

            try {
                await button.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }

        } else if (interaction.isStringSelectMenu()) {

            const menu = selectMenus.get(customId);
            if (!menu) return Error(`There is no code for this select menu!`);

            try {
                await menu.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }

        } else if (interaction.type === InteractionType.ModalSubmit) {

            const modal = modals.get(customId);
            if (!modal) return Error(`There is no code for this modal!`);

            try {
                await modal.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }

        } else if (interaction.isContextMenuCommand()) {

            const contextCommand = commands.get(commandName);
            if (!contextCommand) return;

            try {
                await contextCommand.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }

        } else {
            return;
        }

    }
};