const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const EconomyDB = require("../../schemas/economyDB");
const getLuckyDB = require("../../schemas/getLuckyDB");
const humanizeDuration = require("humanize-duration");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get-lucky")
        .setDescription("Play games to get special items!")
        .addSubcommand(sub => sub.setName("dig")
            .setDescription("Dig up coins and items."))
        .addSubcommand(sub => sub.setName("fish")
            .setDescription("Fish for fish you can sell"))
        .addSubcommand(sub => sub.setName("hunt")
            .setDescription("Hunt for animals you can sell"))
        .addSubcommand(sub => sub.setName("beg")
            .setDescription("Beg for coins"))
        .addSubcommand(sub => sub.setName("crime")
            .setDescription("Commit a crime for coins"))
        .addSubcommand(sub => sub.setName("daily")
            .setDescription("Get your daily dose of coins!"))
        .addSubcommand(sub => sub.setName("high-low")
            .setDescription("Guess high or low for a chance to win coins!")),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {
        const { options, member, guild } = interaction;
        const { color, cooldowns, messageId } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));

        await EconomyDB.findOne({ Guild: guild.id, User: member.id }).then((data) => {
            if (!data) {
                EconomyDB.create({
                    Guild: guild.id,
                    User: member.id,
                    Balance: 0,
                    Inventory: [],
                });
            }
        }).catch(err => console.error(err));

        switch (options.getSubcommand()) {

            case "dig": {

                const data = await getLuckyDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `Your server needs to set up \`/currency dig-add-role\` before you can use this command!`, ephemeral: true });

                const cooldown = cooldowns.get(`${member.id}, dig`);
                const percentage = Math.floor(Math.random() * 20) + 1;
                const worm = {
                    ItemName: `worm 🪱`,
                    ItemPrice: 5,
                    ItemRole: "",
                    ItemDescription: "earthworm from the ground",
                };
                const beetle = {
                    ItemName: `beetle 🪲`,
                    ItemPrice: 10,
                    ItemRole: "",
                    ItemDescription: "beetle from the ground",
                };
                const coin = {
                    ItemName: `coin 🪙`,
                    ItemPrice: 1,
                    ItemRole: "",
                    ItemDescription: "coin",
                };
                const trash = {
                    ItemName: `trash 🤮`,
                    ItemPrice: 0,
                    ItemRole: "",
                    ItemDescription: "trash from the ground, ewww",
                };
                const nothing = {
                    ItemName: `nothing 😔`,
                    ItemPrice: 0,
                    ItemRole: "",
                    ItemDescription: "literally nothing",
                };
                const items = [ worm, beetle, coin, trash, nothing ];
                const randRoles = Math.floor(Math.random() * data.Roles.length);
                const choseRole = data.Roles[ randRoles ];
                const randItem = Math.floor(Math.random() * items.length);
                const choseItem = items[ randItem ];

                if (percentage === 20) {

                    if (cooldown) {

                        const timeStamp = humanizeDuration(cooldown - Date.now(), { round: true });
                        interaction.reply({ content: `You are on cooldown, you can use this command again after \`${timeStamp}\`!`, ephemeral: true }).then((message) => {
                            setInterval(() => {
                                const remaining = humanizeDuration(cooldown - Date.now(), { round: true });
                                message.edit({ content: `You are on cooldown, you can use this command again after \`${remaining}\`!`, ephemeral: true });
                            }, 1000);
                        });

                    } else {

                        cooldowns.set(`${member.id}, dig`, Date.now() + 300000);
                        setTimeout(() => {
                            cooldowns.delete(`${member.id}, dig`);
                        }, 300000);

                        const role = guild.roles.cache.get(choseRole);
                        member.roles.add(role);

                        const message = interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(colorData.Color || color)
                                    .setTitle("Dig")
                                    .setDescription(`You dug up ${role}!`)
                                    .setFooter({ text: "Get Lucky by Bun Bot" })
                                    .setTimestamp()
                            ]
                        });

                        messageId.set(`${member.id}, dig`, message.id);

                    }

                } else {

                    if (cooldown) {

                        const timeStamp = humanizeDuration(cooldown - Date.now(), { round: true });
                        interaction.reply({ content: `You are on cooldown, you can use this command again after \`${timeStamp}\`!`, ephemeral: true }).then((message) => {
                            setInterval(() => {
                                const remaining = humanizeDuration(cooldown - Date.now(), { round: true });
                                message.edit({ content: `You are on cooldown, you can use this command again after \`${remaining}\`!`, ephemeral: true });
                            }, 1000);
                        });

                    } else {

                        cooldowns.set(`${member.id}, dig`, Date.now() + 300000);
                        setTimeout(() => {
                            cooldowns.delete(`${member.id}, dig`);
                        }, 300000);

                        if ([ coin ].includes(choseItem)) {

                            const data = await EconomyDB.findOne({ Guild: guild.id, User: member.id }).catch(err => console.error(err));

                            data.Balance = data.Balance + 1;
                            await data.save();

                            interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(colorData.Color || color)
                                        .setTitle("Dig")
                                        .setDescription(`You have dug up ${choseItem.ItemName}!`)
                                        .setFooter({ text: `Get Lucky by Bun Bot` })
                                        .setTimestamp()
                                ]
                            });

                        } else if ([ trash, nothing ].includes(choseItem)) {

                            interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(colorData.Color || color)
                                        .setTitle("Dig")
                                        .setDescription(`You have dug up ${choseItem.ItemName}!`)
                                        .setFooter({ text: `Get Lucky by Bun Bot` })
                                        .setTimestamp()
                                ]
                            });

                        } else if ([ worm, beetle ].includes(choseItem)) {

                            const data = await EconomyDB.findOne({ Guild: guild.id, User: member.id }).catch(err => console.error(err));

                            if (!data.Inventory) {

                                data.Inventory = [ choseItem ];
                                await data.save();

                            } else {

                                data.Inventory.push(choseItem);
                                await data.save();

                            }

                            interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(colorData.Color || color)
                                        .setTitle("Dig")
                                        .setDescription(`You have dug up ${choseItem.ItemName}!`)
                                        .setFooter({ text: `Get Lucky by Bun Bot` })
                                        .setTimestamp()
                                ]
                            });

                        }

                    }

                }

            }

                break;

            case "fish": {

                const cooldown = cooldowns.get(`${member.id}, fish`);
                const fish = {
                    ItemName: `fish 🐟`,
                    ItemPrice: 5,
                    ItemRole: "",
                    ItemDescription: "freshwater fish",
                };
                const tropicalFish = {
                    ItemName: `tropical fish 🐠`,
                    ItemPrice: 10,
                    ItemRole: "",
                    ItemDescription: "fish from the tropics",
                };
                const blowfish = {
                    ItemName: `blowfish 🐡`,
                    ItemPrice: 15,
                    ItemRole: "",
                    ItemDescription: "blowfish",
                };
                const newspaper = {
                    ItemName: `newspaper 🗞️`,
                    ItemPrice: 0,
                    ItemRole: "",
                    ItemDescription: "trash from the ground, ewww",
                };
                const metalCan = {
                    ItemName: `metal can 🥫`,
                    ItemPrice: 0,
                    ItemRole: "",
                    ItemDescription: "empty metal can"
                };
                const nothing = {
                    ItemName: `nothing 😔`,
                    ItemPrice: 0,
                    ItemRole: "",
                    ItemDescription: "literally nothing",
                };
                const items = [ fish, tropicalFish, blowfish, newspaper, metalCan, nothing ];
                const randItem = Math.floor(Math.random() * items.length);
                const choseItem = items[ randItem ];

                if (cooldown) {

                    const timeStamp = humanizeDuration(cooldown - Date.now(), { round: true });
                    interaction.reply({ content: `You are on cooldown, you can use this command again after \`${timeStamp}\`!`, ephemeral: true }).then((message) => {
                        setInterval(() => {
                            const remaining = humanizeDuration(cooldown - Date.now(), { round: true });
                            message.edit({ content: `You are on cooldown, you can use this command again after \`${remaining}\`!`, ephemeral: true });
                        }, 1000);
                    });

                } else {

                    cooldowns.set(`${member.id}, fish`, Date.now() + 300000);
                    setTimeout(() => {
                        cooldowns.delete(`${member.id}, fish`);
                    }, 300000);

                    if ([ fish, tropicalFish, blowfish ].includes(choseItem)) {

                        const data = await EconomyDB.findOne({ Guild: guild.id, User: member.id }).catch(err => console.error(err));

                        if (!data.Inventory) {

                            data.Inventory = [ choseItem ];
                            await data.save();

                        } else {

                            data.Inventory.push(choseItem);
                            await data.save();

                        }

                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(colorData.Color || color)
                                    .setTitle("Fish")
                                    .setDescription(`You fished and pulled out ${choseItem.ItemName}!`)
                                    .setFooter({ text: `Get Lucky by Bun Bot` })
                                    .setTimestamp()
                            ]
                        });


                    } else if ([ newspaper, metalCan, nothing ].includes(choseItem)) {

                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(colorData.Color || color)
                                    .setTitle("Fish")
                                    .setDescription(`You fished and pulled out ${choseItem.ItemName}!`)
                                    .setFooter({ text: `Get Lucky by Bun Bot` })
                                    .setTimestamp()
                            ]
                        });

                    }

                }

            }

                break;

            case "hunt": {

                const cooldown = cooldowns.get(`${member.id}, hunt`);
                const duck = {
                    ItemName: `duck 🦆`,
                    ItemPrice: 5,
                    ItemRole: "",
                    ItemDescription: "duck from a lake",
                };
                const turkey = {
                    ItemName: `turkey 🦃`,
                    ItemPrice: 10,
                    ItemRole: "",
                    ItemDescription: "turkey from the woods",
                };
                const deer = {
                    ItemName: `deer 🦌`,
                    ItemPrice: 15,
                    ItemRole: "",
                    ItemDescription: "deer from the woods",
                };
                const cloud = {
                    ItemName: `cloud ☁️`,
                    ItemPrice: 0,
                    ItemRole: "",
                    ItemDescription: "cloud, oops better get your eyes checked x3",
                };
                const balloon = {
                    ItemName: `balloon 🎈`,
                    ItemPrice: 0,
                    ItemRole: "",
                    ItemDescription: "balloon, you just made a child very sad ;-;"
                };
                const air = {
                    ItemName: `air 😔`,
                    ItemPrice: 0,
                    ItemRole: "",
                    ItemDescription: "literally nothing",
                };
                const items = [ duck, turkey, deer, cloud, balloon, air ];
                const randItem = Math.floor(Math.random() * items.length);
                const choseItem = items[ randItem ];

                if (cooldown) {

                    const timeStamp = humanizeDuration(cooldown - Date.now(), { round: true });
                    interaction.reply({ content: `You are on cooldown, you can use this command again after \`${timeStamp}\`!`, ephemeral: true }).then((message) => {
                        setInterval(() => {
                            const remaining = humanizeDuration(cooldown - Date.now(), { round: true });
                            message.edit({ content: `You are on cooldown, you can use this command again after \`${remaining}\`!`, ephemeral: true });
                        }, 1000);
                    });

                } else {

                    cooldowns.set(`${member.id}, hunt`, Date.now() + 300000);
                    setTimeout(() => {
                        cooldowns.delete(`${member.id}, hunt`);
                    }, 300000);

                    if ([ duck, turkey, deer ].includes(choseItem)) {

                        const data = await EconomyDB.findOne({ Guild: guild.id, User: member.id }).catch(err => console.error(err));

                        if (!data.Inventory) {

                            data.Inventory = [ choseItem ];
                            await data.save();

                        } else {

                            data.Inventory.push(choseItem);
                            await data.save();

                        }

                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(colorData.Color || color)
                                    .setTitle("Hunt")
                                    .setDescription(`You hunt and shot ${choseItem.ItemName}!`)
                                    .setFooter({ text: `Get Lucky by Bun Bot` })
                                    .setTimestamp()
                            ]
                        });

                    } else if ([ cloud, balloon, air ].includes(choseItem)) {

                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(colorData.Color || color)
                                    .setTitle("Hunt")
                                    .setDescription(`You hunt and shot ${choseItem.ItemName}!`)
                                    .setFooter({ text: `Get Lucky by Bun Bot` })
                                    .setTimestamp()
                            ]
                        });

                    }

                }

            }

                break;

            case "beg": {

                const cooldown = cooldowns.get(`${member.id}, beg`);
                const coins = [ 0, 1, 2, 3, 4, 5 ];
                const randItem = Math.floor(Math.random() * coins.length);
                const choseItem = coins[ randItem ];

                if (cooldown) {

                    const timeStamp = humanizeDuration(cooldown - Date.now(), { round: true });
                    interaction.reply({ content: `You are on cooldown, you can use this command again after \`${timeStamp}\`!`, ephemeral: true }).then((message) => {
                        setInterval(() => {
                            const remaining = humanizeDuration(cooldown - Date.now(), { round: true });
                            message.edit({ content: `You are on cooldown, you can use this command again after \`${remaining}\`!`, ephemeral: true });
                        }, 1000);
                    });

                } else {

                    cooldowns.set(`${member.id}, beg`, Date.now() + 300000);
                    setTimeout(() => {
                        cooldowns.delete(`${member.id}, beg`);
                    }, 300000);

                    if ([ coins[ 0 ], coins[ 1 ], coins[ 2 ], coins[ 3 ], coins[ 4 ] ].includes(choseItem)) {

                        const data = await EconomyDB.findOne({ Guild: guild.id, User: member.id }).catch(err => console.error(err));

                        if (!data.Balance) {

                            data.Balance = choseItem;
                            await data.save();

                        } else {

                            data.Balance = data.Balance + choseItem;
                            await data.save();

                        }

                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(colorData.Color || color)
                                    .setTitle("Beg")
                                    .setDescription(`You beg and are given ${choseItem} 🪙's!`)
                                    .setFooter({ text: `Get Lucky by Bun Bot` })
                                    .setTimestamp()
                            ]
                        });

                    }

                }

            }

                break;

        }

    }

};
