//Import Modules
const { MessageEmbed } = require("discord.js");
const settings = require('../database/settings.json');
const Discord = require('discord.js')
const fs = require('fs')
const moment = require('moment-timezone')
module.exports = {
    name: "recount",
    description: "Recount mentioned item into inventory",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: ["1039443203411152916"], 
    alloweduserids: [],
    options: [
    	{"String": { name: "item", description: "Enter the name of the item", required: true }},
    	{"Integer": { name: "amount", description: "Mention the amount of item being recounted", required: true }},
    ],
    run: async (client, interaction) => {
        const {guild, member, customId} = interaction;

        //READ FILES
        let INVENTORY_FILE = JSON.parse(fs.readFileSync('./database/inventory.json'))

        //READ PARAMS
        let amount = interaction.options.getInteger('amount')
        let item = interaction.options.getString('item').toLowerCase()
        let today = moment.tz('Australia/Sydney')

        //ERROR CHECKS
        if(amount < 0) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`:x: ${member}, Amount cannot be in negative.`)
            ],
            ephemeral: true
        })

        //check if parent is storage category
        if(![settings.storageIDS.house, settings.storageIDS.vehicle].includes(interaction.channel.parent.id)) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} This channel is not a registered storage channel.`)
            ],
            ephemeral: true
        })

        let storageID = interaction.channel.id
        let type = interaction.channel.parent.id
        
        if(type === settings.storageIDS.house) type = 'house'
        if(type === settings.storageIDS.vehicle) type = 'vehicle'

        if(!INVENTORY_FILE[type][storageID].storage.hasOwnProperty(item)) INVENTORY_FILE[type][storageID].storage[item] = 0
        if(INVENTORY_FILE[type][storageID].storage[item] === amount){
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`${settings.emotes.loading} **${item}** Found in inventory.`)
                    .addField('In Inventory', `${INVENTORY_FILE[type][storageID].storage[item]}x ${item}`, true)
                    .addField(`Input Amount`, `${amount}x ${item}`, true)
                ],
                ephemeral: true
            })
        }else{
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`${settings.emotes.loading} **${item}** Found in inventory.`)
                    .addField('In Inventory', `${INVENTORY_FILE[type][storageID].storage[item]}x ${item}`, true)
                    .addField(`Input Amount`, `${amount}x ${item}`, true)
                ],
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId(`recount-${item}-${amount}-${type}`)
                            .setLabel('Update')
                            .setEmoji(settings.emotes.loading)
                            .setStyle('PRIMARY')          
                    )
                ],
                ephemeral: true
            })
        }
    }
}