const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ReactionRolesDB = require("../../schemas/reactionRolesDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reaction-roles")
        .setDescription("Reaction role message.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand(sub => sub.setName("add-panel")
            .setDescription("Create a new panel.")
            .addStringOption(opt => opt.setName("panel").setDescription("Name of your new panel.").setRequired(true)))
        .addSubcommand(sub => sub.setName("add-role")
            .setDescription("Add a custom role.")
            .addStringOption(opt => opt.setName("panel").setDescription("Name of your panel.").setRequired(true))
            .addRoleOption(opt => opt.setName("role").setDescription("Role you want added.").setRequired(true))
            .addStringOption(opt => opt.setName("emoji").setDescription("Emoji for the role.").setRequired(true)))
        .addSubcommand(sub => sub.setName("remove-role")
            .setDescription("Remove requested custom role.")
            .addStringOption(opt => opt.setName("panel").setDescription("Name of the panel that holds the role you want to remove.").setRequired(true))
            .addRoleOption(opt => opt.setName("role").setDescription("Role you want removed.").setRequired(true)))
        .addSubcommand(sub => sub.setName("send-panel")
            .setDescription("Sends reaction role panel.")
            .addStringOption(opt => opt.setName("panel").setDescription("Name of the panel you would like to send.").setRequired(true))
            .addChannelOption(opt => opt.setName("channel").setDescription("Channel you want the panel sent to.").setRequired(false))),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, guild, member, channel } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        switch (options.getSubcommand()) {

            case "add-panel": {

                const panel = options.getString("panel");

                let data = await ReactionRolesDB.findOne({ Guild: guild.id, Panel: panel }).catch(err => console.error(err));

                if (!data) {

                    data = new ReactionRolesDB({
                        Guild: guild.id,
                        Panel: `${panel}`,
                    });

                    await data.save();

                    interaction.reply({ content: `Your panel \`${panel}\` has been successfully saved!`, ephemeral: true });

                } else {

                    interaction.reply({ content: `You already have a panel by that name!`, ephemeral: true });

                }

            }

                break;

            case "add-role": {

                const panel = options.getString("panel");
                const role = options.getRole("role");
                const emoji = options.getString("emoji");

                try {

                    if (role.position >= member.roles.highest) return interaction.reply({ content: `I don't have the required permissions for that!`, ephemeral: true });

                    let data = await ReactionRolesDB.findOne({ Guild: guild.id, Panel: `${panel}` }).catch(err => console.error(err));

                    const newRole = {
                        roleId: role.id,
                        roleEmoji: emoji
                    };

                    if (data) {
                        let roleData = data.Roles.find((x => x.roleId === role.id));

                        if (roleData) {
                            roleData = newRole;
                        } else {
                            data.Roles = [ ...data.Roles, newRole ];
                        }

                        await data.save();

                        return interaction.reply({ content: `New reaction role \`${role.name}\` created.`, ephemeral: true });

                    } else {

                        interaction.reply({ content: `You do not have a panel by that name set up yet! Use \`/reaction-roles add-panel to create one.`, ephemeral: true });

                    }

                } catch (error) {
                    console.log(error);
                }

            }

                break;

            case "remove-role": {

                const panel = options.getString("panel");
                const role = options.getRole("role");

                try {

                    const data = await ReactionRolesDB.findOne({ Guild: guild.id, Panel: `${panel}` }).catch(err => console.error(err));

                    if (!data) return interaction.reply({ content: `This panel does not have reaction roles yet, or you haven't set up any reaction roles yet!`, ephemeral: true });

                    const roles = data.Roles;
                    const findRole = roles.find((r) => r.roleId === role.id);

                    if (!findRole) return interaction.reply({ content: `This role does not exist!`, ephemeral: true });

                    const filteredRoles = roles.filter((r) => r.roleId !== role.id);
                    data.Roles = filteredRoles;

                    await data.save();

                    return interaction.reply({ content: `Removed reaction role successfully!`, ephemeral: true });

                } catch (error) {
                    console.log(error);
                }


            }

                break;

            case "send-panel": {

                try {
                    const panel = options.getString("panel");
                    const Channel = options.getChannel("channel") || channel;
                    const data = await ReactionRolesDB.findOne({ Guild: guild.id, Panel: `${panel}` }).catch(err => console.error(err));
                    if (!data) return interaction.reply({ content: `There is no data for that panel!`, ephemeral: true });
                    if (data.Roles.length <= 0) return interaction.reply({ content: `This panel does not have any reaction roles yet!`, ephemeral: true });
                    const roleOptions = data.Roles.map(x => {
                        const role = guild.roles.cache.get(x.roleId);

                        return {
                            role: role,
                            label: role.name,
                            value: role.id,
                            description: x.roleDescription,
                            emoji: x.roleEmoji,
                        };
                    });
                    const roleAndEmoji = [];
                    roleOptions.forEach((roleOption) => {
                        const info = `Role: ${roleOption.role} Emoji: ${roleOption.emoji}`;
                        roleAndEmoji.push(info);
                    });

                    const panelEmbed = new EmbedBuilder()
                        .setColor(embedColor)
                        .setTitle(`${panel}`)
                        .setDescription(`React with the corresponding emoji to recieve the role you want.\n\n${roleAndEmoji.join(` \n`)}`)
                        .setFooter({ text: "Reaction Roles by Bun Bot" })
                        .setTimestamp();

                    Channel.send({ embeds: [ panelEmbed ] }).then(async (msg) => {
                        roleOptions.forEach((roleOption) => {
                            msg.react(roleOption.emoji).catch(err => console.error(err));
                        });
                        data.MessageId = msg.id;
                        await data.save();
                    });

                    return interaction.reply({ content: `Your panel has been sent successfully!`, ephemeral: true });

                } catch (error) {
                    console.log(error);
                }

            }

        }

    }

};