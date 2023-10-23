const { Client, Message, EmbedBuilder, Events } = require("discord.js");
const LevelsChannelDB = require("../../schemas/levelsChannelDB");
const LevelsDB = require("../../schemas/levelsDB");
const EconomyDB = require("../../schemas/economyDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    name: Events.MessageCreate,

    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    async execute(message, client) {

        const { author, guild } = message;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));

        //Levels
        if (!guild || author.bot) return;

        LevelsDB.findOne({ Guild: guild.id, User: author.id }).then((data) => {
            if (!data) {

                LevelsDB.create({
                    Guild: guild.id,
                    User: author.id,
                    XP: 0,
                    Level: 0,
                });

            }
        }).catch(err => console.error(err));

        EconomyDB.findOne({ Guild: guild.id, User: author.id }).then((data) => {
            if (!data) {

                EconomyDB.create({
                    Guild: guild.id,
                    User: author.id,
                    Balance: 0,
                    Inventory: [],
                });

            }
        }).catch(err => console.error(err));

        const channelData = await LevelsChannelDB.findOne({ Guild: guild.id }).catch(err => console.error(err));

        const give = 20;

        const data = await LevelsDB.findOne({ Guild: guild.id, User: author.id }).catch(err => console.error(err));
        if (!data) return;

        const requiredXP = data.Level * data.Level * 100 + 100;

        if (data.XP + give >= requiredXP) {

            const econData = await EconomyDB.findOne({ Guild: guild.id, User: author.id }).catch(err => console.error(err));
            if (!econData) return;

            data.XP += give;
            data.Level += 1;
            await data.save();

            econData.Balance = econData.Balance += data.Level;
            await econData.save();

            if (data.Level === 5) {

                if (channelData) {

                    if (guild.id === "1037958833529696276") {
                        let role = guild.roles.cache.get("1150164801918615723");
                        let member = guild.members.cache.get(author.id);
                        member.roles.add(role);
                    }

                    const Channel = guild.channels.cache.get(channelData.Channel);
                    if (!Channel) return;

                    Channel.send({

                        content: `${author}`,
                        embeds: [
                            new EmbedBuilder()
                                .setColor(colorData.Color || color)
                                .setTitle("Level Up!")
                                .setDescription(`🎉Looks like ${author} is moving up!🎉\n\n🥳Congrats you've reached level ${data.Level}!🥳\n\n🎀Keep up the good work!🎀`)
                                .setFooter({ text: "Leveling System by Bun Bot" })
                                .setTimestamp()
                        ]

                    });

                }

            } else if (channelData) {

                const Channel = guild.channels.cache.get(channelData.Channel);
                if (!Channel) return;

                Channel.send({

                    content: `${author}`,
                    embeds: [
                        new EmbedBuilder()
                            .setColor(colorData.Color || color)
                            .setTitle("Level Up!")
                            .setDescription(`🎉Looks like ${author} is moving up!🎉\n\n🥳Congrats you've reached level ${data.Level}!🥳\n\n🎀Keep up the good work!🎀`)
                            .setFooter({ text: "Leveling System by Bun Bot" })
                            .setTimestamp()
                    ]

                });



            }

        } else {

            data.XP += give;
            await data.save();
        }

    }

};