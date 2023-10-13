const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Delete up to 100 messages.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addNumberOption(opt => opt.setName("amount").setDescription("Amount of messages you want deleted.").setRequired(true)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, channel, member } = interaction;
        const { color } = client;

        const amount = options.getNumber("amount");
        if (amount >= 101) return interaction.reply({ content: `You can only delete up to 100 messages at a time!`, ephemeral: true });

        const msgs = await channel.messages.fetch({ limit: amount });
        msgs.forEach((message) => message.delete());

        const Embed = new EmbedBuilder()
            .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })
            .setColor(color)
            .setTitle("Clear Messages")
            .setDescription(`✅ | Successfully deleted ${amount} messages!`)
            .setFooter({ text: "Clear Messages by Bun Bot" });

        interaction.reply({ embeds: [ Embed ] });

    }
};