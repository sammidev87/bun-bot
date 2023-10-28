const { EmbedBuilder, Events } = require("discord.js");
const boostDB = require("../../schemas/boostDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    name: Events.GuildMemberUpdate,

    async execute(oldMember, newMember, client) {

        const { guild } = newMember;
        const { color, channels } = client;
        if (!guild) return;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        const data = await boostDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        if (!data) return;
        if (![ data.Guild ].includes(guild.id)) return;
        if (!data.Channel) return;

        const Channel = channels.cache.get(data.Channel);

        if (!oldMember.premiumSince && newMember.premiumSince) {

            Channel.send({
                content: `<@${newMember.id}>`,
                embeds: [
                    new EmbedBuilder()
                        .setColor(embedColor)
                        .setTitle("New Booster")
                        .setDescription(`Thank you <@${newMember.id}> for boosting!!! We are up to ${guild.premiumSubscriptionCount} boosts!!! You get some awesome rewards for doing so!!! You will receive a custom role, as well as a custom chat room!!! Please <#1037971276272242688> and let us know what you would like for your role name, color (in hex), and emoji (Must be from this server). We will also need to know what you want the name of your Custom Chat Room to be!!`)
                        .setImage(`https://ucarecdn.com/b8f01ed8-11c0-48b3-83c5-3dec4734adc4/b1e248b66c17a7da87cdf29e24b38e34.jpg`)
                        .setFooter({ text: "Boosts by Bun Bot" })
                        .setTimestamp()
                ]
            });

        }

    }
};