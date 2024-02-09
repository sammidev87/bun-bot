const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const translate = require("@iamtraction/google-translate");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("translate-en")
        .setDescription("Translates english to another language.")
            .addStringOption(opt => opt.setName("text").setDescription("The text to translate.").setRequired(true))
            .addStringOption(opt => opt.setName("language").setDescription("the language to translate ex. 'pt' for portuguese.").setRequired(true)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { color } = client;
        const { guild, options, member, user } = interaction;
        const text = options.getString("text");
        const language = options.getString("language");
        const translation = await translate(text, { from: "en", to: `${language}` });
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        const Embed = new EmbedBuilder()
            .setAuthor(user.username, member.avatar)
            .setColor(embedColor)
            .setTitle("Ping:")
            .setDescription(`${translation.text}`)
            .setFooter({ text: `Translator by Bun Bot` })
            .setTimestamp();

        interaction.reply({ embeds: [ Embed ] });

    }
};