const { model, Schema } = require("mongoose");

module.exports = model("banChannel", new Schema({

    Guild: String,
    Channel: String,

}));