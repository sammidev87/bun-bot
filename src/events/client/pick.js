const { Client, Message, EmbedBuilder, Events } = require("discord.js");
const PickDB = require("../../schemas/pickDB");

module.exports = {
    name: Events.MessageCreate,

    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    async execute(message, client) {

        const { guild, channel, author } = message;
        const { color } = client;
        const sleep = async (ms) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, ms || 0);
            });
        };

        if (!guild || author.bot) return;

        PickDB.findOne({ Guild: guild.id }).then((data) => {
            if (!data) {

                PickDB.create({
                    Guild: guild.id,
                    OpenWindow: false,
                    MessageCount: 0,
                });

            }
        }).catch(err => console.error(err));

        await sleep(500);

        let pickData = await PickDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        if (!pickData.PickChannels.includes(channel.id)) return;

        pickData.MessageCount = pickData.MessageCount + 1;
        if (pickData.MessageCount >= 31) pickData.MessageCount = 0;
        await pickData.save();

        if (pickData.MessageCount === 30) {

            const Embed = new EmbedBuilder()
                .setColor(color)
                .setTitle("Pick!")
                .setDescription(`Someone has dropped 🪙's! Pick them up by using \`/pick\`!`)
                .setFooter({ text: "Pick by Bun Bot" })
                .setTimestamp();

            message.reply({ embeds: [ Embed ] }).then(msg => {
                setTimeout(() => msg.delete(), 20000);
            }).catch(err => console.error(err));

            pickData.OpenWindow = true;
            pickData.MessageCount = 0;
            await pickData.save();

            await sleep(20000);
            pickData.OpenWindow = false;
            await pickData.save();

        }

    }
};