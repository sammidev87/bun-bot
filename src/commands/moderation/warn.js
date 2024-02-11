const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const WarnChannelDB = require("../../schemas/warnChannelDB");
const WarnDB = require("../../schemas/warnDB");
const charactersDB = require("../../schemas/charactersDB");
const economyDB = require("../../schemas/economyDB");
const warnDB = require("../../schemas/warnDB");
const LevelsDB = require("../../schemas/levelsDB");
const EconomyDB = require("../../schemas/economyDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn Commands.")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addSubcommand(sub => sub.setName("warn-member")
            .setDescription("Warn a member.")
            .addUserOption(opt => opt.setName("user").setDescription("User you want to warn.").setRequired(true))
            .addStringOption(opt => opt.setName("reason").setDescription("Reason for warning.").setRequired(true)))
        .addSubcommand(sub => sub.setName("warn-info")
            .setDescription("Get Warn info on a user")
            .addUserOption(opt => opt.setName("user").setDescription("User you want to find warn info for.").setRequired(true))),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { guild, member, options } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        switch (options.getSubcommand()) {

            case "warn-member": {

                const user = options.getUser("user");
                const reason = options.getString("reason") || `No reason provided`;
                const findUser = guild.members.cache.get(user.id);
                const findMember = guild.members.cache.get(member.id);

                const warnChannel = await WarnChannelDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!warnChannel) return interaction.reply({ content: `There is no warn log channel yet! Create one by using \`/warn log-channel\`!`, ephemeral: true });
                const findWarnChannel = guild.channels.cache.get(warnChannel.Channel);

                if (findMember.roles.highest.position <= findUser.roles.highest.position) return interaction.reply({ content: `You cannot warn someone that is the same level or higher than you!`, ephemeral: true });

                let data = await WarnDB.findOne({ Guild: guild.id, Member: user.id }).catch(err => console.error(err));
                if (data) {
                    data.WarnAmount = data.WarnAmount + 1;
                } else if (!data) {
                    data = new WarnDB({
                        Guild: guild.id,
                        Member: user.id,
                        WarnAmount: 1,
                    });
                }
                await data.save();

                findWarnChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(embedColor)
                            .setTitle("Warning!")
                            .setDescription(`${user} has been warned by ${member} for \`${reason}\`. This is their ${data.WarnAmount} warning.`)
                            .setFooter({ text: "Warn by Bun Bot" })
                            .setTimestamp()
                    ],
                });

                if (data.WarnAmount === 4) {
                    findUser.ban({ reason: reason, deleteMessageSeconds: 7 * 24 * 60 * 60 });

                    await EconomyDB.findOneAndDelete({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
                    await LevelsDB.findOneAndDelete({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
                    await charactersDB.findOneAndDelete({ GuildID: guild.id, MemberID: user.id }).catch(err => console.error(err));
                    await economyDB.findOneAndDelete({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
                    await warnDB.findOneAndDelete({ Guild: guild.id, Member: user.id }).catch(err => console.error(err));

                    findWarnChannel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(embedColor)
                                .setTitle("Banned!")
                                .setDescription(`${user} has been warned for the 4th time and has been banned from the server.`)
                                .setFooter({ text: "Warn by Bun Bot" })
                                .setTimestamp()
                        ],
                        ephemeral: false,
                    });

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(embedColor)
                                .setTitle("Banned!")
                                .setDescription(`${user} has been warned for the 4th time and has been banned from the server.`)
                                .setFooter({ text: "Warn by Bun Bot" })
                                .setTimestamp()
                        ],
                        ephemeral: true,
                    });
                } else {

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(embedColor)
                                .setTitle("Warned!")
                                .setDescription(`${user} has been warned.`)
                                .setFooter({ text: "Warn by Bun Bot" })
                                .setTimestamp()
                        ],
                        ephemeral: true,
                    });

                }

            }

                break;

            case "warn-info": {

                const user = options.getUser("user");

                let data = await WarnDB.findOne({ Guild: guild.id, Member: user.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `There is no warn data for this user!`, ephemeral: true });

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(embedColor)
                            .setTitle("Warn Info")
                            .setDescription(`User: <@${data.Member}>\nWarns: ${data.WarnAmount}`)
                            .setFooter({ text: "Warn by Bun Bot" })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });

            }

                break;

        }

    }
};