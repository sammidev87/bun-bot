const { Client, GuildMember, EmbedBuilder, Events } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    name: Events.GuildMemberAdd,

    /**
     * 
     * @param { GuildMember } member 
     * @param { Client } client 
     */
    async execute(member, client) {

        const { guild } = member;
        const { emojilist, color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        if (guild.id === `1037958833529696276`) {

            const role = guild.roles.cache.get(`1037966143081697382`);
            member.roles.add(role);

            const Channel = guild.channels.cache.get("1041165186930835506");

            const Embed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
                .setDescription(`Welcome ${member} to Kawaii Daycare 18+!\n\nWe hope you enjoy your stay here. There are a few things you need to do before you can access the rest of the server. Head over to <#1037959716946591814> read the rules and then head over to <#1110374683834073140> follow the directions given to get verified.\n\nWe accept cross verification with these servers:\nSherwood Forest(18+)\nGothic Gardens\nYin Yang\nAstro\n\nWe hope you enjoy your stay!\n\nAccount Created: <t:${parseInt(member.user.createdTimestamp / 1000)}:R>\nMemberCount: \`${guild.memberCount}\``)
                .setThumbnail(`${member.user.displayAvatarURL()}`)
                .setImage(`https://ucarecdn.com/d06d1f51-5850-49f1-89d2-2346ce19d17e/78080b5ee476d374d3a7b40b1aa463b7.jpg`)
                .setFooter({ text: "Welcome by Bun Bot" })
                .setTimestamp();

            Channel.send({ content: `Welcome <@${member.id}>! ${emojilist.tick}`, embeds: [ Embed ] });

        } else if (guild.id === `1070558674210267207`) {

            const role = guild.roles.cache.get(`1083991702311809054`);
            member.roles.add(role);

            const Channel = guild.channels.cache.get("1070558675271438427");

            const Embed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
                .setDescription(`Hello ${member}, welcome to 𝔊𝔬𝔱𝔥𝔦𝔠 𝔤𝔞𝔯𝔡𝔢𝔫𝔰….. wander our maze of flowers and vines to find your peace.\n\nAccount Created: <t:${parseInt(member.user.createdTimestamp / 1000)}:R>\nMemberCount: \`${guild.memberCount}\``)
                .setThumbnail(`${member.user.displayAvatarURL()}`)
                .setFooter({ text: "Someone has wandered through our gates….." })
                .setTimestamp();

            Channel.send({ content: `Welcome <@${member.id}>! ${emojilist.tick}`, embeds: [ Embed ] });

            const Channels = [ `1151994814716465242` ];

            Channels.forEach(async chan => {
                const PingChannel = guild.channels.cache.get(`${chan}`);
                PingChannel.send({ content: `<@${member.id}>` }).then(msg => msg.delete(10000));
            });

        } else {

            return;

        }

    }

};