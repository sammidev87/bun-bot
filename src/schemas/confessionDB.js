const { model, Schema } = require("mongoose");

module.exports = model("confessionChannel", new Schema({

    Guild: String,
    Channel: String,
    LogChannel: String,
    Count: Number,

}));