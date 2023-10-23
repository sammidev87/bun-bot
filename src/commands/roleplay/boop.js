const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("boop")
        .setDescription("Boop someone.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to boop.").setRequired(false))
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

        const Text = options.getString("text");
        const Mention = options.getUser("user");
        let pingText = ``;
        if (!Text && !Mention) pingText = ``;
        if (Text && !Mention) pingText = ` ${Text}`;
        else if (!Text && Mention) pingText = ` ${Mention}`;
        else if (Text && Mention) pingText = ` ${Mention} ${Text}`;

        const gifs = [ 'https://ucarecdn.com/83ed73a2-054b-47ad-b26c-92b6b0203d21/boop2.gif',
            'https://ucarecdn.com/5fcce072-4ae7-4242-83b9-4f508bbf5585/boop.gif',
            'https://ucarecdn.com/c06730a3-e36f-4def-ae9c-d01b6be6b144/boop4.gif',
            'https://ucarecdn.com/f83373db-b6df-4b39-9615-eb53609f30f2/boop3.gif',
            'https://ucarecdn.com/e10d0191-a8a6-4c6b-95e0-7118a4766b58/boop5.gif',
            'https://ucarecdn.com/8271eb28-d167-4fd6-8f40-b25c0568a9d8/boop1.gif' ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(colorData.Color || color)
            .setTitle("Boop")
            .setDescription(`${member} boops${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};