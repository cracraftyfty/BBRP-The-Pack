//Import Modules
const { MessageEmbed } = require("discord.js");
const settings = require('../database/settings.json');
const Discord = require('discord.js');
module.exports = {
    name: "deletestorage",
    description: "Creates a new Storage",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: ["1039443203411152916"], 
    alloweduserids: [],
    options: [],
    run: async (client, interaction) => {

        //check if parent is storage category
    if(![settings.storageIDS.house, settings.storageIDS.vehicle].includes(interaction.channel.parent.id)) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} This channel is not a registered storage channel.`)
        ],
        ephemeral: true
    })
    
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.loading} Are you sure you want to delete the storage [${interaction.channel}]?\nIf this is a mistake, then please press "Dismiss message" text below the message`)
            ],
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`delete-storage`)
                        .setLabel('Delete Storage')
                        .setEmoji(settings.emotes.error)
                        .setStyle('PRIMARY')          
                )
            ],
            ephemeral: true
        })
    }
}