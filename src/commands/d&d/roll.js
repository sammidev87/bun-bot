const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Rolls dice")
        .addNumberOption(opt => opt.setName("amount").setDescription("How many die to roll.").setRequired(true))
        .addNumberOption(opt => opt.setName("sides").setDescription("How many sides the die have.").setRequired(true))
        .addStringOption(opt => opt.setName("multiplier").setDescription("Your multiplier eg. +5").setRequired(false)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options, user } = interaction;
        const { color } = client;

        const numDice = options.getNumber("amount");
        if (numDice >= 201) return interaction.reply({ content: `You can only roll up to 200 die at a time!`, ephemeral: true });
        const numSides = options.getNumber("sides");

        const content = options.getString("multiplier");
        if (!content) {

            diceResults = rollDice(numDice, numSides);

            let diceTotal = calcDiceTotal(diceResults);

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                        .setColor(color)
                        .setTitle("🎲 Roll")
                        .setDescription(`**Dice used:** \`${numDice}d${numSides}\` | **You have rolled:** \`${diceResults.join(", ")}\` | **Your dice total:** \`${diceTotal}\``)
                        .setThumbnail('https://ucarecdn.com/0544ba87-4a6d-462f-a264-31a2c3553087/il_1588xN2699066247_ch6l.jpg')
                        .setFooter({ text: "DND Dice by Bun Bot" })
                        .setTimestamp()
                ]
            });

        } else {

            const msgContent = content.trim().toLowerCase();

            const split = msgContent.replaceAll('+', '+ ').replaceAll('-', '- ').replaceAll('*', '* ').replaceAll('/', '/ ').split(' ');
            const numOperator = split[ 0 ];
            const numBonus = split[ 1 ];

            diceResults = rollDice(numDice, numSides);

            if (numOperator === "+") {

                let diceTotal = calcDiceTotal(diceResults) + parseInt(numBonus);

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                            .setColor(color)
                            .setTitle("🎲 Roll")
                            .setDescription(`**Dice used:** \`${numDice}d${numSides}${content}\` | **You have rolled:** \`${diceResults.join(", ")}\` | **Your multiplier:** \`${numOperator}${numBonus}\` | **Your dice total:** \`${diceTotal}\``)
                            .setThumbnail('https://ucarecdn.com/0544ba87-4a6d-462f-a264-31a2c3553087/il_1588xN2699066247_ch6l.jpg')
                            .setFooter({ text: "DND Dice by Bun Bot" })
                            .setTimestamp()
                    ]
                });

            } else if (numOperator === "-") {

                let diceTotal = calcDiceTotal(diceResults) - parseInt(numBonus);

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                            .setColor(color)
                            .setTitle("🎲 Roll")
                            .setDescription(`**Dice used:** \`${numDice}d${numSides}${content}\` | **You have rolled:** \`${diceResults.join(", ")}\` | **Your multiplier:** \`${numOperator}${numBonus}\` | **Your dice total:** \`${diceTotal}\``)
                            .setThumbnail('https://ucarecdn.com/0544ba87-4a6d-462f-a264-31a2c3553087/il_1588xN2699066247_ch6l.jpg')
                            .setFooter({ text: "DND Dice by Bun Bot" })
                            .setTimestamp()
                    ]
                });

            } else if (numOperator === "*") {

                let diceTotal = calcDiceTotal(diceResults) * parseInt(numBonus);

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                            .setColor(color)
                            .setTitle("🎲 Roll")
                            .setDescription(`**Dice used:** \`${numDice}d${numSides}${content}\` | **You have rolled:** \`${diceResults.join(", ")}\` | **Your multiplier:** \`${numOperator}${numBonus}\` | **Your dice total:** \`${diceTotal}\``)
                            .setThumbnail('https://ucarecdn.com/0544ba87-4a6d-462f-a264-31a2c3553087/il_1588xN2699066247_ch6l.jpg')
                            .setFooter({ text: "DND Dice by Bun Bot" })
                            .setTimestamp()
                    ]
                });

            } else if (numOperator === "/") {

                let diceTotal = calcDiceTotal(diceResults) / parseInt(numBonus);

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                            .setColor(color)
                            .setTitle("🎲 Roll")
                            .setDescription(`**Dice used:** \`${numDice}d${numSides}${content}\` | **You have rolled:** \`${diceResults.join(", ")}\` | **Your multiplier:** \`${numOperator}${numBonus}\` | **Your dice total:** \`${diceTotal}\``)
                            .setThumbnail('https://ucarecdn.com/0544ba87-4a6d-462f-a264-31a2c3553087/il_1588xN2699066247_ch6l.jpg')
                            .setFooter({ text: "DND Dice by Bun Bot" })
                            .setTimestamp()
                    ]
                });

            }

        }

    }

};

function rollDie(sides) {

    return 1 + Math.floor(Math.random() * sides);

}

function rollDice(number, sides) {
    let diceArray = [];

    while (number-- > 0) diceArray.push(rollDie(sides));

    return diceArray;
}

function calcDiceTotal(diceArray) {
    return diceArray.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
    );
}