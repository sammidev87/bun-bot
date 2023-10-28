const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const LevelsDB = require("../../schemas/levelsDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("level-give")
        .setDescription("Give a user x level.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(opt => opt.setName("user").setDescription("User you want to give the level to.").setRequired(true))
        .addNumberOption(opt => opt.setName("level").setDescription("Level you want the user to be.").setRequired(true)),
    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { guild, options } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        const user = options.getUser("user");
        const level = options.getNumber("level");
        const xp = level * level * 100 + 120;

        const data = await LevelsDB.findOne({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
        if (!data) return interaction.reply({ content: `There is no data for this user!`, ephemeral: true });

        data.Level = level;
        data.XP = xp;
        await data.save();

        const Embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Give Level")
            .setDescription(`You have successfully given ${user} level ${level}!`)
            .setFooter({ text: `Levels by Bun Bot` })
            .setTimestamp();

        interaction.reply({ content: `${user}`, embeds: [ Embed ] });

    }

};