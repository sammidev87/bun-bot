const { model, Schema } = require("mongoose");

module.exports = model("createVcChannel", new Schema({

    Guild: String,
    Channel: String,
    ChannelName: String,

}));