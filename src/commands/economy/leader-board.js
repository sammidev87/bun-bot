const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const LevelsDB = require("../../schemas/levelsDB");
const EconomyDB = require("../../schemas/economyDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leader-board")
        .setDescription("Leader-board commands.")
        .addSubcommand(sub => sub.setName("levels")
            .setDescription("Levels leader-board."))
        .addSubcommand(sub => sub.setName("coins")
            .setDescription("Coins leader-board."))
        .addSubcommand(sub => sub.setName("bump")
            .setDescription("Bump Count leader-board.")),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { guild, options } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));

        switch (options.getSubcommand()) {

            case "levels": {

                const Embed = new EmbedBuilder()
                    .setColor(colorData.Color || color)
                    .setTitle("Level Leader-Board")
                    .setDescription(`Here is a list of the current leaders:`)
                    .setFooter({ text: "Leveling System by Bun Bot" })
                    .setTimestamp();

                const Data = await LevelsDB.find({ Guild: guild.id })
                    .sort({
                        XP: -1,
                        Level: -1,
                    })
                    .limit(10)
                    .catch(err => console.error(err));

                if (!Data) return interaction.reply({ content: `The Leaderboard is currently empty at this time!`, ephemeral: true });

                await interaction.deferReply();

                for (let counter = 0; counter < Data.length; ++counter) {

                    const { User, XP, Level = 0 } = Data[ counter ];

                    const Member = guild.members.cache.get(User);

                    let MemberTag;

                    if (Member) {
                        MemberAt = Member;
                        MemberTag = Member.user.tag;
                        MemberID = Member.user.id;
                    } else {
                        MemberAt = User;
                        MemberTag = User;
                        MemberID = User;
                    }

                    let shortXp = shorten(XP);

                    Embed.addFields(
                        {
                            name: `**${counter + 1}.** ${MemberTag}`,
                            value: `**User:** ${MemberAt}\n**User ID:** ${MemberID}\n**XP:** ${shortXp}\n**Level:** ${Level}\n`,
                            inline: false,
                        },
                    );

                }

                interaction.editReply({ embeds: [ Embed ] });

            }

                break;

            case "coins": {

                const Embed = new EmbedBuilder()
                    .setColor(colorData.Color || color)
                    .setTitle("Coins Leader-Board")
                    .setDescription(`Here is a list of the current leaders:`)
                    .setFooter({ text: "Currency by Bun Bot" })
                    .setTimestamp();

                const Data = await EconomyDB.find({ Guild: guild.id })
                    .sort({
                        Balance: -1,
                    })
                    .limit(10)
                    .catch(err => console.error(err));

                if (!Data) return interaction.reply({ content: `The Leaderboard is currently empty at this time!`, ephemeral: true });

                await interaction.deferReply();

                for (let counter = 0; counter < Data.length; ++counter) {

                    const { User, Balance = 0 } = Data[ counter ];

                    const Member = guild.members.cache.get(User);

                    let MemberTag;

                    if (Member) {
                        MemberAt = Member;
                        MemberTag = Member.user.tag;
                        MemberID = Member.user.id;
                    } else {
                        MemberAt = User;
                        MemberTag = User;
                        MemberID = User;
                    }

                    Embed.addFields(
                        {
                            name: `**${counter + 1}.** ${MemberTag}`,
                            value: `**User:** ${MemberAt}\n**User ID:** ${MemberID}\n🪙${Balance}`
                        }
                    );

                }

                interaction.editReply({ embeds: [ Embed ] });

            }

                break;

            case "bump": {

                const Embed = new EmbedBuilder()
                    .setColor(colorData.Color || color)
                    .setTitle("Bump Count Leader-Board")
                    .setDescription(`Here is a list of the current leaders:`)
                    .setFooter({ text: "Leveling System by Bun Bot" })
                    .setTimestamp();

                const Data = await EconomyDB.find({ Guild: guild.id })
                    .sort({
                        BumpCount: -1,
                    })
                    .limit(10)
                    .catch(err => console.error(err));

                if (!Data) return interaction.reply({ content: `The Leaderboard is currently empty at this time!`, ephemeral: true });

                await interaction.deferReply();

                for (let counter = 0; counter < Data.length; ++counter) {

                    const { User, BumpCount = 0 } = Data[ counter ];

                    const Member = guild.members.cache.get(User);

                    let MemberTag;

                    if (Member) {
                        MemberAt = Member;
                        MemberTag = Member.user.tag;
                        MemberID = Member.user.id;
                    } else {
                        MemberAt = User;
                        MemberTag = User;
                        MemberID = User;
                    }

                    Embed.addFields(
                        {
                            name: `**${counter + 1}.** ${MemberTag}`,
                            value: `**User:** ${MemberAt}\n**User ID:** ${MemberID}\n**Bump Count:** ${BumpCount}\n`,
                        },
                    );

                }

                interaction.editReply({ embeds: [ Embed ] });

            }

                break;

        }

    }
};

function shorten(count) {

    const ABBRS = [ "", "k", "m", "t" ];

    const i = 0 === count ? count : Math.floor(Math.log(count) / Math.log(1000));

    let result = parseFloat((count / Math.pow(1000, i)).toFixed(2));
    result += `${ABBRS[ i ]}`;

    return result;

};