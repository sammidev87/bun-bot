const { Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: {
        name: `Rules-Agree`,
    },
    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {
        const { guild, user } = interaction;

        const Member = guild.members.cache.get(user.id);
        const Role = guild.roles.cache.get(`1077760916982091858`);
        Member.roles.add(Role);

        interaction.reply({ content: `Thank you for agreeing to the rules! Please head over to <#1071994341247176734> to learn how to verify!`, ephemeral: true });

    }
};