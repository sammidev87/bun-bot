const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tickle")
        .setDescription("Tickle someone.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to tickle.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/eaa33f57-f287-4637-ba31-90e94926d0dd/tickle.gif',
            'https://ucarecdn.com/8cdfada8-b929-4a92-b6f0-d2fcdffe90e8/tickle4.gif',
            'https://ucarecdn.com/e860ab61-0b13-498e-9326-771c3b3d6fa8/tickle1.gif',
            'https://ucarecdn.com/5e972fcf-a8ac-4aa1-8529-311a3671e1d9/tickle5.gif',
            'https://ucarecdn.com/63c75875-7a89-4992-8c09-8a8c9160d6ed/tickle2.gif',
            'https://ucarecdn.com/33480077-debe-4454-9a1b-5828623e7be3/tickle3.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Tickle")
            .setDescription(`${member} tickles${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};