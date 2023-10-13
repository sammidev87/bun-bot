const { model, Schema } = require("mongoose");

module.exports = model("ticketChannel", new Schema({

    GuildID: String,
    ChannelID: String,

}));