const { model, Schema } = require("mongoose");

module.exports = model("pick", new Schema({

    Guild: String,
    OpenWindow: Boolean,
    MessageCount: Number,
    PickChannels: Array,

}));