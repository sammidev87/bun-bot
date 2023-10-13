const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("heal")
        .setDescription("Heal someone.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to heal.").setRequired(false))
        .addStringOption(opt => opt.setName("text").setDescription("Message you want to say.").setRequired(false)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { member, options } = interaction;
        const { color } = client;

        const Text = options.getString("text");
        const Mention = options.getUser("user");
        let pingText = ``;
        if (!Text && !Mention) pingText = ``;
        if (Text && !Mention) pingText = ` ${Text}`;
        else if (!Text && Mention) pingText = ` ${Mention}`;
        else if (Text && Mention) pingText = ` ${Mention} ${Text}`;

        const gifs = [ 'https://ucarecdn.com/62fcf738-67ca-40ee-8b5e-49cb1f52d12c/heal.gif',
            'https://ucarecdn.com/6f4d1ee2-4ded-4d67-9e7f-f6fc1fccc924/heal5.gif',
            'https://ucarecdn.com/140211a4-c36f-4da2-90b6-1c762f169ba0/heal3.gif',
            'https://ucarecdn.com/97205442-3376-454b-b7f3-5bc25a43be00/heal4.gif',
            'https://ucarecdn.com/4891e06a-5bbe-48a8-add3-75ae560eadc0/heal1.gif',
            'https://ucarecdn.com/65d47595-2afa-470c-8c0d-73fea6d548df/heal2.gif' ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Heal")
            .setDescription(`${member} heals${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });
    }
};