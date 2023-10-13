const { model, Schema } = require("mongoose");

module.exports = model("ticketSystem", new Schema({

    GuildID: String,
    MemberID: String,
    TicketID: String,
    ChannelID: String,
    ClaimedUser: String,
    OpenedUser: String,
    ClosedUser: String,
    Type: String,

}));