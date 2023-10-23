const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("brat")
        .setDescription("Be a brat.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to brat at.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/91b10258-0540-4224-8547-3d257278147c/brat.gif',
            'https://ucarecdn.com/7acae7a2-467b-437a-8b28-7874d740dd94/brat1.gif',
            'https://ucarecdn.com/c3c5ee6b-3fa5-4ac0-86ad-6d3075bc00ea/brat4.gif',
            'https://ucarecdn.com/9b42ad21-fc00-4029-9b96-138cf32a9ab3/brat3.gif',
            'https://ucarecdn.com/a81dbcff-e642-46e3-91fe-8b4f0c494b3e/brat5.gif',
            'https://ucarecdn.com/5a539ea3-6f3c-4775-9d5c-df40c8f2f49d/brat6.gif' ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(colorData.Color || color)
            .setTitle("Brat")
            .setDescription(`${member} brats${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};