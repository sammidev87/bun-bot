const { model, Schema } = require("mongoose");

module.exports = model("warn", new Schema({

    Guild: String,
    Member: String,
    WarnAmount: Number,

}));