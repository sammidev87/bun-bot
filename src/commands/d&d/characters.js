const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const CharactersDB = require("../../schemas/charactersDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("character")
        .setDescription("Character Creation for D&D.")
        .addSubcommand(sub => sub.setName("create")
            .setDescription("Create a character for D&D.")
            .addStringOption(opt => opt.setName("name").setDescription("Name of your character.").setRequired(true))
            .addStringOption(opt => opt.setName("avatar").setDescription("URL of the avatar you want to use.").setRequired(true))
            .addStringOption(opt => opt.setName("proxy").setDescription("Proxy to use your character.").setRequired(true))
            .addStringOption(opt => opt.setName("age").setDescription("Age of your character.").setRequired(false))
            .addStringOption(opt => opt.setName("race").setDescription("Race of your character.").setRequired(false))
            .addStringOption(opt => opt.setName("class").setDescription("Class of your character").setRequired(false))
            .addStringOption(opt => opt.setName("subclass").setDescription("Sub Class of your character if your character has one.").setRequired(false))
            .addStringOption(opt => opt.setName("alignment").setDescription("Alignment of your character.").setRequired(false))
            .addStringOption(opt => opt.setName("pronouns").setDescription("Pronouns of your character.").setRequired(false))
            .addStringOption(opt => opt.setName("birthday").setDescription("Birthday of your character.").setRequired(false))
            .addStringOption(opt => opt.setName("description").setDescription("Description of your character.").setRequired(false)))
        .addSubcommand(sub => sub.setName("delete")
            .setDescription("Delete a character.")
            .addStringOption(opt => opt.setName("name").setDescription("Name of your character.").setRequired(true)))
        .addSubcommand(sub => sub.setName("edit")
            .setDescription("Edit your already created character.")
            .addStringOption(opt => opt.setName("name").setDescription("Name of your character.").setRequired(true))
            .addStringOption(opt => opt.setName("new-name").setDescription("What you want your characters name to change to.").setRequired(false))
            .addStringOption(opt => opt.setName("avatar").setDescription("What you want your characters new avatar to be.").setRequired(false))
            .addStringOption(opt => opt.setName("proxy").setDescription("What you want your characters new proxy to be.").setRequired(false))
            .addStringOption(opt => opt.setName("age").setDescription("Age of your character.").setRequired(false))
            .addStringOption(opt => opt.setName("race").setDescription("Race of your character.").setRequired(false))
            .addStringOption(opt => opt.setName("class").setDescription("Class of your character").setRequired(false))
            .addStringOption(opt => opt.setName("subclass").setDescription("Sub Class of your character if your character has one.").setRequired(false))
            .addStringOption(opt => opt.setName("alignment").setDescription("Alignment of your character.").setRequired(false))
            .addStringOption(opt => opt.setName("pronouns").setDescription("Pronouns of your character.").setRequired(false))
            .addStringOption(opt => opt.setName("birthday").setDescription("Birthday of your character.").setRequired(false))
            .addStringOption(opt => opt.setName("description").setDescription("Description of your character.").setRequired(false)))
        .addSubcommand(sub => sub.setName("send")
            .setDescription("Sends the character info.")
            .addStringOption(opt => opt.setName("name").setDescription("Name of the character.").setRequired(true)))
        .addSubcommand(sub => sub.setName("list")
            .setDescription("Send a list of your characters")),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, guild, member } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));

        switch (options.getSubcommand()) {

            case "create": {

                const name = options.getString("name");
                const avatar = options.getString("avatar");
                const proxy = options.getString("proxy");
                const age = options.getString("age") || null;
                const race = options.getString("race") || null;
                const Class = options.getString("class") || null;
                const subClass = options.getString("subclass") || null;
                const alignment = options.getString("alignment") || null;
                const pronouns = options.getString("pronouns") || null;
                const birthday = options.getString("birthday") || null;
                const description = options.getString("description") || null;

                await CharactersDB.findOne({ GuildID: guild.id, MemberID: member.id, Name: name }).then((data) => {
                    if (!data) {
                        CharactersDB.create({
                            GuildID: guild.id,
                            MemberID: member.id,
                            Name: name,
                            Avatar: avatar,
                            Proxy: proxy,
                            Age: age,
                            Race: race,
                            Class: Class,
                            SubClass: subClass,
                            Alignment: alignment,
                            Pronouns: pronouns,
                            Birthday: birthday,
                            Description: description,
                        });
                    } else {
                        return interaction.reply({ content: `You have already created that character!`, ephemeral: true });
                    }
                }).catch(err => console.error(err));

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(colorData.Color || color)
                            .setTitle(`Character Created!`)
                            .setDescription(`Your character ${name} has been created!`)
                            .setFooter({ text: "Character Creation by Bun Bot" })
                            .setTimestamp()
                    ]
                });

            }

                break;

            case "delete": {

                const name = options.getString("name");

                const data = await CharactersDB.findOne({ GuildID: guild.id, MemberID: member.id, Name: name }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `There is no character by that name!`, ephemeral: true });

                await CharactersDB.findOneAndDelete({ GuildID: guild.id, MemberID: member.id, Name: name }).catch(err => console.error(err));

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(colorData.Color || color)
                            .setTitle(`Character Deleted!`)
                            .setDescription(`Your character ${name} has been deleted!`)
                            .setFooter({ text: "Character Creation by Bun Bot" })
                            .setTimestamp()
                    ]
                });

            }

                break;

            case "edit": {

                const name = options.getString("name");

                const data = await CharactersDB.findOne({ GuildID: guild.id, MemberID: member.id, Name: name }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `There is no character by that name!`, ephemeral: true });

                const newName = options.getString("new-name") || data.Name;
                const avatar = options.getString("avatar") || data.Avatar;
                const proxy = options.getString("proxy") || data.Proxy;
                const age = options.getString("age") || data.Age;
                const race = options.getString("race") || data.Race;
                const Class = options.getString("class") || data.Class;
                const subClass = options.getString("subclass") || data.SubClass;
                const alignment = options.getString("alignment") || data.Alignment;
                const pronouns = options.getString("pronouns") || data.Pronouns;
                const birthday = options.getString("birthday") || data.Birthday;
                const description = options.getString("description") || data.Description;

                data.Name = newName;
                data.Avatar = avatar;
                data.Proxy = proxy;
                data.Age = age;
                data.Race = race;
                data.Class = Class;
                data.SubClass = subClass;
                data.Alignment = alignment;
                data.Pronouns = pronouns;
                data.Birthday = birthday;
                data.Description = description;
                await data.save();

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(colorData.Color || color)
                            .setTitle(`Character Edited!`)
                            .setDescription(`Your character ${name} has been edited!`)
                            .addFields(
                                {
                                    name: `Name:`,
                                    value: `${name}`,
                                    inline: true,
                                },
                                {
                                    name: `Birthday:`,
                                    value: `${birthday}`,
                                    inline: true,
                                },
                                {
                                    name: `Age:`,
                                    value: `${age}`,
                                    inline: true,
                                },
                                {
                                    name: `Pronouns:`,
                                    value: `${pronouns}`,
                                    inline: true,
                                },
                            )
                            .addFields(
                                {
                                    name: `Race:`,
                                    value: `${race}`,
                                    inline: true,
                                },
                                {
                                    name: `Class:`,
                                    value: `${Class}`,
                                    inline: true
                                },
                                {
                                    name: `Sub-Class:`,
                                    value: `${subClass}`,
                                    inline: true,
                                },
                                {
                                    name: `Alignment:`,
                                    value: `${alignment}`,
                                    inline: true
                                },
                            )
                            .addFields(
                                {
                                    name: `Proxy:`,
                                    value: `${proxy}`,
                                    inline: true
                                },
                                {
                                    name: `Description:`,
                                    value: `${description}`,
                                    inline: true
                                },
                            )
                            .setImage(`${data.Avatar}`)
                            .setFooter({ text: "Character Creation by Bun Bot" })
                            .setTimestamp()
                    ]
                });

            }

                break;

            case "send": {

                const name = options.getString("name");

                const data = await CharactersDB.findOne({ GuildID: guild.id, MemberID: member.id, Name: name }).catch(err => console.error(err));
                if (!data) return interaction.reply({ content: `There is no character by that name!`, ephemeral: true });

                const desc = [ `Name: ${data.Name}
                Avatar URL: See below.
                Proxy: \`${data.Proxy}\`
                `];

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(colorData.Color || color)
                            .setTitle(`Character Info`)
                            .setDescription(`Your character ${name} info:`)
                            .addFields(
                                {
                                    name: `Name:`,
                                    value: `${name}`,
                                    inline: true,
                                },
                                {
                                    name: `Birthday:`,
                                    value: `${data.Birthday}`,
                                    inline: true,
                                },
                                {
                                    name: `Age:`,
                                    value: `${data.Age}`,
                                    inline: true,
                                },
                                {
                                    name: `Pronouns:`,
                                    value: `${data.Pronouns}`,
                                    inline: true,
                                },
                            )
                            .addFields(
                                {
                                    name: `Race:`,
                                    value: `${data.Race}`,
                                    inline: true,
                                },
                                {
                                    name: `Class:`,
                                    value: `${data.Class}`,
                                    inline: true
                                },
                                {
                                    name: `Sub-Class:`,
                                    value: `${data.SubClass}`,
                                    inline: true,
                                },
                                {
                                    name: `Alignment:`,
                                    value: `${data.Alignment}`,
                                    inline: true
                                },
                            )
                            .addFields(
                                {
                                    name: `Proxy:`,
                                    value: `${data.Proxy}`,
                                    inline: true
                                },
                                {
                                    name: `Description:`,
                                    value: `${data.Description}`,
                                    inline: true
                                },
                            )
                            .setImage(`${data.Avatar}`)
                            .setFooter({ text: "Character Creation by Bun Bot" })
                            .setTimestamp()
                    ]
                });

            }

                break;

            case "list": {

                const data = await CharactersDB.find({ GuildID: guild.id, MemberID: member.id }).sort({ Name: -1, Avatar: -1, Proxy: -1 }).catch(err => console.error(err));

                const embed = new EmbedBuilder()
                    .setColor(colorData.Color || color)
                    .setTitle("Character List")
                    .setDescription("Here is a list of your current characters in this server:")
                    .setFooter({ text: "Character Creation by Bun Bot" })
                    .setTimestamp();

                await interaction.deferReply();

                for (let counter = 0; counter < data.length; ++counter) {

                    const { Name, Avatar, Proxy = 0 } = data[ counter ];

                    embed.addFields(
                        {
                            name: `**${counter + 1}.** ${Name}`,
                            value: `**Avatar URL:** ${Avatar}\n**Proxy:** ${Proxy}\n`,
                            inline: false,
                        },
                    );

                }

                interaction.editReply({ embeds: [ embed ] });

            }

                break;

        }

    }

};