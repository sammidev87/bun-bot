const { model, Schema } = require("mongoose");

module.exports = model("poll", new Schema({

    Guild: String,
    User: String,
    Message: String,
    Answer: String,

}));