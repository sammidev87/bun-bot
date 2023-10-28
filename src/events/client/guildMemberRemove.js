const { Client, GuildMember, EmbedBuilder, Events } = require("discord.js");
const charactersDB = require("../../schemas/charactersDB");
const economyDB = require("../../schemas/economyDB");
const warnDB = require("../../schemas/warnDB");
const LevelsDB = require("../../schemas/levelsDB");
const EconomyDB = require("../../schemas/economyDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    name: Events.GuildMemberRemove,

    /**
     * 
     * @param { GuildMember } member 
     * @param { Client } client 
     */
    async execute(member, client) {

        const { guild } = member;
        const { emojilist, color, user } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        if (guild.id === `1037958833529696276`) {

            const Channel = guild.channels.cache.get("1037998115510288384");

            await EconomyDB.findOneAndDelete({ Guild: guild.id, User: member.id }).catch(err => console.error(err));
            await LevelsDB.findOneAndDelete({ Guild: guild.id, User: member.id }).catch(err => console.error(err));
            await charactersDB.findOneAndDelete({ GuildID: guild.id, MemberID: member.id }).catch(err => console.error(err));
            await economyDB.findOneAndDelete({ Guild: guild.id, User: member.id }).catch(err => console.error(err));
            await warnDB.findOneAndDelete({ Guild: guild.id, Member: member.id }).catch(err => console.error(err));

            const Embed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
                .setTitle("Member Left")
                .setDescription(`${member} has left the server!\n\nAccount Created: <t:${parseInt(member.user.createdTimestamp / 1000)}:R>\nMemberCount: \`${guild.memberCount}\``)
                .setThumbnail(`${member.user.displayAvatarURL()}`)
                .setFooter({ text: "Goodbye by Bun Bot" })
                .setTimestamp();

            Channel.send({ content: `Goodbye <@${member.id}>! ${emojilist.cross}`, embeds: [ Embed ] });

        } else if (guild.id === `1070558674210267207`) {

            const Channel = guild.channels.cache.get("1070558675271438427");

            await EconomyDB.findOneAndDelete({ Guild: guild.id, User: member.id }).catch(err => console.error(err));
            await LevelsDB.findOneAndDelete({ Guild: guild.id, User: member.id }).catch(err => console.error(err));
            await charactersDB.findOneAndDelete({ GuildID: guild.id, MemberID: member.id }).catch(err => console.error(err));
            await economyDB.findOneAndDelete({ Guild: guild.id, User: member.id }).catch(err => console.error(err));
            await warnDB.findOneAndDelete({ Guild: guild.id, Member: member.id }).catch(err => console.error(err));

            const Embed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
                .setTitle(`${member.user.username} Left`)
                .setDescription(`${member} has left the server!\n\nAccount Created: <t:${parseInt(member.user.createdTimestamp / 1000)}:R>\nMemberCount: \`${guild.memberCount}\``)
                .setThumbnail(`${member.user.displayAvatarURL()}`)
                .setFooter({ text: "Goodbye by Bun Bot" })
                .setTimestamp();

            Channel.send({ content: `Goodbye <@${member.id}>! ${emojilist.cross}`, embeds: [ Embed ] });

        } else {

            return;

        }

    }

};