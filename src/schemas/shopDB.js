const { model, Schema } = require("mongoose");

module.exports = model("shop", new Schema({

    Guild: String,
    Items: Array,

}));