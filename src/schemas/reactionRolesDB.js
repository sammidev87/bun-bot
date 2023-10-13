const { model, Schema } = require("mongoose");

module.exports = model("reaction-roles", new Schema({

    Guild: String,
    Panel: String,
    Roles: Array,
    MessageId: String,

}));