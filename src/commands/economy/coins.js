const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const EconomyDB = require("../../schemas/economyDB");
const humanizeDuration = require("humanize-duration");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coins")
        .setDescription("Currency commands.")
        .addSubcommand(sub => sub.setName("balance")
            .setDescription("Sends the users balance and inventory")
            .addUserOption(opt => opt.setName("user").setDescription("User you want to see the balance of.").setRequired(false)))
        .addSubcommand(sub => sub.setName("snuggle")
            .setDescription("Snuggle Bun Bot for coins!"))
        .addSubcommand(sub => sub.setName("pet")
            .setDescription("Pet Bun Bot for coins!."))
        .addSubcommand(sub => sub.setName("give-bal")
            .setDescription("Give another user coins!.")
            .addUserOption(opt => opt.setName("user").setDescription("User you want to give coins to.").setRequired(true))
            .addNumberOption(opt => opt.setName("amount").setDescription("Amount of coins you want to give.").setRequired(true)))
        .addSubcommand(sub => sub.setName("give-inv")
            .setDescription("Give another user items!.")
            .addUserOption(opt => opt.setName("user").setDescription("User you want to give items to.").setRequired(true))
            .addStringOption(opt => opt.setName("item").setDescription("Name of the item you want to give.").setRequired(true))),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, member, guild } = interaction;
        const { color, cooldowns } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));

        switch (options.getSubcommand()) {

            case "balance": {

                const user = options.getUser("user") || member.user;

                const data = await EconomyDB.findOne({ Guild: guild.id, User: user.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `This user has no Balance data!`, ephemeral: true });

                let inventoryItems = [];
                data.Inventory.forEach((i) => {
                    let itemNames = `${i.ItemName}`;
                    inventoryItems.push(itemNames + `\n`);
                });

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(colorData.Color || color)
                            .setTitle(`${user.username}'s Balance`)
                            .setDescription(`Here is a list of your balance and items:`)
                            .setFields(
                                {
                                    name: `Inventory`,
                                    value: `📃 List:\n\n${inventoryItems}`,
                                    inline: true,
                                },
                                {
                                    name: `Balance`,
                                    value: `🪙 ${data.Balance}`,
                                    inline: true,
                                },
                            )
                            .setFooter({ text: "Currency by Bun Bot" })
                            .setTimestamp()
                    ]
                });

            }

                break;

            case "snuggle": {

                const data = await EconomyDB.findOne({ Guild: guild.id, User: member.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `This user has no Balance data!`, ephemeral: true });

                const cooldown = cooldowns.get(`${member.id}, snuggle`);

                if (cooldown) {

                    const remaining = humanizeDuration(cooldown - Date.now());

                    const Embed = new EmbedBuilder()
                        .setColor(colorData.Color || color)
                        .setTitle("Snuggle")
                        .setDescription(`Please wait another ${remaining} before using snuggle again.`)
                        .setFooter({ text: "Currency by Bun Bot" })
                        .setTimestamp();

                    interaction.reply({ embeds: [ Embed ] });

                } else {

                    data.Balance = data.Balance + 3;

                    await data.save();

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(colorData.Color || color)
                                .setTitle("Snuggle Time!")
                                .setDescription(`<@${member.id}> snuggled Bun Bot and earned 3 🪙!`)
                                .setFooter({ text: "Currency by Bun Bot" })
                                .setTimestamp()
                        ]
                    });

                    cooldowns.set(`${member.id}, snuggle`, Date.now() + 57600000);

                    setTimeout(() => {
                        cooldowns.delete(`${member.id}, snuggle`);
                    }, 57600000);

                }

            }

                break;

            case "pet": {

                const data = await EconomyDB.findOne({ Guild: guild.id, User: member.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `This user has no Balance data!`, ephemeral: true });

                const cooldown = cooldowns.get(`${member.id}, pet`);

                if (cooldown) {

                    const remaining = humanizeDuration(cooldown - Date.now());

                    const Embed = new EmbedBuilder()
                        .setColor(colorData.Color || color)
                        .setTitle("Pet")
                        .setDescription(`Please wait another ${remaining} before using pet again.`)
                        .setFooter({ text: "Currency by Bun Bot" })
                        .setTimestamp();

                    interaction.reply({ embeds: [ Embed ] });

                } else {

                    data.Balance = data.Balance + 5;

                    await data.save();

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(colorData.Color || color)
                                .setTitle("Pet!")
                                .setDescription(`<@${member.id}> petted Bun Bot and earned 5 🪙!`)
                                .setFooter({ text: "Currency by Bun Bot" })
                                .setTimestamp()
                        ]
                    });

                    cooldowns.set(`${member.id}, pet`, Date.now() + 57600000);

                    setTimeout(() => {
                        cooldowns.delete(`${member.id}, pet`);
                    }, 57600000);

                }

            }

                break;

            case "give-bal": {

                const data = await EconomyDB.findOne({ Guild: guild.id, User: member.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `This user has no Balance data!`, ephemeral: true });

                const targetUser = options.getUser("user");
                const amount = options.getNumber("amount");
                if (data.Balance < amount) return interaction.reply({ content: `You do not have that many coins to give!`, ephemeral: true });

                data.Balance = data.Balance - amount;
                await data.save();

                const targetUserData = await EconomyDB.findOne({ Guild: guild.id, User: targetUser.id }).catch(err => console.error(err));

                targetUserData.Balance = targetUserData.Balance + amount;
                await targetUserData.save();

                const Embed = new EmbedBuilder()
                    .setColor(colorData.Color || color)
                    .setTitle("Give Coins")
                    .setDescription(`<@${member.id}> has given <@${targetUser.id}> ${amount} 🪙's!`)
                    .setFooter({ text: "Currency by Bun Bot" })
                    .setTimestamp();

                interaction.reply({ content: `<@${targetUser.id}>`, embeds: [ Embed ] }).then(() =>
                    setTimeout(
                        () => interaction.deleteReply(),
                        10000
                    )
                ).catch(err => console.error(err));

            }

                break;

            case "give-inv": {

                const data = await EconomyDB.findOne({ Guild: guild.id, User: member.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `You have no data yet!`, ephemeral: true });

                const targetUser = options.getUser("user");
                const itemName = options.getString("item");
                const item = data.Inventory.find((i) => i.ItemName === itemName);

                const targetUserData = await EconomyDB.findOne({ Guild: guild.id, User: targetUser.id }).catch(err => console.error(err));
                if (!targetUserData) return interaction.reply({ content: `This user has no data!`, ephemeral: true });

                if (!item) return interaction.reply({ content: `You do not have an Item by that name!`, ephemeral: true });

                if (!targetUserData.Inventory) {
                    targetUserData.Inventory = [ item ];
                } else {
                    targetUserData.Inventory.push(item);
                }
                await targetUserData.save();

                const filteredItems = data.Inventory.filter((i) => i.ItemName !== itemName);
                data.Inventory = filteredItems;
                await data.save();

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(colorData.Color || color)
                            .setTitle("Give Inventory")
                            .setDescription(`The item ${itemName} has been given to ${targetUser}`)
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

        }

    }
};