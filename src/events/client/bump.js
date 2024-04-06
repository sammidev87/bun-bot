const { Client, Message, EmbedBuilder, Events } = require("discord.js");
const EconomyDB = require("../../schemas/economyDB");
const bumpDB = require("../../schemas/bumpDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    name: Events.MessageCreate,

    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    async execute(message, client) {

        const { author, channel, interaction, guild } = message;
        const bot = author.id;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }
        const sleep = async (ms) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, ms || 0);
            });
        };
        const data = await bumpDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        if (!data) return;
        if (bot !== `302050872383242240`) return;
        if (guild.id !== data.Guild) return;

        const member = interaction.user.id;

        EconomyDB.findOne({ Guild: guild.id, User: member }).then((data) => {
            if (!data) {
                EconomyDB.create({
                    Guild: guild.id,
                    User: member,
                    Balance: 0,
                    BumpCount: 0,
                    Inventory: [],
                });
            } 
        }).catch(err => console.log(err));

        //Disboard Bump Buddy
        message.react(`⏲️`);

        await sleep(500);

        let econData = await EconomyDB.findOne({ Guild: guild.id, User: member }).catch(err => console.error(err));

        if (econData.BumpCount) {
            econData.Balance += 10;
            econData.BumpCount += 1;
            await econData.save();
        } else {
            econData.Balance += 10;
            econData.BumpCount = 1;
        }

        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setTitle("Bumped!")
                    .setDescription("Thank you for bumping our server! You have been awarded 10 🪙's! We will remind you when to bump again!")
                    .setFooter({ text: "Bump Buddy by Bun Bot" })
                    .setTimestamp()
            ]
        }).then(async () => {
            await sleep(7200000);

            channel.send({
                content: `<@${member}>`,
                embeds: [
                    new EmbedBuilder()
                        .setColor(embedColor)
                        .setTitle("Time to Bump!")
                        .setDescription(`Help us get new members! Use \`/bump\` to bump the server!`)
                        .setFooter({ text: "Bump Buddy by Bun Bot" })
                        .setTimestamp()
                ]
            });
        });

    }

};