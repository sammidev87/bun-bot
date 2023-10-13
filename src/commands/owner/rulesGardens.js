const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gothic-garden-rules")
        .setDescription("Sends the selected rules. (Owner only)")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub => sub.setName("little")
            .setDescription("Little Rules"))
        .addSubcommand(sub => sub.setName("rules")
            .setDescription("Server Rules")),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { options } = interaction;
        const { color } = client;

        switch (options.getSubcommand()) {

            case "little": {

                const desc = [ `✨1. Please Ask Consent from Babysitters to babysit - don’t try to get their attention to take care of you when they are with another little

                ✨2. Please try contacting your CG before going into Daycare as Daycare works just how a IRL one does - there for when your CG cannot take care of you OR if your CG wants to do it in the daycare that’s fine to
        
                ✨3. Do not brat without consent 
        
                ✨4. Always be nice to other littles 
        
                ✨5. No NSFW topics or media in Sunflower Fields
        
                ✨6. No sexualizing Littlespace 
        
                ✨7. No stealing attention, or being rude because you aren’t getting the attention you want` ];

                const Embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: member.displayAvatarURL() })
                    .setColor(color)
                    .setTitle(`Little Rules`)
                    .setDescription(`${desc}`)
                    .setFooter({ text: "Rules by Bun Bot" })
                    .setTimestamp();

                interaction.reply({ embeds: [ Embed ] });

            }

                break;

            case "rules": {

                const desc = [ `By Clicking On This Panel You Agree To The Rules And Regulations Of This Server Along With Discord TOS and Guidelines.

        🌿1. Respect the TOS and Guidelines of Discord
        
        🌿2. No discriminatory behavior will be permitted (Including but not limited to - slurs, racism, bullying, ableism, and homophobia)
        
        🌿3. Respect the Staff Hierarchy and Staff Members themselves. Any Trolling, Harassment, Disrespect, etc. will result in our Three Strike System which includes us putting a role on you so you don't slip past us.
        
        🌿4. If you are in Littlespace PLEASE do not venture into our NSFW channels. I will not buy the fact that you cannot control where you click. If you have a CG they are responsible for you at that moment when you go into the server. If I see you in a little space in an NSFW channel you will receive a strike. In addition, if anyone sexualizes little space in any way you will be banned. We do not tolerate DDLG, ABDL, or other little space sexualization. This is a safe space.
        
        🌿5. If any NSFW content or symbolism regarding a minor is found in this server, on a member's pfp or name, that member responsible will also be banned. No minor content at all. P3DOs are not tolerated in the slightest.
        
        🌿6. Since this is a server with a focus on dating this must be said-
        
        If you and your partner break up I don't care. If you create the drama of any kind due to a breakup or a rejection you will be kicked from this server. Please keep it to yourselves. No witch hunting. No taking sides. I am here to provide a match-making process not be a relationship counselor.
        
        🌿7. If you are a part of my blacklist you will be banned upon arrival.
        
        🌿8. Any minor trying to get in will also be banned - this is a server for adults.
        
        🌿9. Please do not discuss any politics or religion in a biased, hateful way. Have debates, but the moment it turns into a fight it will stop
        
        🌿10. Keep all discussions in their appropriate channels!! Talking about weed, go to our MaryJane Fields, talk about NSFW go to our Jasmine Path, etc. 
        
        🌿11. Role Consent is key. RESPECT PEOPLES ROLES!!! 

        🌿Safe Word is: <@&1072000898588475462> RESPECT THE SAFE WORD AT ALL TIMES- if it is said it should only be said in a genuine emergency . Misuse of the word will result in a Strike

        🌿STRIKE SYSTEM-
        🌿Strike 1- Timeout for a day and Warn 
        🌿Strike 2- Probation and Timeout for 7 days 
        🌿Strike 3- Ban
        `];

                const Embed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle("Poll")
                    .setDescription(`${desc}`)
                    .setImage(`https://ucarecdn.com/a12de301-5bf2-44ef-a32c-8a456ad40054/IMG_5905.jpg`)
                    .setFooter({ text: "Rules by Bun Bot" })
                    .setTimestamp();

                const Buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Yes`)
                            .setEmoji(`✅`)
                            .setCustomId(`Rules-Agree`)
                            .setStyle(ButtonStyle.Success),
                    );

                interaction.reply({ embeds: [ Embed ], components: [ Buttons ] });

            }

                break;

        }

    }

};