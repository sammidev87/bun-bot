const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");
const TicketDB = require("../../schemas/ticketDB");

module.exports = {
    data: {
        name: `open`,
    },
    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { guild, message, channel, member } = interaction;
        const { color } = client;

        const ID = Math.floor(Math.random() * 90000) + 10000;
        const everyone = guild.roles.cache.get(guild.roles.everyone.id);

        const data = await TicketDB.findOne({ GuildID: guild.id, MemberID: member.user.id }).catch(err => console.error(err));
        if (data) return interaction.reply({ content: `You already have an open ticket: <#${data.ChannelID}>!`, ephemeral: true });

        const channelName = message.embeds[ 0 ].title;

        await guild.channels.create({
            name: `${channelName} ${ID}`,
            type: ChannelType.GuildText,
            parent: channel.parentId,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: [ "SendMessages", "ViewChannel", "ReadMessageHistory" ]
                },
                {
                    id: everyone,
                    deny: [ "SendMessages", "ViewChannel", "ReadMessageHistory" ]
                },
            ],
        }).then(async (channel) => {

            await TicketDB.create({
                GuildID: guild.id,
                MemberID: member.user.id,
                TicketID: ID,
                ChannelID: channel.id,
                OpenedUser: member.user.username,
                Type: channelName,
            });

            const Embed = new EmbedBuilder()
                .setAuthor({ name: `${guild.name} | Ticket #${ID}`, iconURL: guild.iconURL({ dynamic: true }) })
                .setColor(color)
                .setTitle(`Ticket #${ID}`)
                .setDescription(`Please wait patiently for someone to come and assist you. While you are waiting, please describe your issue in as much detail as possible.`)
                .setFooter({ text: "Ticket System by Bun Bot" })
                .setTimestamp();

            const Buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("claim")
                    .setLabel("Claim Ticket")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("🎟️"),
                new ButtonBuilder()
                    .setCustomId("close-delete")
                    .setLabel("Close & Delete")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("⚠️"),
            );

            channel.send({ content: `${member}, an <@&1042604531747397703> will be with you shortly, here is your ticket:`, embeds: [ Embed ], components: [ Buttons ] });

            return interaction.reply({ content: `${member} your ticket has been created: ${channel}`, ephemeral: true });
        });

    }
};