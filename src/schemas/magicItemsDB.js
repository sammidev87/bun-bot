const { model, Schema } = require("mongoose");

module.exports = model("magicItems", new Schema({

    GuildID: String,
    Name: String,
    Rarity: String,
    Price: String,
    Type: String,
    Attunement: String,
    Curse: String,

}));