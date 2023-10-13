const { model, Schema } = require("mongoose");

module.exports = model("confessionReply", new Schema({

    Guild: String,
    Channel: String,
    Message: String,
    ConfessionNumber: Number,
    Thread: String,

}));