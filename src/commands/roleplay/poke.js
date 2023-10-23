const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poke")
        .setDescription("Poke someone.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to poke.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/c326eab3-af57-4af9-9735-8e703da16b3e/poke.gif',
            'https://ucarecdn.com/649bcea4-49d8-4e8a-8933-14a295548a0f/poke1.gif',
            'https://ucarecdn.com/da0f8bb1-f748-4d2d-be94-f606afe103e4/poke2.gif',
            'https://ucarecdn.com/32a4c64c-ed6f-4d22-96c3-e435a632e969/poke4.gif',
            'https://ucarecdn.com/849b7154-8bd0-4a9b-8057-ea85c402f4f6/poke3.gif',
            'https://ucarecdn.com/e5e7e2b9-5174-4d24-9524-6b483da99686/poke5.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(colorData.Color || color)
            .setTitle("Poke")
            .setDescription(`${member} pokes${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};