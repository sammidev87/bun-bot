const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const KickChannelDB = require("../../schemas/kickChannelDB");
const warnDB = require("../../schemas/warnDB");
const charactersDB = require("../../schemas/charactersDB");
const economyDB = require("../../schemas/economyDB");
const LevelsDB = require("../../schemas/levelsDB");
const EconomyDB = require("../../schemas/economyDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a member.")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
            .addUserOption(opt => opt.setName("user").setDescription("User you want to kick.").setRequired(true))
            .addStringOption(opt => opt.setName("reason").setDescription("Reason for kick.").setRequired(true))
            .addAttachmentOption(opt => opt.setName("attachment").setDescription("Attach image").setRequired(true)),

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

        const user = options.getUser("user");
        const reason = options.getString("reason") || `No reason provided`;
        const rawFile = options.getAttachment("attachment");
        const file = new AttachmentBuilder(rawFile, 'attached.png');
        const findUser = guild.members.cache.get(user.id);
        const findMember = guild.members.cache.get(member.id);

        const kickChannel = await KickChannelDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        if (!kickChannel) return interaction.reply({ content: `There is no kick log channel yet! Create one by using \`/kick log-channel\`!`, ephemeral: true });
        const findKickChannel = guild.channels.cache.get(kickChannel.Channel);

        if (findMember.roles.highest.position <= findUser.roles.highest.position) return interaction.reply({ content: `You cannot kick someone that is the same level or higher than you!`, ephemeral: true });

        await EconomyDB.findOneAndDelete({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
        await LevelsDB.findOneAndDelete({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
        await charactersDB.findOneAndDelete({ GuildID: guild.id, MemberID: user.id }).catch(err => console.error(err));
        await economyDB.findOneAndDelete({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
        await warnDB.findOneAndDelete({ Guild: guild.id, Member: user.id }).catch(err => console.error(err));

        findKickChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setTitle("Kicked!")
                    .setDescription(`${user} has been kicked by ${member} for \`${reason}\``)
                    .setImage('attachment://attached.png')
                    .setFooter({ text: "Kick by Bun Bot" })
                    .setTimestamp()
            ],
            files: [
                file
            ]
        });

        findUser.kick({ reason: reason });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setTitle("Kicked!")
                    .setDescription(`${user} has been kicked.`)
                    .setFooter({ text: "Kick by Bun Bot" })
                    .setTimestamp()
            ],
            ephemeral: true,
        });

    }
};