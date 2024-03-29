const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const BanChannelDB = require("../../schemas/banChannelDB");
const warnDB = require("../../schemas/warnDB");
const charactersDB = require("../../schemas/charactersDB");
const economyDB = require("../../schemas/economyDB");
const LevelsDB = require("../../schemas/levelsDB");
const EconomyDB = require("../../schemas/economyDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a member.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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

        const banChannel = await BanChannelDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        if (!banChannel) return interaction.reply({ content: `There is no ban log channel yet! Create one by using \`/ban log-channel\`!`, ephemeral: true });
        const findBanChannel = guild.channels.cache.get(banChannel.Channel);

        if (findMember.roles.highest.position <= findUser.roles.highest.position) return interaction.reply({ content: `You cannot ban someone that is the same level or higher than you!`, ephemeral: true });

        await EconomyDB.findOneAndDelete({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
        await LevelsDB.findOneAndDelete({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
        await charactersDB.findOneAndDelete({ GuildID: guild.id, MemberID: user.id }).catch(err => console.error(err));
        await economyDB.findOneAndDelete({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
        await warnDB.findOneAndDelete({ Guild: guild.id, Member: user.id }).catch(err => console.error(err));

        findBanChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setTitle("Banned!")
                    .setDescription(`${user} has been Banned by ${member} for \`${reason}\``)
                    .setImage('attachment://attached.png')
                    .setFooter({ text: "Ban by Bun Bot" })
                    .setTimestamp()
            ],
            files: files
        });

        findUser.ban({ reason: reason, deleteMessageSeconds: 7 * 24 * 60 * 60 });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setTitle("Banned!")
                    .setDescription(`${user} has been Banned.`)
                    .setFooter({ text: "Ban by Bun Bot" })
                    .setTimestamp()
            ],
            ephemeral: true,
        });

    }
};