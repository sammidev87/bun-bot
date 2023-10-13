const { model, Schema } = require("mongoose");

module.exports = model("get-lucky", new Schema({

    Guild: String,
    Roles: Array,

}));