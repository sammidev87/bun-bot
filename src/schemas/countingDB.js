const { model, Schema } = require("mongoose");

module.exports = model("countingChannel", new Schema({

    Guild: String,
    Channel: String,
    Role: String,
    HighScore: String,
    LastUser: String,
    Count: String,
    LastMessageId: String,

}));