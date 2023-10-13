const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nope")
        .setDescription("Nope nope nope.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to nope out.").setRequired(false))
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
        else if (!Text && Mention) pingText = ` to ${Mention}`;
        else if (Text && Mention) pingText = ` to ${Mention} ${Text}`;

        const gifs = [ 'https://ucarecdn.com/8a789822-ceda-4b2d-8a76-d70a42540e5d/nope4.gif',
            'https://ucarecdn.com/29af9c13-b40a-42ec-a1cf-1f99cc24dba1/nope3.gif',
            'https://ucarecdn.com/730fe684-16f6-4d6b-9366-472fb7ba0708/nope5.gif',
            'https://ucarecdn.com/042f613b-9410-46a2-8e74-d17dac042c3d/nope.gif',
            'https://ucarecdn.com/90f648c4-425e-4cf2-90fc-9488e8051b83/nope1.gif',
            'https://ucarecdn.com/ff322ca0-195f-4c4f-a2a9-4874185e8546/nope2.gif' ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Nope")
            .setDescription(`${member} says nope nope nope${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};