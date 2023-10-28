const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Set the volume of the song playing.")
        .addNumberOption(opt => opt.setName("number").setDescription("The volume 1-100 that you want the song to play at.").setRequired(true)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, member, guild } = interaction;
        const { distube, color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }
        const voiceChannel = member.voice.channel;
        if (!voiceChannel) return interaction.reply({ content: `You must be in a vc to use this command!`, ephemeral: true });
        if (!member.voice.channelId == guild.members.me.voice.channelId) return interaction.reply({ content: `I am already being used in another channel, you must be in the same channel as me to use this command!`, ephemeral: true });
        const queue = distube.getQueue(voiceChannel);
        if (!queue) return interaction.reply({ content: `There are no songs in the queue at this time!`, ephemeral: true });

        try {

            const volume = options.getNumber("number");
            if (volume > 100 || volume < 1) return interaction.reply({ content: `The number must be between 1-100!`, ephemeral: true });
            distube.getQueue(voiceChannel).setVolume(volume);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(embedColor)
                        .setTitle("Volume")
                        .setDescription(`Volume is now set to **${volume}**`)
                        .setFooter({ text: "Music by Bun Bot" })
                        .setTimestamp()
                ]
            });

        } catch (error) {
            interaction.reply({ content: `Alert!: ${error}` });
        }

    }
};