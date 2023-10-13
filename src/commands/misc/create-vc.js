const { Client, ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-vc")
        .setDescription("Customize your channel.")
        .addSubcommand(sub => sub.setName("name")
            .setDescription("What you want your channel name to be.")
            .addStringOption(opt => opt.setName("name").setDescription("The name you want your channel to be.").setRequired(true)))
        .addSubcommand(sub => sub.setName("private")
            .setDescription("Set your channel to only allow invited members.")
            .addBooleanOption(opt => opt.setName("invite-only").setDescription("If you want your channel to be private or not.").setRequired(true)))
        .addSubcommand(sub => sub.setName("invite")
            .setDescription("Member you want to invite to your channel.")
            .addUserOption(opt => opt.setName("member").setDescription("Member you want to invite to your channel.").setRequired(true))),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, member, guild } = interaction;
        const { voiceCollection } = client;
        const voiceChannel = member.voice.channel;
        if (!voiceChannel) return interaction.reply({ content: `You must be in a vc first!`, ephemeral: true });
        const ownedChannelId = voiceCollection.get(member.id);
        const ownedChannel = guild.channels.cache.get(ownedChannelId);
        const ownedTextChannelId = voiceCollection.get(member.user.username);
        const ownedTextChannel = guild.channels.cache.get(ownedTextChannelId);
        if (!ownedChannelId || voiceChannel.id !== ownedChannelId) return interaction.reply({ content: `You are not the owner of this vc!`, ephemeral: true });


        switch (options.getSubcommand()) {

            case "name": {

                const name = options.getString("name");
                if (name.length > 22 || name.length < 1) return interaction.reply({ content: `The name cannot exceed the 22 character limit!`, ephemeral: true });
                ownedChannel.setName(name);
                ownedTextChannel.setName(name);
                return interaction.reply({ content: `Your Channel names have been changed!`, ephemeral: true });

            }

                break;

            case "private": {

                const private = options.getBoolean("invite-only");

                if (private === true) {
                    ownedChannel.edit({
                        permissionOverwrites: [
                            {
                                id: member.id,
                                allow: [ "Connect", "ManageChannels" ],
                            },
                            {
                                id: guild.id,
                                deny: [ "Connect" ],
                            },
                        ]
                    });
                    ownedTextChannel.edit({
                        permissionOverwrites: [
                            {
                                id: member.id,
                                allow: [ "SendMessages", "EmbedLinks", "UseExternalEmojis", "AttachFiles", "UseApplicationCommands", "AddReactions", "ViewChannel" ],
                            },
                            {
                                id: guild.id,
                                deny: [ "ViewChannel" ],
                            },
                        ]
                    });
                } else if (private === false) {
                    ownedChannel.edit({
                        permissionOverwrites: [
                            {
                                id: member.id,
                                allow: [ "Connect", "ManageChannels" ],
                            },
                            {
                                id: guild.id,
                                allow: [ "Connect" ],
                            },
                        ]
                    });
                    ownedTextChannel.edit({
                        permissionOverwrites: [
                            {
                                id: member.id,
                                allow: [ "SendMessages", "EmbedLinks", "UseExternalEmojis", "AttachFiles", "UseApplicationCommands", "AddReactions", "ViewChannel" ],
                            },
                            {
                                id: guild.id,
                                allow: [ "SendMessages", "EmbedLinks", "UseExternalEmojis", "AttachFiles", "UseApplicationCommands", "AddReactions", "ViewChannel" ],
                            },
                        ]
                    });
                }

                return interaction.reply({ content: `Your changes have been saved!`, ephemeral: true });

            }

                break;

            case "invite": {

                const targetMember = options.getUser("member");
                ownedChannel.permissionOverwrites.edit(targetMember, { Connect: true });
                ownedTextChannel.permissionOverwrites.edit(targetMember, { ViewChannel: true, SendMessages: true, EmbedLinks: true, UseExternalEmojis: true, AttachFiles: true, UseApplicationCommands: true, AddReactions: true });
                return interaction.reply({ content: `${member} has invited ${targetMember} to <#${ownedChannel.id}>`, ephemeral: false });

            }

        }

    }
};