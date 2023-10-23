const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("thank")
        .setDescription("Say thank you.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to thank.").setRequired(false))
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
        else if (!Text && Mention) pingText = ` to ${Mention}`;
        else if (Text && Mention) pingText = ` to ${Mention} ${Text}`;

        const gifs = [ 'https://ucarecdn.com/42a8acf3-767b-461f-b9ab-75a9c59a6087/thank2.gif',
            'https://ucarecdn.com/61353006-7d41-4bcb-87a8-6f829f1819c9/thank5.gif',
            'https://ucarecdn.com/00c66b26-260c-4d62-b220-cbcd767f44b8/thank4.gif',
            'https://ucarecdn.com/7d3649dd-4bdb-433f-b9eb-a2c16094465f/thank3.gif',
            'https://ucarecdn.com/35d99474-937f-4d74-b009-69809aa10834/thank.gif',
            'https://ucarecdn.com/ca1e532c-eb57-4c68-80e9-4df0894be54a/thank1.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(colorData.Color || color)
            .setTitle("Thank You")
            .setDescription(`${member} says thank you${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};