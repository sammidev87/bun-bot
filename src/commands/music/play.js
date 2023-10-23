const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song.")
        .addStringOption(opt => opt.setName("song").setDescription("The name or link of a song.").setRequired(true)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, channel, member, guild } = interaction;
        const { distube, color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        const voiceChannel = member.voice.channel;
        if (!voiceChannel) return interaction.reply({ content: `You must be in a vc to use this command!`, ephemeral: true });
        if (!member.voice.channelId == guild.members.me.voice.channelId) return interaction.reply({ content: `I am already being used in another channel, you must be in the same channel as me to use this command!`, ephemeral: true });

        try {

            const song = options.getString("song");
            distube.play(voiceChannel, song, { textChannel: channel, member: member });

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colorData.Color || color)
                        .setTitle("Play")
                        .setDescription(`Request has been recieved!`)
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