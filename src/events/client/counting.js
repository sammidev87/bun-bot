const { Client, Message, Events } = require("discord.js");
const CountingDB = require("../../schemas/countingDB");
const math = require("mathjs");

module.exports = {
    name: Events.MessageCreate,

    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    async execute(message, client) {

        const { author, guild, content, channel } = message;
        const { user } = client;

        //Counting
        const Data = await CountingDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        if (!Data || `<#${channel.id}>` !== Data.Channel || author.bot || isNaN(content[ 0 ])) return;
        let Replace = content.replace(/[a-z]/ig, '');
        let solved = math.evaluate(Replace);
        let counting = Data.Count;
        if (!Data.Count) counting = 0;
        if (!Data.HighScore) Data.HighScore = 0;

        if (author.id === Data.LastUser) {
            return message.reply({ content: `Hey! Give someone else a turn you bootyhead!`, ephemeral: true });
        } else if (Number(solved) === Number(counting) + 1) {
            Data.Count = Number(solved);
            Data.LastUser = author.id;
            if (Number(solved) === 69) {
                await message.react(`👀`);
            } else if (Number(solved) % 100 === 0) {
                await message.react(`💯`);
            } else if (Number(solved) <= Data.HighScore) {
                await message.react(`✅`);
            } else if (Number(solved) >= Data.HighScore) {
                await message.react(`🏆`);
                Data.HighScore = Number(solved);
            }
            Data.LastMessageId = message.id;
            await Data.save();
        } else if (author.id !== user.id) {
            Data.Count = 0;
            Data.LastUser = author.id;
            Data.LastMessageId = message.id;
            await Data.save();
            return message.reply({ content: `Uh-Oh, You messed up the counting!`, ephemeral: false });
        }
    }
};