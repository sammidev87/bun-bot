const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("up")
        .setDescription("Ask to be picked up.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to ask.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/34a96eec-c8d9-42c4-bb01-e03ea24e9831/up2.gif',
            'https://ucarecdn.com/7e7f9fcb-bc92-43e0-b24f-55d872ef465c/up3.gif',
            'https://ucarecdn.com/9d0fc868-552d-4fa8-94e1-1a8645b01ce0/up5.gif',
            'https://ucarecdn.com/ccf5b6ae-835f-4d02-94b2-f6fc724fb4fc/up1.gif',
            'https://ucarecdn.com/0c1ddb21-d0af-453c-93a9-5dcb2cf6b38c/up.gif',
            'https://ucarecdn.com/236ecbd8-90e6-471b-8faa-32dfe1b2e3b8/up4.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(colorData.Color || color)
            .setTitle("Up")
            .setDescription(`${member} asks for uppies pweaseeeee${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};