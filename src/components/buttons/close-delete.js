const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const TicketDB = require("../../schemas/ticketDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: {
        name: `close-delete`,
    },
    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { guild, member, user, channel, message } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        if (!member.permissions.has("Administrator")) return interaction.reply({ content: `You do not have permission to use this button!`, ephemeral: true });

        let ticketData = await TicketDB.findOne({ GuildID: guild.id, ChannelID: channel.id }).catch(err => console.error(err));
        if (!ticketData.ClaimedUser) return interaction.reply({ content: `The ticket must be claimed before it can be closed!`, ephemeral: true });

        ticketData.ClosedUser = member.id;
        await ticketData.save();

        const Embed = new EmbedBuilder()
            .setColor(embedColor)
            .setAuthor({ name: user.username, iconURL: member.displayAvatarURL() })
            .setTitle("⚠️ | Close & Delete")
            .setDescription("Are you sure you want to close and delete the ticket?")
            .setFooter({ text: "Ticket System by Bun Bot" })
            .setTimestamp();

        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("delete")
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger)
                .setEmoji("⚠️"),
        );

        message.delete();
        channel.send({ embeds: [ Embed ], components: [ Buttons ] });

    }
};