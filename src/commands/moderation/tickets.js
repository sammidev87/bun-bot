const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Ticket commands.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub => sub.setName("embed")
            .setDescription("The embed used to create tickets.")
            .addStringOption(opt => opt.setName("title").setDescription("The title of the embed.").setRequired(true))
            .addStringOption(opt => opt.setName("description").setDescription("The description of the embed.").setRequired(true))
            .addChannelOption(opt => opt.setName("channel").setDescription("Channel you want the embed sent to. (sends to this channel otherwise)").setRequired(false)))
        .addSubcommand(sub => sub.setName("add")
            .setDescription("Add a user to the ticket")
            .addUserOption(opt => opt.setName("member").setDescription("Member you want to add to the ticket.").setRequired(true))),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, guild, channel, member } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        switch (options.getSubcommand()) {

            case "embed": {

                var Channel = options.getChannel("channel") || channel;
                const title = options.getString("title");
                const desc = options.getString("description");

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                    .setColor(embedColor)
                    .setTitle(`${title}`)
                    .setDescription(`${desc}`)
                    .setFooter({ text: "Ticket System by Bun Bot" })
                    .setTimestamp();

                const Buttons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("open")
                        .setLabel("Open Ticket")
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("🎟️")
                );

                Channel.send({ embeds: [ Embed ], components: [ Buttons ] });

                return interaction.reply({ content: `Your ticket system has been set up!`, ephemeral: true });

            }

                break;

            case "add": {

                const user = options.getUser("member");
                const userOverwrites = {
                    id: user.id,
                    allow: [ "SendMessages", "EmbedLinks", "UseExternalEmojis", "AttachFiles", "UseApplicationCommands", "AddReactions", "ViewChannel" ],
                };
                const guildOverwrites = {
                    id: guild.id,
                    deny: [ "ViewChannel" ],
                };
                const memberIds = [];
                channel.members.forEach(member => {
                    const memberOverwrites = {
                        id: member.id,
                        allow: [ "SendMessages", "EmbedLinks", "UseExternalEmojis", "AttachFiles", "UseApplicationCommands", "AddReactions", "ViewChannel" ],
                    };
                    memberIds.push(memberOverwrites);
                });
                memberIds.push(guildOverwrites);
                memberIds.push(userOverwrites);

                channel.edit({
                    permissionOverwrites: memberIds
                });

                interaction.reply({ content: `You have added ${user} to this ticket!`, ephemeral: true });

            }

                break;

        }

    }
};
