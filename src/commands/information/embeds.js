const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const EmbedDB = require("../../schemas/embedDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Create a custom embed.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages || PermissionFlagsBits.ManageRoles)
        .addSubcommand(sub => sub.setName("create")
            .setDescription("Create a new embed.")
            .addStringOption(opt => opt.setName("name").setDescription("The name you want your embed saved under.").setRequired(true))
            .addStringOption(opt => opt.setName("title").setDescription("The title of your embed.").setRequired(true))
            .addStringOption(opt => opt.setName("description").setDescription("The description of your embed.").setRequired(true))
            .addStringOption(opt => opt.setName("image").setDescription("Image you want attached. (must be a link)").setRequired(true)))
        .addSubcommand(sub => sub.setName("send")
            .setDescription("Sends the embed requested.")
            .addStringOption(opt => opt.setName("name").setDescription("The name of the embed you want sent.").setRequired(true))
            .addRoleOption(opt => opt.setName("role").setDescription("The role you want pinged. (will not ping if left blank)").setRequired(false))
            .addUserOption(opt => opt.setName("user").setDescription("The user you want pinged. (will not ping if left blank)").setRequired(false)))
        .addSubcommand(sub => sub.setName("list").setDescription("Sends a list of your current saved embeds."))
        .addSubcommand(sub => sub.setName("delete")
            .setDescription("Deletes the requested embed.")
            .addStringOption(opt => opt.setName("name").setDescription("The name of the embed you would like to delete.").setRequired(true)))
        .addSubcommand(sub => sub.setName("one-time")
            .setDescription("Sends a one time embed.")
            .addStringOption(opt => opt.setName("title").setDescription("The title of your embed.").setRequired(true))
            .addStringOption(opt => opt.setName("description").setDescription("The description of your embed.").setRequired(true))
            .addStringOption(opt => opt.setName("image-url").setDescription("URL of the image you want in the embed").setRequired(false))
            .addRoleOption(opt => opt.setName("role").setDescription("The role you want pinged. (will not ping if left blank)").setRequired(false))
            .addUserOption(opt => opt.setName("user").setDescription("The user you want pinged. (will not ping if left blank)").setRequired(false))),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, user, member, guild } = interaction;
        const { color } = client;

        switch (options.getSubcommand()) {

            case "create": {

                const name = options.getString("name");
                const title = options.getString("title");
                const desc = options.getString("description");
                const image = options.getString("image");

                const Data = await EmbedDB.findOne({ Guild: guild.id, Name: name }).catch(err => console.error(err));
                if (!Data) {
                    new EmbedDB({
                        Guild: guild.id,
                        Name: name,
                        Title: title,
                        Description: desc,
                        Image: image,
                    }).save();

                    return interaction.reply({ content: `Your embed has been saved!`, ephemeral: true });
                } else {
                    return interaction.reply({ content: `There is already an embed by that name!`, ephemeral: true });
                }

            }

                break;

            case "send": {

                const name = options.getString("name");

                const Data = await EmbedDB.findOne({ Guild: guild.id, Name: name }).catch(err => console.error(err));
                if (!Data) return interaction.reply({ content: `There is no embed by that name!`, ephemeral: true });

                const title = Data.Title;

                const desc = Data.Description;

                const image = Data.Image;

                const Member = options.getMember("user") || ``;

                var role = options.getRole("role") || ``;

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: member.displayAvatarURL() })
                    .setColor(color)
                    .setTitle(`${title}`)
                    .setDescription(desc)
                    .setImage(image)
                    .setFooter({ text: "Embeds by Bun Bot" })
                    .setTimestamp();

                interaction.reply({ content: `${role}${Member}`, embeds: [ Embed ] });

            }

                break;

            case "list": {

                const Data = await EmbedDB.find({ Guild: guild.id }).catch(err => console.error(err));
                if (!Data) return interaction.reply({ content: `There are no embeds yet!`, ephemeral: true });

                const list = [];
                Data.forEach(data => {
                    list.push(data.Name);
                });

                const filteredList = list.toString().split(`,`).join(`\n`);

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: member.displayAvatarURL() })
                    .setColor(color)
                    .setTitle(`Embed List`)
                    .setDescription(filteredList)
                    .setFooter({ text: "Embeds by Bun Bot" })
                    .setTimestamp();

                interaction.reply({ embeds: [ Embed ] });

            }

                break;

            case "delete": {

                const name = options.getString("name");

                const Data = await EmbedDB.findOne({ Guild: guild.id, Name: name }).catch(err => console.error(err));
                if (!Data) return interaction.reply({ content: `There is no embed by that name!`, ephemeral: true });

                Data.delete();

                interaction.reply({ content: `Your embed \`${name}\` has been deleted.`, ephemeral: true });

            }

                break;

            case "one-time": {

                const title = options.getString("title");
                const desc = options.getString("description");
                const image = options.getString("image-url");
                const role = options.getRole("role") || ``;
                const Member = options.getMember("user") || ``;

                if (image) {

                    interaction.reply({
                        content: `${role}${Member}`,
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: user.username, iconURL: member.displayAvatarURL() })
                                .setColor(color)
                                .setTitle(title)
                                .setDescription(desc)
                                .setImage(image)
                                .setFooter({ text: "Embeds by Bun Bot" })
                                .setTimestamp()
                        ]
                    });

                } else if (!image) {

                    interaction.reply({
                        content: `${role}${Member}`,
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: user.username, iconURL: member.displayAvatarURL() })
                                .setColor(color)
                                .setTitle(title)
                                .setDescription(desc)
                                .setFooter({ text: "Embeds by Bun Bot" })
                                .setTimestamp()
                        ]
                    });

                }

            }

        }

    }
};