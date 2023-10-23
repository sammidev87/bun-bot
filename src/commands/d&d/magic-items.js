const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const MagicItemsDB = require("../../schemas/magicItemsDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("magic-items")
        .setDescription("Find magic items.")
        .addStringOption(opt => opt.setName("name").setDescription("Name of the Magic Item.").setRequired(true)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, guild } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));

        const name = options.getString("name");

        const data = await MagicItemsDB.findOne({ GuildID: guild.id, Name: name }).catch(err => console.error(err));
        if (!data) return interaction.reply({ content: `There is no magic item by that name!`, ephemeral: true });

        const desc = [ `Name: ${data.Name}
        Rarity: ${data.Rarity}
        Price: ${data.Price}
        Type: ${data.Type}
        Attunement: ${data.Attunement}
        Curse: ${data.Curse}
        `];

        const Embed = new EmbedBuilder()
            .setColor(colorData.Color || color)
            .setTitle("Magic Item:")
            .setDescription(`${desc}`)
            .setFooter({ text: "Magic Items by Bun Bot" })
            .setTimestamp();

        interaction.reply({ embeds: [ Embed ] });

    }

};