const { model, Schema } = require("mongoose");

module.exports = model("QOTD", new Schema({

    Guild: String,
    Channel: String,
    Role: String,
    Count: Number,

}));