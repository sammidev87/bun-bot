const { Client, ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, PermissionFlagsBits, Guild } = require("discord.js");
const ConfessionDB = require("../../schemas/confessionDB");
const CreateVCDB = require("../../schemas/createVCDB");
const LevelsChannelDB = require("../../schemas/levelsChannelDB");
const QotdDB = require("../../schemas/qotdDB");
const SafeWordDB = require("../../schemas/safeWordDB");
const bumpDB = require("../../schemas/bumpDB");
const boostDB = require("../../schemas/boostDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-up")
        .setDescription("Set up bot features/Command channels.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub => sub.setName("confession")
            .setDescription("Set up your confession command needs.")
            .addChannelOption(opt => opt.setName("channel").setDescription("Channel you want the confessions to be sent in.").setRequired(true).addChannelTypes(ChannelType.GuildText))
            .addChannelOption(opt => opt.setName("log-channel").setDescription("Channel you would like the confession logs to be sent in.").setRequired(true).addChannelTypes(ChannelType.GuildText)))
        .addSubcommand(sub => sub.setName("create-vc")
            .setDescription("Set up your create-vc command needs.")
            .addChannelOption(opt => opt.setName("channel").setDescription("Channel you want the create vc to be. (MUST BE A VC CHANNEL)").setRequired(true).addChannelTypes(ChannelType.GuildVoice))
            .addStringOption(opt => opt.setName("name").setDescription("What you want your create VC channel to be named.").setRequired(true)))
        .addSubcommand(sub => sub.setName("levels")
            .setDescription("Set up your levels command needs.")
            .addChannelOption(opt => opt.setName("channel").setDescription("Channel you want the leveling updates to be in.").setRequired(true).addChannelTypes(ChannelType.GuildText)))
        .addSubcommand(sub => sub.setName("qotd")
            .setDescription("Set up your qotd command needs.")
            .addChannelOption(opt => opt.setName("channel").setDescription("Channel you want the qotd to be sent in.").setRequired(true).addChannelTypes(ChannelType.GuildText))
            .addRoleOption(opt => opt.setName("role").setDescription("Role you want pinged when qotd is sent.").setRequired(true)))
        .addSubcommand(sub => sub.setName("safe-word")
            .setDescription("Set up your safe-word command needs.")
            .addStringOption(opt => opt.setName("safeword").setDescription("The word you want to use for the safeword.").setRequired(true))
            .addRoleOption(opt => opt.setName("role").setDescription("Role you want pinged when the safe word is used.").setRequired(true)))
        .addSubcommand(sub => sub.setName("bump-buddy")
            .setDescription("Turn bump buddy on or off.")
            .addBooleanOption(opt => opt.setName("set").setDescription("Set bump buddy to on or off").setRequired(true)))
        .addSubcommand(sub => sub.setName("boost")
            .setDescription("Set up boost message")
            .addChannelOption(opt => opt.setName("channel").setDescription("Channel you want your boost message sent to.").setRequired(true)))
        .addSubcommand(sub => sub.setName("color")
            .setDescription("Set embed color")
            .addStringOption(opt => opt.setName("color").setDescription("Set embed color, MUST BE IN HEX FORMAT").setRequired(true))),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, guild } = interaction;

        switch (options.getSubcommand()) {

            case "confession": {

                const channel = options.getChannel("channel");
                const logChannel = options.getChannel("log-channel");

                let data = await ConfessionDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (data) {

                    if (logChannel) {

                        data.Channel = channel.id;
                        data.LogChannel = logChannel.id;
                        data.save();

                    } else {

                        data.Channel = channel.id;
                        data.save();

                    }

                } else if (!data) {

                    if (logChannel) {

                        data = new ConfessionDB({
                            Guild: guild.id,
                            Channel: channel.id,
                            LogChannel: logChannel.id,
                            Count: 0,
                        });

                        await data.save();

                    } else {

                        data = new ConfessionDB({
                            Guild: guild.id,
                            Channel: channel.id,
                            Count: 0,
                        });

                        await data.save();

                    }

                }

                interaction.reply({ content: `Your confession setup info has been saved!`, ephemeral: true });

            }

                break;

            case "create-vc": {

                const channel = options.getChannel("channel");
                const name = options.getString("name");

                let data = await CreateVCDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (data) {

                    data.Channel = channel.id;
                    data.ChannelName = name;
                    data.save();

                } else if (!data) {

                    data = new CreateVCDB({
                        Guild: guild.id,
                        Channel: channel.id,
                        ChannelName: name,
                    });

                    await data.save();

                }

                channel.setName(data.ChannelName);

                interaction.reply({ content: `Your create a vc setup info has been saved!`, ephemeral: true });

            }

                break;

            case "levels": {

                const channel = options.getChannel("channel");

                let data = await LevelsChannelDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (data) {

                    data.Channel = channel.id;
                    data.save();

                } else if (!data) {

                    data = new LevelsChannelDB({
                        Guild: guild.id,
                        Channel: channel.id,
                    });

                    await data.save();

                }

                interaction.reply({ content: `Your levels setup info has been saved!`, ephemeral: true });

            }

                break;

            case "qotd": {

                const channel = options.getChannel("channel");
                const role = options.getRole("role");

                let data = await QotdDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (data) {

                    data.Channel = channel.id;
                    data.Role = role;
                    data.save();

                } else if (!data) {

                    data = new QotdDB({
                        Guild: guild.id,
                        Channel: channel.id,
                        Role: role,
                        Count: 0,
                    });

                    await data.save();

                }

                interaction.reply({ content: `Your qotd setup info has been saved!`, ephemeral: true });

            }

                break;

            case "safe-word": {

                const safeword = options.getString("safeword");
                const role = options.getRole("role");

                let data = await SafeWordDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (data) {

                    data.SafeWord = safeword;
                    data.Role = role;
                    data.save();

                } else if (!data) {

                    data = new SafeWordDB({
                        Guild: guild.id,
                        Role: role,
                        SafeWord: safeword,
                    });

                    await data.save();

                }

                interaction.reply({ content: `Your safe word setup info has been saved!`, ephemeral: true });

            }

                break;

            case "bump-buddy": {

                const data = await bumpDB.findOne({ Guild: guild.id }).catch(err => console.error(err));

                switch (options.getBoolean("set")) {

                    case true: {

                        if (!data) {

                            bumpDB.create({
                                Guild: guild.id
                            });

                        } else if (data) {

                            data.Guild = guild.id;

                        }
                        await data.save();

                        interaction.reply({ content: `You have successfully set up bump buddy!`, ephemeral: true });

                    }

                        break;

                    case false: {

                        if (!data) {

                            interaction.reply({ content: `You already have bump buddy set to off!`, ephemeral: true });

                        } else if (data) {

                            data.findOneAndDelete({ Guild: guild.id }).catch(err => console.error(err));

                            interaction.reply({ content: `You have successfully turned off bump buddy!`, ephemeral: true });

                        }

                    }

                }

            }

                break;

            case "boost": {

                const channel = options.getChannel("channel");
                let data = await boostDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (!data) {

                    boostDB.create({
                        Guild: guild.id,
                        Channel: channel.id,
                    });

                } else if (data) {

                    data.Channel = channel.id;

                }
                await data.save();

                interaction.reply({ content: `You have successfully saved your boost channel!`, ephemeral: true });

            }

                break;

            case "color": {

                const color = options.getString("color");
    
                let data = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
                if (data) {
    
                    data.Color = color;
                    data.save();
    
                } else if (!data) {
    
                    data = new colorDB({
                        Guild: guild.id,
                        Color: color,
                    });
    
                    await data.save();
    
                }
    
                interaction.reply({ content: `Your embed color setup info has been saved!`, ephemeral: true });
    
            }
    
                break;

        }

    }
};