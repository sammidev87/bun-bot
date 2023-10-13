const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const MagicItemsDB = require("../../schemas/magicItemsDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("magic-items-add")
        .setDescription("Add Magic items.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(opt => opt.setName("name").setDescription("Name of the Magic Item.").setRequired(true))
        .addStringOption(opt => opt.setName("rarity").setDescription("Rarity of the magic item.").setRequired(true))
        .addStringOption(opt => opt.setName("price").setDescription("Price of the magic item.").setRequired(false))
        .addStringOption(opt => opt.setName("type").setDescription("Type of the magic item").setRequired(false))
        .addStringOption(opt => opt.setName("attunement").setDescription("Do you need to attune the item?").setRequired(false))
        .addStringOption(opt => opt.setName("curse").setDescription("What curse is on the item?").setRequired(false)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, guild } = interaction;

        const name = options.getString("name");
        const rarity = options.getString("rarity");
        const price = options.getString("price") || "N/A";
        const type = options.getString("type") || "N/A";
        const attunement = options.getString("attunement") || "N/A";
        const curse = options.getString("curse") || "N/A";

        const data = await MagicItemsDB.findOne({ Guild: guild.id, Name: name }).catch(err => console.error(err));
        if (!data) {
            new MagicItemsDB({
                GuildID: guild.id,
                Name: name,
                Rarity: rarity,
                Price: price,
                Type: type,
                Attunement: attunement,
                Curse: curse,
            }).save();

            return interaction.reply({ content: `Your magic item has been saved!`, ephemeral: true });
        } else {
            return interaction.reply({ content: `There is already a magic item by that name!`, ephemeral: true });
        }

    }

};