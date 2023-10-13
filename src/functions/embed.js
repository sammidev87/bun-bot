const { EmbedBuilder } = require("discord.js");

function Embed(color, title, description, image, footer) {
    const Embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setImage(image)
            .setFooter(footer)
            .setTimestamp();
    return Embed;
}

module.exports = Embed;