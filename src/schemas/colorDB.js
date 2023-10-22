const { model, Schema } = require("mongoose");

module.exports = model("bumpBuddy", new Schema({

    Guild: String,
    Color: String,

}));