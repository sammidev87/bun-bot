const { model, Schema } = require("mongoose");

module.exports = model("economy", new Schema({

    Guild: String,
    User: String,
    Balance: Number,
    BumpCount: Number,
    Inventory: Array,
    ShopPage: Number,

}));