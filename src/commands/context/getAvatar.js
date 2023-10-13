const { Client, ContextMenuCommandInteraction, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("getAvatar")
        .setType(ApplicationCommandType.User),

    /**
     * 
     * @param { ContextMenuCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { color, users } = client;
        const { targetId } = interaction;
        const member = await users.fetch(targetId);

        const Embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("User Avatar")
            .setDescription(`${member.username}'s Avatar:`)
            .setImage(`${member.displayAvatarURL()}`)
            .setFooter({ text: `Get Avatar by Bun Bot` })
            .setTimestamp();

        interaction.reply({ embeds: [ Embed ], ephemeral: true });

    }
};