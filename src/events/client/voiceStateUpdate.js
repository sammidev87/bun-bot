const { Client, VoiceState, Events, ChannelType } = require("discord.js");
const CreateVCDB = require("../../schemas/createVCDB");

module.exports = {
    name: Events.VoiceStateUpdate,

    /**
     * 
     * @param { VoiceState } oldState
     * @param { VoiceState } newState
     * @param { Client } client 
     */
    async execute(oldState, newState, client) {

        const { member, guild } = newState;
        const { voiceCollection } = client;
        const data = await CreateVCDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        if (!data) return;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;
        const joinToCreate = data.Channel;

        if (oldChannel !== newChannel && newChannel && newChannel.id === joinToCreate) {

            const voiceChannel = await guild.channels.create({
                name: `${member.user.username}`,
                type: ChannelType.GuildVoice,
                parent: newChannel.parent,
                permissionOverwrites: [
                    {
                        id: member.id,
                        allow: [ "Connect", "ManageChannels" ],
                    },
                    {
                        id: guild.id,
                        allow: [ "Connect" ],
                    },
                ],
            });

            const textChannel = await guild.channels.create({
                name: `${member.user.username}`,
                type: ChannelType.GuildText,
                parent: newChannel.parent,
                permissionOverwrites: [
                    {
                        id: member.id,
                        allow: [ "SendMessages", "EmbedLinks", "UseExternalEmojis", "AttachFiles", "UseApplicationCommands", "AddReactions", "ViewChannel" ]
                    },
                    {
                        id: guild.id,
                        allow: [ "SendMessages", "EmbedLinks", "UseExternalEmojis", "AttachFiles", "UseApplicationCommands", "AddReactions", "ViewChannel" ]
                    },
                ],
            });

            voiceCollection.set(member.id, voiceChannel.id);
            voiceCollection.set(member.user.username, textChannel.id);
            await newChannel.permissionOverwrites.edit(member, { Connect: false });
            setTimeout(() => {
                newChannel.permissionOverwrites.delete(member);
            }, 30 * 1000);

            return setTimeout(() => {
                member.voice.setChannel(voiceChannel);
            }, 500);

        }

        const ownedChannelId = voiceCollection.get(member.id);
        const ownedTextChannelId = voiceCollection.get(member.user.username);
        const ownedChannel = guild.channels.cache.get(ownedChannelId);
        const ownedTextChannel = guild.channels.cache.get(ownedTextChannelId);

        if (ownedChannelId && oldChannel.id === ownedChannelId && (!newChannel || newChannel.id !== ownedChannelId)) {
            ownedChannel.delete().catch(err => console.error(err));
            ownedTextChannel.delete().catch(err => console.error(err));
            voiceCollection.set(member.id, null);
            voiceCollection.set(member.user.username, null);
        }

    }
};