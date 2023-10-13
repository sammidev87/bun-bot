const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes play."),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { member, guild } = interaction;
        const { distube, color } = client;
        const voiceChannel = member.voice.channel;
        if (!voiceChannel) return interaction.reply({ content: `You must be in a vc to use this command!`, ephemeral: true });
        if (!member.voice.channelId == guild.members.me.voice.channelId) return interaction.reply({ content: `I am already being used in another channel, you must be in the same channel as me to use this command!`, ephemeral: true });
        const queue = distube.getQueue(voiceChannel);
        if (!queue) return interaction.reply({ content: `There are no songs in the queue at this time!`, ephemeral: true });

        try {
            queue.resume(voiceChannel);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle(`Resume`)
                        .setDescription(`Resumed the music!`)
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