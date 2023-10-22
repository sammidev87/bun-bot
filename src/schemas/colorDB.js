const { model, Schema } = require("mongoose");

module.exports = model("color", new Schema({

    Guild: String,
    Color: String,

}));