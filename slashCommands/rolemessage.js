//Import Modules
const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const settings = require('../database/settings.json');
const Discord = require('discord.js');
module.exports = {
    name: "rolemessage",
    description: "Reaction Roles",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: [], 
    alloweduserids: [
        "344915148487786498" //Craft
    ],
    options: [],
    run: async (client, interaction) => {
        const {guild, member, customId} = interaction;
        

        interaction.channel.send({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setTitle('The Pack | Role Manager')
                .setURL(ee.footericon)
                .setDescription(`${settings.emotes.loading} Press button to do things ||Get roles lol||`)
                .setThumbnail(ee.footericon)
                .setTimestamp()
                .setFooter({
                    text: ee.footertext,
                    iconURL: ee.footericon
                })
            ],
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`role-1037413563964338257`)
                        .setLabel(`Local`)
                        .setEmoji('👋')
                        .setStyle('SUCCESS'),
                    new Discord.MessageButton()
                        .setCustomId(`role-1054666047074078720`)
                        .setLabel(`The Pack Boosting`)
                        .setEmoji('🏁')
                        .setStyle('DANGER'),
                    new Discord.MessageButton()
                        .setCustomId(`role-1061414605299126432`)
                        .setLabel(`The Pack Racing`)
                        .setEmoji('🏎️')
                        .setStyle('PRIMARY')
                )
            ]
        })

    }
}