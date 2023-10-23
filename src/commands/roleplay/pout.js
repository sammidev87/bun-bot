const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pout")
        .setDescription("Pout.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to pout at.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/b46c63ad-86db-493f-bc3e-900414ada28a/pout3.gif',
            'https://ucarecdn.com/ed371d2c-49a1-48e1-8203-8f8b8fe0ff86/pout5.gif',
            'https://ucarecdn.com/0cc3df66-68a2-4f6a-ac09-584aeb11de7c/pout2.gif',
            'https://ucarecdn.com/b0026484-f85d-4680-a363-2a3bd115ee29/pout4.gif',
            'https://ucarecdn.com/cdbe0a35-1645-4769-bc00-97be73e9d358/pout.gif',
            'https://ucarecdn.com/a8236f8c-9552-495b-a50f-aeff637cb3a4/pout1.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(colorData.Color || color)
            .setTitle("Pout")
            .setDescription(`${member} pouts${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};