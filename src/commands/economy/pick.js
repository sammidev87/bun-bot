const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const EconomyDB = require("../../schemas/economyDB");
const PickDB = require("../../schemas/pickDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pick")
        .setDescription("Pick coins."),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { guild, member } = interaction;
        const { color } = client;

        let pickData = await PickDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let economyData = await EconomyDB.findOne({ Guild: guild.id, User: member.id }).catch(err => console.error(err));

        if (pickData.OpenWindow === true) {

            let coinAmount = [ 1, 2, 3, 4, 5 ];
            let coins = coinAmount[ Math.floor(Math.random() * coinAmount.length) ];

            economyData.Balance = economyData.Balance + coins;
            await economyData.save();

            const Embed = new EmbedBuilder()
                .setColor(color)
                .setTitle("Hurray!")
                .setDescription(`You have picked ${coins} 🪙's!`)
                .setFooter({ text: "Pick by Bun Bot" })
                .setTimestamp();

            interaction.reply({ embeds: [ Embed ] }).then(() =>
                setTimeout(
                    () => interaction.deleteReply(),
                    10000
                )
            ).catch(err => console.error(err));

        } else if (pickData.OpenWindow === false) {

            const Embed = new EmbedBuilder()
                .setColor(color)
                .setTitle("Uh Oh!")
                .setDescription(`There is nothing to pick right now!`)
                .setFooter({ text: "Pick by Bun Bot" })
                .setTimestamp();

            interaction.reply({ embeds: [ Embed ] }).then(() =>
                setTimeout(
                    () => interaction.deleteReply(),
                    10000
                )
            ).catch(err => console.error(err));

        }

    }
};