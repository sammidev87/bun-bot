const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("repeat-loop")
        .setDescription("Repeats a song, or loops a playlist."),

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
        if (!member.voice.channelId == guild.members.me.voice.channelId) return interaction.reply({ content: `I am already being used in another channel, you must be in the same channel as me to use this command!`, ephemeral: true });

        try {
            const mode = distube.setRepeatMode(voiceChannel);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colorData.Color || color)
                        .setTitle(`Repeat Mode`)
                        .setDescription(`Set repeat mode to \`${mode ? mode === 2 ? 'All Queue' : 'This Song' : 'Off'}\``)
                        .setFooter({ text: "Music by Bun Bot" })
                        .setTimestamp()
                ],
                ephemeral: true,
            });
        } catch (error) {
            interaction.reply({ content: `Alert!: ${error}` });
        }

    }
};