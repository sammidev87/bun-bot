const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kawaii-rules")
        .setDescription("Sends the selected rules. (Owner only)")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub => sub.setName("room")
            .setDescription("Room Rules"))
        .addSubcommand(sub => sub.setName("server-rules")
            .setDescription("Server Rules"))
        .addSubcommand(sub => sub.setName("seeking")
            .setDescription("Seeking Rules"))
        .addSubcommand(sub => sub.setName("triggers")
            .setDescription("Trigger List"))
        .addSubcommand(sub => sub.setName("vc")
            .setDescription("VC Rules"))
        .addSubcommand(sub => sub.setName("spicy")
            .setDescription("Spicy Talk rules.")),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { user, member, options } = interaction;
        const { color } = client;

        if (user.id !== `806050057811132436`) return interaction.reply({ content: `You do not have access to this command!`, ephemeral: true });

        switch (options.getSubcommand()) {

            case "room": {

                const desc = [ `Anything mentioned in rooms has to abide by our <#1089010680486711366>. 

        You may vent in your room, but they may not include heavy or triggering topics. Triggering vents will only ever be allowed in <#1039199877432877106>. 
        
        When lightly venting in your room, you have to censor your vent.
        
        Do not post creepy/disturbing images in your channel as they may make others uncomfortable.
        
        You may joke with friends in your room, but remember that others can see what you're posting. So make sure that all topics are appropriate and don't be overly aggressive to friends, even if playful.
        
        Swearing still needs to be censored, just like in every other channel. Swears can never be directed towards another user, even if playful.
        
        You are allowed to talk about socially acceptable drinking (only) within your own room without censoring it. Please use the appropriate terminology to refer to such behavior and substances though, as listed in <#1089010680486711366>.
        
        ---
        General Information: 

        You may share your room with anyone you please!

        You must boost the server to have your own custom room.` ];

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: member.displayAvatarURL() })
                    .setColor(color)
                    .setTitle(`Custom Chat Room Rules`)
                    .setDescription(`${desc}`)
                    .setFooter({ text: "Rules by Bun Bot" })
                    .setTimestamp();

                interaction.reply({ embeds: [ Embed ] });

            }

                break;

            case "server-rules": {

                const desc = [ `1. You must ID verify to join this server, only 18+ will be admitted.

2. While our server focuses on mental health, we are not therapists. We are here to listen to you and give you advice if you need it (especially anyone with the <@&1149482525190791238> role), but no one on the server will be able to replace professional care. However if you want such care we have the <#1149129147222867968> where staff will help you quickly and to the best of their abilities.

3. We have a strict no-tolerance policy for drama or attention-seeking. While we understand that everyone has their triggers and sometimes it might be hard for you to keep your emotions under control, we ask that if something or someone rubs you the wrong way, you disengage. We have several chat channels and safe spaces so that if conversation in one channel makes you feel uncomfortable,  you have other options.

4. No forms of discrimination based on sex, gender, orientation, ethnicity, religion, or any other factor will be tolerated whatsoever.

5. Respect the decisions of staff. If you wish to contest a warn or ban you are requested to <#1037971276272242688> or message another mod. Do not start an argument in public channels or DMs.

6. No spamming, flooding the chat, or sending large walls of text into any of the channels. Links, memes, funny pictures etc go in <#1074287091074207845>.

7. Venting is only allowed in the <#1039199877432877106> (general venting), <#1149464395504685146> (for heavy topics), <#1085447609012989962> (to vent anonymously), or <#1149804294879596564> (your vent will be instantly deleted) channels.

8. Any and all mention of mental health issues beyond a passing mention belongs in the channels meant for discussion of specific issues.

9. For <#1149464495626911764> and <#1149464553537675295> , cussing and any topic on our spoiler topics trigger list requires a trigger warning as well as being spoilered, so people know what they are unspoilering in advance.

10. Please respect peoples' roles - they are there for a reason. That means if they have No Flirting/No Touch/No DMs, then respect that. Do not give anyone a nickname/petname without getting consent first!

11. Please use the proper channels, they are labeled the way they are for a reason. (You must reach level 5 in the server before you can use the <#1037960677014392832> channel. If you ask to dm someone before you reach level 5 and/or not in <#1037960677014392832> you will be given an automatic warning)

12. If you as a member feel uncomfortable or threatened around another member, please <#1037971276272242688>. We will resolve the situation for you and never think you are bugging us or wasting our time.

13. If you break a rule, you will be given a verbal warning. If you break the same rule again, an official warning will follow. If the rule breaking is deemed severe enough, you may get an immediate official warning. After three official warnings, you will be banned.

Exception:
(Staff reserves the right to ban any member at any time if they feel the member's actions threaten other members or the server itself.)

14. Please follow Discord TOS. Breaking these will result in an instant ban.` ];

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: member.displayAvatarURL() })
                    .setColor(color)
                    .setTitle(`Rules`)
                    .setDescription(`${desc}`)
                    .setImage(`https://ucarecdn.com/87c4ca9b-a3af-4756-aaff-9124049f8278/Rules.jpg`)
                    .setFooter({ text: "Rules by Bun Bot" })
                    .setTimestamp();

                interaction.reply({ embeds: [ Embed ] });

            }

                break;

            case "seeking": {

                const desc = [ `This is the seeking area of the server. It's a place to meet people and find a relationship in a friendly manner. Since we want to keep it friendly, there's a few rules that are important if you want to make use of this area.
        
        ✨1. Respect the server rules. If you want access to the NSFW seeking area, you must open a general ticket in <@1037971276272242688> and ask staff for the <@&1121952990383833088>.

        ✨2. Respect people's consent rules. Even with this being a seeking area, unless someone has given you explicit permission to flirt/touch/DM or list differently in their seeking post, do not do any of those things. 
        
        ✨3. If anything goes sour for you, whether it's rejection or a break-up, please keep any related negativity out of the server. Failure to do so will be treated the same as attention-seeking behavior and will result in warnings.
        
        ✨4. We are not here to provide assistance in relationships. If you feel there are issues that need handling, please reach out to someone who can help you better than we can. If you open a ticket, we will of course help you if you need help finding someone like that. 
        
        ✨5.  If you run into any issues that you feel need to be brought to staff attention, please open a ticket in #tickets. We are here to keep everyone on the server safe, and you can help us do that by letting us know about Bad Things (||toxicity, manipulation, abuse, and others||). You will **NEVER** waste our time by doing so.` ];

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: member.displayAvatarURL() })
                    .setColor(color)
                    .setTitle(`Seeking Rules`)
                    .setDescription(`${desc}`)
                    .setFooter({ text: "Rules by Bun Bot" })
                    .setTimestamp();

                interaction.reply({ embeds: [ Embed ] });

            }
                
                break;

            case "triggers": {

                const desc = [ `Spoiler Topics(only enforced in <#1149464495626911764>, <#1149464553537675295>, and <#1037960777136607302>):

        *these are thing/topics you put in | | spoilers (you must put a trigger warning in front of spoilered subjects eg. TW: cursing ||fuck||)
        
        ► ||cursing|| 
        ► ||religion||
        ► ||medical stuff  ex hospitalizations/surgery/blood||
        ► ||yelling/all caps||
        ► ||bugs / insects and reptiles||
        ► ||Flashing emojis or gif for health reasons||
        ► ||fire or talking about things burning||
        ► ||padded pics||
        ► ||cheating||
        ► If you want to talk about ||alcohol|| or ||weed|| we ask that you use \`spicy juice\` for ||alcohol|| \`loopy\` for ||drunk|| and \`spicy grass\` for ||weed||
        
        
        Banned Subjects:
        
        ► ||violence ( death/killing, blood)||
        ► ||weapons|| 
        ► ||substance abuse (alcohol/drugs)||
        ► ||pedophilia|| 
        ► ||politics|| 
        ► ||sexualizing dd/lg age regression||
        ► ||kinks/age play||
        ► ||Eating disorders||
        ► ||Suicide/Self Harm  Anything to do with this including thoughts|| (If you need to talk to someone our staff is always available, feel free to <#1037971276272242688> and we will gladly talk to you about anything) ` ];

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: member.displayAvatarURL() })
                    .setColor(color)
                    .setTitle(`Trigger List`)
                    .setDescription(`${desc}`)
                    .setFooter({ text: "Sent by Bun Bot" })
                    .setTimestamp();

                interaction.reply({ embeds: [ Embed ] });

            }

                break;

            case "vc": {

                const desc = [ `1. Please keep in mind that the same rules as <#1149464495626911764>, <#1149464553537675295>, and <#1037960777136607302> apply to <#1037958834053976087> as well.

If you are wanting to talk about trauma, sexual content  or a topic that you would normally put in <#1149464395504685146>, make sure to ask people in VC whether they are okay with talking about it first.

Mute yourself if need be. If you have to leave the conversation for a bit and there might be loud noises or other people talking about topics that would normally go in <#1149464395504685146> in the background, mute yourself. Kids running around or a tv playing is one thing, loud noises or sexual stuff are considered another. If you're unsure, err on the side of caution!

Keep an eye on ⁠vc-chat while you're talking. We use a redlight system where people can easily indicate when they are less or not at all comfortable with the current line of conversation by posting in this channel. To everyone who is uncomfortable, use this system please, or <#1037971276272242688> to contact staff.

  💚 All is good  💛 Getting uncomfortable  ❤️ Stop immediately ` ];

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: member.displayAvatarURL() })
                    .setColor(color)
                    .setTitle(`VC Rules`)
                    .setDescription(`${desc}`)
                    .setImage(`https://ucarecdn.com/87c4ca9b-a3af-4756-aaff-9124049f8278/Rules.jpg`)
                    .setFooter({ text: "Rules by Bun Bot" })
                    .setTimestamp();

                interaction.reply({ embeds: [ Embed ] });

            }

                break;

            case "spicy": {

                const desc = [ `**__Spicy Rules:__**
                    - If you want access to Spicy Talk, you need to have first reached level 5, then you need to ask a staff member to manually give the NSFW role to you.

                    - By requesting the NSFW role, you understand that in Spicy Talk members are allowed to mention and send media of all adult topics - e.g alcohol, weed, bdsm, kinks of all kinds, etc.

                    - Abide by all server rules (not related to NSFW content) unless explicitly stated differently in these rules.

                    - The following items on the trigger list can be mentioned freely in the following places: 

                             Cursing - everywhere in Spicy Talk. 
                             Kinks/age play - in Kinky Spice and Spicy Teachings only. 
                             Alcohol & weed can be mentioned  without having to refer to them as 'Spicy Grass' or 'Spicy Juice'

                    - Sexualizing littlespace in **__any way__**  results in an **__immediate ban__**. This is a rule we will keep enforcing and cracking down hard on.

                    - We ask that you do your best to stick to the topics of each channel, however we are all adults here and if something makes you uncomfortable speak up. Our staff will happily handle the situation.

                    - Spicy Chat-2 is there for if too many people are talking in chat or you aren't comfortable with the current conversation happening in chat, you still have a place to talk where you can avoid that conversation.

                    - Spicy Pics is open to every picture of an NSFW nature. Thread with care and keep in mind that outside of the exceptions mentioned above, the general trigger list still applies.
                    
                    - While little, even if you have the NSFW role, you are not allowed to be active in Spicy Talk. Doing so will result in a warning just as much as breaking any other role. 
                    
            ` ];

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: member.displayAvatarURL() })
                    .setColor(color)
                    .setTitle(`VC Rules`)
                    .setDescription(`${desc}`)
                    .setImage(`https://ucarecdn.com/87c4ca9b-a3af-4756-aaff-9124049f8278/Rules.jpg`)
                    .setFooter({ text: "Rules by Bun Bot" })
                    .setTimestamp();

                interaction.reply({ embeds: [ Embed ] });

            }

                break;

        }

    }

};