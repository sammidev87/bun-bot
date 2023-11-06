const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");
const ConfessionDB = require("../../schemas/confessionDB");
const ConfessionReplyDB = require("../../schemas/confessionReplyDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("confession")
        .setDescription("Send your confession anonymously.")
        .addSubcommand(sub => sub.setName("confess")
            .setDescription("Send your confession anonymously.")
            .addStringOption(opt => opt.setName("confession").setDescription("What you want to confess.").setRequired(true)))
        .addSubcommand(sub => sub.setName("reply")
            .setDescription("Send a reply to another confession.")
            .addNumberOption(opt => opt.setName("confession").setDescription("Confession number you want to reply to.").setRequired(true))
            .addStringOption(opt => opt.setName("reply").setDescription("Reply you want to send.").setRequired(true))),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, guild, member } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        switch (options.getSubcommand()) {

            case "confess": {

                const confession = options.getString("confession");
                const data = await ConfessionDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `There is no confession channel set up yet!`, ephemeral: true });
                const channel = guild.channels.cache.get(data.Channel);
                const count = data.Count;
                if (count > 999) {
                    ConfessionReplyDB.deleteMany({ Guild: guild.id });
                    data.Count = 0;
                    data.save();
                }

                if (!data.LogChannel) {

                    const Message = await channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(embedColor)
                                .setTitle(`Confession ${count}`)
                                .setDescription(`${confession}`)
                                .setFooter({ text: "Confessions by Bun Bot" })
                                .setTimestamp()
                        ]
                    });

                    await ConfessionReplyDB.findOne({ Guild: guild.id, Message: Message.id }).then((data) => {
                        if (!data) {

                            ConfessionReplyDB.create({
                                Guild: guild.id,
                                Channel: Message.channel.id,
                                Message: Message.id,
                                ConfessionNumber: count,
                                Thread: null,
                            });

                        }
                    });

                    data.Count = data.Count + 1;
                    await data.save();

                    interaction.reply({ content: `Your confession: **${confession}** has been sent!`, ephemeral: true });

                } else {

                    const logChannel = guild.channels.cache.get(data.LogChannel);

                    const Message = await channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(embedColor)
                                .setTitle(`Confession #${count}`)
                                .setDescription(`${confession}`)
                                .setFooter({ text: "Confessions by Bun Bot" })
                                .setTimestamp()
                        ]
                    });

                    await ConfessionReplyDB.findOne({ Guild: guild.id, Message: Message.id }).then((data) => {
                        if (!data) {

                            ConfessionReplyDB.create({
                                Guild: guild.id,
                                Channel: Message.channel.id,
                                Message: Message.id,
                                ConfessionNumber: count,
                                Thread: null,
                            });

                        }
                    });

                    logChannel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(embedColor)
                                .setTitle("Confession Log")
                                .setDescription(`${confession}`)
                                .setFields(
                                    {
                                        name: `Confession Number:`,
                                        value: `${data.Count}`,
                                        inline: false,
                                    },
                                    {
                                        name: `Username:`,
                                        value: `${member.user.username}`,
                                        inline: false,
                                    },
                                    {
                                        name: `User ID:`,
                                        value: `${member.id}`,
                                        inline: false,
                                    },
                                )
                                .setFooter({ text: "Confessions by Bun Bot" })
                                .setTimestamp()
                        ]
                    });

                    data.Count = data.Count + 1;
                    await data.save();

                    interaction.reply({ content: `Your confession: **${confession}** has been sent!`, ephemeral: true });

                }

            }

                break;

            case "reply": {

                const confession = options.getNumber("confession");
                const reply = options.getString("reply");
                const data = await ConfessionReplyDB.findOne({ Guild: guild.id, ConfessionNumber: confession }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `Could not find that confession! (if the confession #'s started back at 0, then we can't find the confessions before #0)`, ephemeral: true });
                const oldConfessionChannel = guild.channels.cache.get(data.Channel);
                if (!oldConfessionChannel) return interaction.reply({ content: `We cannot find the confession channel!`, ephemeral: true });
                const oldConfessionMessage = oldConfessionChannel.messages.cache.get(data.Message);
                if (!oldConfessionMessage) return interaction.reply({ content: `We cannot find the original confession message!`, ephemeral: true });
                const oldConfessionData = await ConfessionDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `Confessions has not been set up yet!`, ephemeral: true });
                const count = oldConfessionData.Count;

                if (!data.Thread) {

                    oldConfessionMessage.startThread({
                        name: `Confession Reply to #${confession}`,
                        autoArchiveDuration: 60,
                        type: ChannelType.GuildText,
                    }).then(async (channel) => {

                        channel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(embedColor)
                                    .setTitle(`Reply #${count}`)
                                    .setDescription(`${reply}`)
                                    .setFooter({ text: "Confessions by Bun Bot" })
                                    .setTimestamp()
                            ]
                        });

                        data.Thread = channel.id;
                        await data.save();

                    });

                    const logChannel = guild.channels.cache.get(oldConfessionData.LogChannel);

                    if (logChannel) {

                        logChannel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(embedColor)
                                    .setTitle("Confession Log (Reply)")
                                    .setDescription(`${reply}`)
                                    .setFields(
                                        {
                                            name: `Reply Number:`,
                                            value: `${count}`,
                                            inline: false,
                                        },
                                        {
                                            name: `Username:`,
                                            value: `${member.user.username}`,
                                            inline: false,
                                        },
                                        {
                                            name: `User ID:`,
                                            value: `${member.id}`,
                                            inline: false,
                                        },
                                    )
                                    .setFooter({ text: "Confessions by Bun Bot" })
                                    .setTimestamp()
                            ]
                        });

                    }

                    oldConfessionData.Count = oldConfessionData.Count + 1;
                    await oldConfessionData.save();

                    return interaction.reply({ content: `Your reply: **${reply}** has been sent!`, ephemeral: true });

                } else {

                    const channel = guild.channels.cache.get(data.Thread);
                    if (!channel) return interaction.reply({ content: `Could not find that thread of replies!`, ephemeral: true });

                    channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(embedColor)
                                .setTitle(`Reply #${count}`)
                                .setDescription(`${reply}`)
                                .setFooter({ text: "Confessions by Bun Bot" })
                                .setTimestamp()
                        ]
                    });

                    const logChannel = guild.channels.cache.get(oldConfessionData.LogChannel);

                    if (logChannel) {

                        logChannel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(embedColor)
                                    .setTitle("Confession Log")
                                    .setDescription(`Reply has been sent:`)
                                    .setFields(
                                        {
                                            name: `Username:`,
                                            value: `${member.user.username}`,
                                            inline: false,
                                        },
                                        {
                                            name: `User ID:`,
                                            value: `${member.id}`,
                                            inline: false,
                                        },
                                        {
                                            name: `Reply:`,
                                            value: `${reply}`,
                                            inline: false,
                                        },
                                        {
                                            name: `Reply Number:`,
                                            value: `${count}`,
                                            inline: false,
                                        },
                                    )
                                    .setFooter({ text: "Confessions by Bun Bot" })
                                    .setTimestamp()
                            ]
                        });

                    }

                    oldConfessionData.Count = oldConfessionData.Count + 1;
                    await oldConfessionData.save();

                    return interaction.reply({ content: `Your reply: **${reply}** has been sent!`, ephemeral: true });

                }

            }

                break;

        }

    }
};

function splitMessage(str, size) {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);

    for ( let i = 0, c = 0; i < numChunks; ++i, c += size) {
        chunks[i] = str.substr(c, size);
    }

    return chunks
}