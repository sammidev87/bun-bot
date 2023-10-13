const { model, Schema } = require("mongoose");

module.exports = model("levels", new Schema({

    Guild: String,
    User: String,
    XP: Number,
    Level: Number,

}));