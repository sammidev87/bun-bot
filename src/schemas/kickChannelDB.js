const { model, Schema } = require("mongoose");

module.exports = model("kickChannel", new Schema({

    Guild: String,
    Channel: String,

}));