const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pat")
        .setDescription("Pat someone.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to pat.").setRequired(false))
        .addStringOption(opt => opt.setName("text").setDescription("Message you want to say.").setRequired(false)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { member, options } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        const Text = options.getString("text");
        const Mention = options.getUser("user");
        let pingText = ``;
        if (!Text && !Mention) pingText = ``;
        if (Text && !Mention) pingText = ` ${Text}`;
        else if (!Text && Mention) pingText = ` ${Mention}`;
        else if (Text && Mention) pingText = ` ${Mention} ${Text}`;

        const gifs = [ 'https://ucarecdn.com/0cc1593d-d9c4-4b22-9bdd-97a42c532c41/pat.gif',
            'https://ucarecdn.com/32817883-b68e-41b8-b01c-12f9bf54007a/pat4.gif',
            'https://ucarecdn.com/a21831a3-d7da-4db7-b600-432e40eed8bc/pat3.gif',
            'https://ucarecdn.com/67e4378a-fb14-48fa-8521-48989843cd5b/pat5.gif',
            'https://ucarecdn.com/611130de-159e-403a-b1fb-cef7328dfc80/pat1.gif',
            'https://ucarecdn.com/3345e846-32b4-4dd8-b0e8-5e04a6e8d6db/pat2.gif' ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Pat")
            .setDescription(`${member} pats${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};