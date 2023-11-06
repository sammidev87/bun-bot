const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("smile")
        .setDescription("Smile.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to smile at.").setRequired(false))
        .addStringOption(opt => opt.setName("text").setDescription("Message you want to say.").setRequired(false)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { member, options, guild } = interaction;
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

        const gifs = [ 'https://ucarecdn.com/bb3dbe11-93f0-4896-bfcd-618121f4fb5d/smile5.gif',
            'https://ucarecdn.com/f9f6e42b-1a97-4abc-97ec-00a2d8831b98/smile3.gif',
            'https://ucarecdn.com/8c4354a4-482f-4084-b5fe-63fb9ce56e08/smile.gif',
            'https://ucarecdn.com/d6919a7b-c340-454f-b444-90475bf9a131/smile1.gif',
            'https://ucarecdn.com/64adfca8-93b9-4a7b-b270-dcbefb66c8fc/smile2.gif',
            'https://ucarecdn.com/f2312b0a-2ab4-48e2-b1d5-74f9b84a6cc7/smile4.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Smile")
            .setDescription(`${member} smiles${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};