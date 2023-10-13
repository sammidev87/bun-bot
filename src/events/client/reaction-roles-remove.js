const { User, MessageReaction, Events } = require("discord.js");
const ReactionRolesDB = require("../../schemas/reactionRolesDB");

module.exports = {
    name: Events.MessageReactionRemove,

    /**
     * 
     * @param { MessageReaction } reaction 
     * @param { User } user 
     */
    async execute(reaction, user) {

        const { message, partial } = reaction;
        const { guild, id } = message;
        const member = await guild.members.fetch(user.id);
        if (user.bot) return;

        if (partial) {
            try {
                reaction.fetch();
            } catch (error) {
                console.error(error);
            }
        }

        const data = await ReactionRolesDB.findOne({ Guild: guild.id, MessageId: id }).catch(err => console.error(err));
        if (!data) return;

        const findRole = data.Roles.find((role) => role.roleEmoji === reaction.emoji.name);
        const role = await guild.roles.fetch(findRole.roleId);
        member.roles.remove(role);

    }
};