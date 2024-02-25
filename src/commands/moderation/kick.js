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
            .addAttachmentOption(opt => opt.setName("attachment").setDescription("Attach image").setRequired(true))
            .addAttachmentOption(opt => opt.setName("attachment2").setDescription("Attach image2").setRequired(false))
            .addAttachmentOption(opt => opt.setName("attachment3").setDescription("Attach image3").setRequired(false))
            .addAttachmentOption(opt => opt.setName("attachment4").setDescription("Attach image4").setRequired(false))
            .addAttachmentOption(opt => opt.setName("attachment5").setDescription("Attach image5").setRequired(false)),

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
        const rawFile = options.getAttachment("attachment").url;
        const rawFile2 = options.getAttachment("attachment2") || 'none';
                const rawFile3 = options.getAttachment("attachment3") || 'none';
                const rawFile4 = options.getAttachment("attachment4") || 'none';
                const rawFile5 = options.getAttachment("attachment5") || 'none';
                const rawFiles = [
                    rawFile,
                    rawFile2,
                    rawFile3,
                    rawFile4,
                    rawFile5
                ];
                const files = [];
                for (const file of rawFiles) {
                    if (file !== "none") {
                        const attachment = new AttachmentBuilder(file)
                        files.push(attachment);
                    }
                }
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
                    .setFooter({ text: "Kick by Bun Bot" })
                    .setTimestamp()
            ],
            files: files
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