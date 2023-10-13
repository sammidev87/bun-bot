const { model, Schema } = require("mongoose");

module.exports = model("safeWord", new Schema({

    Guild: String,
    Role: String,
    SafeWord: String,

}));