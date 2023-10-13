const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const TicketChannelDB = require("../../schemas/ticketChannel");
const TicketDB = require("../../schemas/ticketDB");

module.exports = {
    data: {
        name: `delete`,
    },
    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { guild, channel, member } = interaction;
        const { color } = client;

        let channelData = await TicketChannelDB.findOne({ GuildID: guild.id }).catch(err => console.error(err));
        if (!channelData) return interaction.reply({ content: `You don't have the ticket logs set up yet! You can do so by using \`/ticket log-channel\`!`, ephemeral: true });

        if (!member.permissions.has("Administrator")) return interaction.reply({ content: `You do not have permission to use this button!`, ephemeral: true });

        let ticketData = await TicketDB.findOne({ GuildID: guild.id, ChannelID: channel.id }).catch(err => console.error(err));

        const Channel = guild.channels.cache.get(channelData.ChannelID);
        const attachement = await createTranscript(channel, {
            limit: -1,
            returnType: `attachment`,
            filename: `${ticketData.TicketID} - ${ticketData.MemberID}.html`,
        });
        const sentTranscript = await Channel.send({
            files: [ attachement ]
        });
        const Message = Channel.messages.cache.get(sentTranscript.id);
        const desc = [ `***_Ticket User Info:_***
                        **Member Username:** ${ticketData.OpenedUser}
                        **Member ID:** ${ticketData.MemberID}
                
                        ***_Ticket Status Info:_***
                        **Ticket Opened by:** <@${ticketData.MemberID}>
                        **Ticket Claimed by:** <@${ticketData.ClaimedUser}>
                        **Ticket Closed by:** <@${ticketData.ClosedUser}>

                        ***_Ticket Info:_***
                        **Ticket Type:** ${ticketData.Type}
                        **Ticket ID:** ${ticketData.TicketID}` ];
        Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`Closed Ticket`)
                    .setDescription(`${desc}`)
                    .setFields(
                        {
                            name: `Ticket Link:`,
                            value: `${Message.attachments.first().url}`,
                            inline: true
                        }
                    )
                    .setFooter({ text: "Tickets by Bun Bot" })
                    .setTimestamp()
            ],
        });

        await TicketDB.findOneAndDelete({ ChannelID: channel.id });

        channel.delete();

    }
};