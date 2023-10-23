const { Client, ContextMenuCommandInteraction, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

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
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));

        const Embed = new EmbedBuilder()
            .setColor(colorData.Color || color)
            .setTitle("User Avatar")
            .setDescription(`${member.username}'s Avatar:`)
            .setImage(`${member.displayAvatarURL()}`)
            .setFooter({ text: `Get Avatar by Bun Bot` })
            .setTimestamp();

        interaction.reply({ embeds: [ Embed ], ephemeral: true });

    }
};