const { model, Schema } = require("mongoose");

module.exports = model("embeds", new Schema({

    Guild: String,
    Name: String,
    Title: String,
    Description: String,
    Image: String,

}));