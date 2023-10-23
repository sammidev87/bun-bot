const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Kicks the bot from the vc."),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { member, guild } = interaction;
        const { distube, color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        const voiceChannel = member.voice.channel;
        if (!voiceChannel) return interaction.reply({ content: `You must be in a vc to use this command!`, ephemeral: true });
        if (!member.voice.channelId == guild.members.me.voice.channelId) return interaction.reply({ content: `I am already being used in another channel! You must be in the same channel as me to use this command!`, ephemeral: true });

        try {
            distube.voices.get(voiceChannel)?.leave();
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colorData.Color || color)
                        .setTitle(`Leave`)
                        .setDescription(`Left the voice channel!`)
                        .setFooter({ text: "Music by Bun Bot" })
                        .setTimestamp()
                ],
            });
        } catch (error) {
            interaction.reply({ content: `Alert!: ${error}`, ephemeral: true });
        }

    }
};