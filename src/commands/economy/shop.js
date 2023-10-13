const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const EconomyDB = require("../../schemas/economyDB");
const ShopDB = require("../../schemas/shopDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Shop Commands.")
        .addSubcommand(sub => sub.setName("view")
            .setDescription("View the shop."))
        .addSubcommand(sub => sub.setName("buy")
            .setDescription("Purchase an item from the shop.")
            .addStringOption(opt => opt.setName("name").setDescription("Name of the item you want to purchase.").setRequired(true)))
        .addSubcommand(sub => sub.setName("use")
            .setDescription("Use an item from your inventory.")
            .addStringOption(opt => opt.setName("name").setDescription("Name of the item you want to use.").setRequired(true))),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, member, guild } = interaction;
        const { color } = client;

        const user = options.getUser("user") || member;

        const data = await EconomyDB.findOne({ Guild: guild.id, User: user.id }).catch(err => { });
        if (!data) return interaction.reply({ content: `You have no Balance data yet!`, ephemeral: true });

        const shopData = await ShopDB.findOne({ Guild: guild.id }).catch(err => { });
        if (!shopData) return interaction.reply({ content: `There is no shop set up yet!`, ephemeral: true });

        switch (options.getSubcommand()) {

            case "view": {

                const items = shopData.Items;
                let pageSize = 5;
                let countPages = Math.ceil(items.length / pageSize);
                let disabled = false;
                if (items.length <= 5) {
                    disabled = true;
                }

                let firstListSplit = items.splice(0, 5);
                let firstList = [];

                firstListSplit.forEach((i) => {

                    let description = `🪙**${i.ItemPrice}** **-** **Name: ${i.ItemName}**\nDescription: ${i.ItemDescription}\nRole Reward: <@&${i.ItemRole}>`;
                    firstList.push(description + `\n\n`);

                });

                const Embed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`${guild.name}'s Shop`)
                    .setDescription(`buy an item by using \`/shop buy item: <item name>\`\n\n${firstList.toString()}`)
                    .setFooter({ text: `Page 1 of ${countPages}` })
                    .setTimestamp();

                const Buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`previous`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`⏮️`)
                            .setDisabled(true),
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

                data.ShopPage = 1;
                await data.save();

                interaction.reply({ embeds: [ Embed ], components: [ Buttons ] });

            }

                break;

            case "buy": {

                const itemName = options.getString("name");

                let data = await EconomyDB.findOne({ Guild: guild.id, User: member.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `There is no data for you yet!`, ephemeral: true });
                const userItem = data.Inventory.find((i) => i.ItemName === itemName);
                if (userItem) return interaction.reply({ content: `You already have this item! Please use the one you have before purchasing another!`, ephemeral: true });

                let itemData = await ShopDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!itemData) return interaction.reply({ content: `There are no items in the shop yet!`, ephemeral: true });

                const item = itemData.Items.find((i) => i.ItemName === itemName);
                if (!item) return interaction.reply({ content: `There is no item by that name!`, ephemeral: true });

                if (data.Balance < item.ItemPrice) return interaction.reply({ content: `You do not have enough to buy this item!`, ephemeral: true });
                else if (data.Balance >= item.ItemPrice) {
                    data.Balance = data.Balance - item.ItemPrice;
                    await data.save();

                    if (!data.Inventory) {

                        data.Inventory = [ item ];
                        await data.save();

                    } else {

                        data.Inventory.push(item);
                        await data.save();

                    }

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color)
                                .setTitle("Buy")
                                .setDescription(`Your item:\nName: ${item.ItemName}\nDescription: ${item.ItemDescription}\nPrice: ${item.ItemPrice}\nRole Reward: <@&${item.ItemRole}>\n has been added to your inventory!`)
                                .setFooter({ text: "Shop by Bun Bot" })
                                .setTimestamp()
                        ]
                    });

                }

            }

                break;

            case "use": {

                const itemName = options.getString("name");

                let data = await EconomyDB.findOne({ Guild: guild.id, User: member.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `There is no data for you yet!`, ephemeral: true });

                let itemData = await ShopDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!itemData) return interaction.reply({ content: `There are no items in the shop yet!`, ephemeral: true });

                if (!data.Inventory) return interaction.reply({ content: `You have no items in your inventory!`, ephemeral: true });
                const item = data.Inventory.find((i) => i.ItemName === itemName);
                if (!item) return interaction.reply({ content: `There is no item by that name!`, ephemeral: true });

                if (!item.ItemReply) {

                    if (item.ItemRole) {
                        const role = guild.roles.cache.get(item.ItemRole);
                        member.roles.add(role);
                    }

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color)
                                .setTitle("Use")
                                .setDescription(`You have used ${itemName}`)
                                .setFooter({ text: "Shop by Bun Bot" })
                                .setTimestamp()
                        ]
                    });

                } else {

                    if (item.ItemRole) {
                        const role = guild.roles.cache.get(item.ItemRole);
                        member.roles.add(role);
                    }

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color)
                                .setTitle("Use")
                                .setDescription(`${item.ItemReply}`)
                                .setFooter({ text: "Shop by Bun Bot" })
                                .setTimestamp()
                        ]
                    });

                }

                const filteredItems = data.Inventory.filter((i) => i.ItemName !== itemName);
                data.Inventory = filteredItems;
                await data.save();

            }

        }

    }
};