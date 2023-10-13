const { model, Schema } = require("mongoose");

module.exports = model("warnChannel", new Schema({

    Guild: String,
    Channel: String,

}));