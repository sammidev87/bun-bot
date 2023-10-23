const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blush")
        .setDescription("Blush.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user causing you to blush.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/d9ab830e-e777-4e03-a1ae-6bc1f6318cfd/blush4.gif',
            'https://ucarecdn.com/735d13a4-2ffd-47a8-86ae-16554b89d684/blush2.gif',
            'https://ucarecdn.com/776e4b85-22b0-4f60-9462-1530df0c07aa/blush1.gif',
            'https://ucarecdn.com/36c6ab03-8fc9-4bf3-8ac8-9684a9d82c63/blush6.gif',
            'https://ucarecdn.com/c0e22655-4c7e-4a0f-9ac4-f1fc6b5423f9/blush5.gif',
            'https://ucarecdn.com/8f7cea58-cab6-47d2-a07b-c9685e59db08/blush10.gif',
            'https://ucarecdn.com/69486095-6f15-4a7d-92e3-0c6e4fe4e379/blush12.gif',
            'https://ucarecdn.com/239165b3-ca39-40b3-83f5-5b2037658ae1/blush7.gif',
            'https://ucarecdn.com/a705a0ff-52ae-4817-b62c-5687485f1eee/blush9.gif',
            'https://ucarecdn.com/7f8e142e-276b-469f-8caa-ab89fc46e72e/blush13.gif',
            'https://ucarecdn.com/3d9db3ed-f358-470a-a60f-4a776204dd9a/blush16.gif',
            'https://ucarecdn.com/60d1d863-e1f2-4836-9b25-46224dd91899/blush3.gif',
            'https://ucarecdn.com/ae4d2ed0-cf45-438a-9ea1-43283882824c/blush14.gif',
            'https://ucarecdn.com/6d57ff0b-d126-4072-badc-07988da3c34d/blush19.gif',
            'https://ucarecdn.com/2bf57624-a3ca-4615-a39f-650a39bb4bbc/blush15.gif',
            'https://ucarecdn.com/410fbc8c-71ed-4122-a409-aaca49ca9743/blush18.gif',
            'https://ucarecdn.com/88c4acd9-06c1-4a58-afdf-0aafd8420dd3/blush20.gif',
            'https://ucarecdn.com/bf8c456f-c628-41ad-b01f-19a39f4d24aa/blush17.gif',
            'https://ucarecdn.com/390357c7-eaea-4308-9f07-24d1fa223b87/blush8.gif',
            'https://ucarecdn.com/00b92123-af15-4a3d-9dff-a8c8c3c9d669/blush11.gif',
            'https://ucarecdn.com/61744de0-7c9b-4e60-9ef1-221e2cd377a5/blush.gif' ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(colorData.Color || color)
            .setTitle("Blush")
            .setDescription(`${member} blushes${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};