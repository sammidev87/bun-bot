const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const EconomyDB = require("../../schemas/economyDB");
const ShopDB = require("../../schemas/shopDB");

module.exports = {
    data: {
        name: `previous`,
    },
    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { guild, member } = interaction;
        const { color } = client;

        const data = await EconomyDB.findOne({ Guild: guild.id, User: member.id }).catch(err => console.error(err));
        if (!data) return interaction.reply({ content: `You have no Balance data yet!`, ephemeral: true });

        const shopData = await ShopDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        if (!shopData) return interaction.reply({ content: `There is no shop set up yet!`, ephemeral: true });

        const items = shopData.Items;
        let pageSize = 5;
        let countPages = Math.ceil(items.length / pageSize);

        if (data.ShopPage > 0) {

            let prevPage = data.ShopPage - 1;

            if (prevPage >= 1) {
                data.ShopPage = data.ShopPage - 1;
                await data.save();

                const startIndex = data.ShopPage * pageSize - pageSize;
                const listSplit = items.splice(startIndex, pageSize);
                let list = [];
                let disabled = false;
                if (data.ShopPage >= countPages) {
                    disabled = true;
                } else {
                    disabled = false;
                }

                listSplit.forEach((i) => {

                    let description = `🪙**${i.ItemPrice}** **-** **Name: ${i.ItemName}**\nDescription: ${i.ItemDescription}\nRole Reward: <@&${i.ItemRole}>`;
                    list.push(description + `\n\n`);

                });

                const Embed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`Shop`)
                    .setDescription(list.toString())
                    .setFooter({ text: `Page ${data.ShopPage} of ${countPages}` })
                    .setTimestamp();

                const Buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`previous`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`⏮️`)
                            .setDisabled(data.ShopPage === 1),
                        new ButtonBuilder()
                            .setCustomId(`exit`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(`❌`)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId(`next`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`⏭️`)
                            .setDisabled(disabled),
                    );

                interaction.update({ embeds: [ Embed ], components: [ Buttons ] });

            } else {
                data.ShopPage = 1;
                await data.save();

                const startIndex = data.ShopPage * pageSize - pageSize;
                const listSplit = items.splice(startIndex, pageSize);
                let list = [];
                let disabled = false;
                if (data.ShopPage >= countPages) {
                    disabled = true;
                } else {
                    disabled = false;
                }

                listSplit.forEach((i) => {

                    let description = `🪙**${i.ItemPrice}** **-** **Name: ${i.ItemName}**\nDescription: ${i.ItemDescription}\nRole Reward: <@&${i.ItemRole}>`;
                    list.push(description + `\n\n`);

                });

                const Embed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`Shop`)
                    .setDescription(list.toString())
                    .setFooter({ text: `Page ${data.ShopPage} of ${countPages}` })
                    .setTimestamp();

                const Buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`previous`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`⏮️`)
                            .setDisabled(data.ShopPage === 1),
                        new ButtonBuilder()
                            .setCustomId(`exit`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(`❌`)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId(`next`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`⏭️`)
                            .setDisabled(disabled),
                    );

                interaction.update({ embeds: [ Embed ], components: [ Buttons ] });

            }

        }

    }
};