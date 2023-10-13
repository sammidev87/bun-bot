const { model, Schema } = require("mongoose");

module.exports = model("levelsChannel", new Schema({

    Guild: String,
    Channel: String,

}));