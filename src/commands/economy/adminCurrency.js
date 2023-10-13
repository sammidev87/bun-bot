const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const EconomyDB = require("../../schemas/economyDB");
const ShopDB = require("../../schemas/shopDB");
const PickDB = require("../../schemas/pickDB");
const getLuckyDB = require("../../schemas/getLuckyDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("currency")
        .setDescription("Currency commands.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub => sub.setName("modify-bal-add")
            .setDescription("Add currency to a user.")
            .addUserOption(opt => opt.setName("user").setDescription("User you want to add currency to.").setRequired(true))
            .addNumberOption(opt => opt.setName("amount").setDescription("Amount of currency you want to add.").setRequired(true))
        )
        .addSubcommand(sub => sub.setName("modify-bal-remove")
            .setDescription("Remove currency from a user.")
            .addUserOption(opt => opt.setName("user").setDescription("User you want to remove currency from.").setRequired(true))
            .addNumberOption(opt => opt.setName("amount").setDescription("Amount of currency you want to remove.").setRequired(true))
        )
        .addSubcommand(sub => sub.setName("shop-add")
            .setDescription("Add items to the shop.")
            .addStringOption(opt => opt.setName("name").setDescription("Name of the item.").setRequired(true))
            .addNumberOption(opt => opt.setName("price").setDescription("Price of the item.").setRequired(true))
            .addRoleOption(opt => opt.setName("role").setDescription("Role you want given to the user when item is purchased.").setRequired(false))
            .addStringOption(opt => opt.setName("description").setDescription("Description of the item.").setRequired(false))
        )
        .addSubcommand(sub => sub.setName("shop-remove")
            .setDescription("Remove item from the shop.")
            .addStringOption(opt => opt.setName("name").setDescription("Name of the item you want to remove.").setRequired(true))
        )
        .addSubcommand(sub => sub.setName("modify-inv-add")
            .setDescription("Add inventory to a user.")
            .addUserOption(opt => opt.setName("user").setDescription("User you want to add the item too.").setRequired(true))
            .addStringOption(opt => opt.setName("name").setDescription("Name of the item you want to add.").setRequired(true))
        )
        .addSubcommand(sub => sub.setName("modify-inv-remove")
            .setDescription("Remove inventory from a user.")
            .addUserOption(opt => opt.setName("user").setDescription("User you want to remove the item from.").setRequired(true))
            .addStringOption(opt => opt.setName("name").setDescription("Name of the item you want to remove.").setRequired(true))
        )
        .addSubcommand(sub => sub.setName("pick-channel")
            .setDescription("Pick Channel set up.")
            .addChannelOption(opt => opt.setName("channel").setDescription("Channel you want to allow pick messages sent in.").setRequired(true)))
        .addSubcommand(sub => sub.setName("dig-role-add")
            .setDescription("Add a role to the dig command")
            .addRoleOption(opt => opt.setName("role").setDescription("Role you want added to the dig command.").setRequired(true)))
        .addSubcommand(sub => sub.setName("dig-role-remove")
            .setDescription("Remove a role from the dig command.")
            .addRoleOption(opt => opt.setName("role").setDescription("Role you want removed.").setRequired(true))),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, member, guild } = interaction;
        const { color } = client;

        switch (options.getSubcommand()) {

            case "modify-bal-add": {

                const user = options.getUser("user");
                const amount = options.getNumber("amount");

                let data = await EconomyDB.findOne({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
                if (!data) {
                    data = new EconomyDB({
                        Guild: guild.id,
                        User: user.id,
                        Balance: amount,
                        Inventory: [],
                    });
                } else if (data) {

                    data.Balance = data.Balance + amount;

                }
                await data.save();

                interaction.reply({
                    content: `<@${user.id}>`, embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setTitle("Modify Balance")
                            .setDescription(`<@${member.id}> has added ${amount} 🪙's to <@${user.id}>!`)
                            .setFooter({ text: "Currency by Bun Bot" })
                            .setTimestamp()
                    ]
                }).then(() =>
                    setTimeout(
                        () => interaction.deleteReply(),
                        10000
                    )
                ).catch(err => console.error(err));

            }

                break;

            case "modify-bal-remove": {

                const user = options.getUser("user");
                const amount = options.getNumber("amount");

                const data = await EconomyDB.findOne({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `That user does not exist!`, ephemeral: true });

                data.Balance = data.Balance - amount;
                await data.save();

                interaction.reply({
                    content: `<@${user.id}>`, embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setTitle("Modify Balance")
                            .setDescription(`<@${member.id}> has removed ${amount} 🪙's from <@${user.id}>!`)
                            .setFooter({ text: "Currency by Bun Bot" })
                            .setTimestamp()
                    ]
                }).then(() =>
                    setTimeout(
                        () => interaction.deleteReply(),
                        10000
                    )
                ).catch(err => console.error(err));

            }

                break;

            case "shop-add": {

                const name = options.getString("name");
                const price = options.getNumber("price");
                const getRole = options.getRole("role");
                if (getRole) {
                    role = getRole.id;
                } else {
                    role = null;
                }
                const description = options.getString("description");
                const newItem = {
                    ItemName: name,
                    ItemPrice: price,
                    ItemRole: role,
                    ItemDescription: description,
                };

                await ShopDB.findOne({ Guild: guild.id }).then((data) => {
                    if (!data) {

                        ShopDB.create({
                            Guild: guild.id,
                            Items: [ newItem ],
                        });

                    }
                }).catch(err => console.error(err));

                let data = await ShopDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setTitle("Shop Add")
                            .setDescription(`Your item:\nName: ${newItem.ItemName}\nDescription: ${newItem.ItemDescription}\nPrice: ${newItem.ItemPrice}\nRole Reward: <@&${newItem.ItemRole}>\n\nHas been saved!`)
                            .setFooter({ text: "Shop by Bun Bot" })
                            .setTimestamp()
                    ]
                });

                let itemData = null;
                for (var i = 0; i < data.Items.length; i++) {
                    if (data.Items[ i ].ItemName === name) {
                        itemData = data.Items[ i ];
                        break;
                    }
                }

                if (itemData) {

                    return interaction.reply({ content: `There is already an item by that name!`, ephemeral: true });

                } else {

                    data.Items.push(newItem);
                    await data.save();

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color)
                                .setTitle("Shop Add")
                                .setDescription(`Your item:\nName: ${newItem.ItemName}\nDescription: ${newItem.ItemDescription}\nPrice: ${newItem.ItemPrice}\nRole Reward: <@&${newItem.ItemRole}>\n\nHas been saved!`)
                                .setFooter({ text: "Shop by Bun Bot" })
                                .setTimestamp()
                        ]
                    });

                }

            }

                break;

            case "shop-remove": {

                const name = options.getString("name");

                let data = await ShopDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `There are no items in the shop to remove!`, ephemeral: true });

                const items = data.Items;
                const findItem = items.find((i) => i.ItemName === name);

                if (!findItem) {

                    return interaction.reply({ content: `There is no item by this name!`, ephemeral: true });

                } else {

                    const filteredItems = items.filter((i) => i.ItemName !== name);
                    data.Items = filteredItems;

                    await data.save();

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color)
                                .setTitle("Shop Remove")
                                .setDescription(`Your item has been removed!`)
                                .setFooter({ text: "Shop by Bun Bot" })
                                .setTimestamp()
                        ]
                    }).then(() =>
                        setTimeout(
                            () => interaction.deleteReply(),
                            10000
                        )
                    ).catch(err => console.error(err));

                }

            }

                break;

            case "modify-inv-add": {

                const user = options.getUser("user");
                const itemName = options.getString("name");

                let data = await EconomyDB.findOne({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `There is no data for this user!`, ephemeral: true });

                let itemData = await ShopDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!itemData) return interaction.reply({ content: `There are no items in the shop yet!`, ephemeral: true });

                const items = itemData.Items;
                const item = items.find((i) => i.ItemName === itemName);
                if (!item) return interaction.reply({ content: `There is no item by that name!`, ephemeral: true });

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
                            .setTitle("Modify Inventory")
                            .setDescription(`Your item:\nName: ${item.ItemName}\nDescription: ${item.ItemDescription}\nPrice: ${item.ItemPrice}\nRole Reward: <@&${item.ItemRole}>\n has been given to <@${user.id}>!`)
                            .setFooter({ text: "Shop by Bun Bot" })
                            .setTimestamp()
                    ]
                }).then(() =>
                    setTimeout(
                        () => interaction.deleteReply(),
                        10000
                    )
                ).catch(err => console.error(err));

            }

                break;

            case "modify-inv-remove": {

                const user = options.getUser("user");
                const itemName = options.getString("name");

                let data = await EconomyDB.findOne({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `There is no data for this user!`, ephemeral: true });

                let itemData = await ShopDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!itemData) return interaction.reply({ content: `There are no items in the shop yet!`, ephemeral: true });

                const item = itemData.Items.find((i) => i.ItemName === itemName);
                if (!item) return interaction.reply({ content: `There is no item by that name!`, ephemeral: true });

                const userItem = data.Inventory.find((i) => i.ItemName === itemName);
                if (!userItem) return interaction.reply({ content: `This user does not have any item by that name!`, ephemeral: true });

                if (item.ItemName === userItem.ItemName) {

                    const filteredItems = data.Inventory.filter((i) => i.ItemName !== itemName);
                    data.Inventory = filteredItems;
                    await data.save();

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color)
                                .setTitle("Removed")
                                .setDescription("The item has been removed from their inventory!")
                                .setFooter({ text: "Currency by Bun Bot" })
                                .setTimestamp()
                        ]
                    }).then(() =>
                        setTimeout(
                            () => interaction.deleteReply(),
                            10000
                        )
                    ).catch(err => console.error(err));

                } else {
                    return interaction.reply({ content: `We encountered an error trying to remove the item!`, ephemeral: true });
                }

            }

                break;

            case "pick-channel": {

                const channel = options.getChannel("channel");

                let data = await PickDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `There is no pick data for this server yet!`, ephemeral: true });

                if (!data.PickChannels) {
                    data.PickChannels = [ `${channel.id}` ];
                } else {
                    data.PickChannels.push(`${channel.id}`);
                }
                await data.save();

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setTitle("Pick Channel")
                            .setDescription(`Your channel \`${channel.name}\` has been saved!`)
                            .setFooter({ text: "Pick by Bun Bot" })
                            .setTimestamp()
                    ]
                });

            }

                break;

            case "dig-role-add": {

                const role = options.getRole("role");

                const data = await getLuckyDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!data) {
                    getLuckyDB.create({
                        Guild: guild.id,
                        Roles: [ `${role.id}` ],
                    });
                } else {
                    data.Roles.push(`${role.id}`);
                }

                interaction.reply({ content: `Your role ${role} has been saved!`, ephemeral: true });

            }

                break;

            case "dig-role-remove": {

                const role = options.getRole("role");

                const data = await getLuckyDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `There are no roles saved yet!`, ephemeral: true });

                const findRole = data.Roles.find((i) => i === role.id);
                if (!findRole) return interaction.reply({ content: `That role is not in the list!`, ephemeral: true });

                const filteredRoles = data.Roles.filter((i) => i !== role.id);
                data.Roles = filteredRoles;
                await data.save();

                interaction.reply({ content: `Your role ${role} has been removed!`, ephemeral: true });

            }

                break;

        }

    }
};