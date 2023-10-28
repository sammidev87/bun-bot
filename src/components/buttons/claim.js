const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const TicketDB = require("../../schemas/ticketDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: {
        name: `claim`,
    },
    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { guild, member, channel } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        if (!member.permissions.has("Administrator")) return interaction.reply({ content: `You do not have permissions to use this button!`, ephemeral: true });

        let ticketData = await TicketDB.findOne({ GuildID: guild.id, ChannelID: channel.id }).catch(err => console.error(err));
        if (ticketData.ClaimedUser) return interaction.reply({ content: `This ticket has already been claimed!`, ephemeral: true });

        ticketData.ClaimedUser = member.id;
        await ticketData.save();

        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setTitle(`Claimed Ticket`)
                    .setDescription(`This ticket has been claimed by: <@${member.id}>`)
                    .setFooter({ text: "Tickets by Bun Bot" })
                    .setTimestamp()
            ],
        });

        return interaction.reply({ content: `${member} you have claimed this ticket successfully!`, ephemeral: true });

    }
};