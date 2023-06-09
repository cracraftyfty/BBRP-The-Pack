//Import Modules
const { MessageEmbed } = require("discord.js");
const ee = require(`../../botconfig/embed.json`);
const nwc = require('../../functions/nwc.js');
const cap = require('../../functions/cap.js');
const settings = require('../../database/settings.json');
const fs = require('fs')
const moment = require('moment-timezone')
module.exports = {
    name: "add",
    description: "Adds mentioned item into storage",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: ["1039443203411152916"], 
    alloweduserids: [],
    options: [
    	{"String": { name: "item", description: "Enter the name of the item", required: true }},
    	{"Integer": { name: "amount", description: "Mention the amount of item being entered", required: true }}
    ],
    run: async (client, interaction) => {
        const {guild, member, customId} = interaction;

        //READ FILES
        let INVENTORY_FILE = JSON.parse(fs.readFileSync('./database/inventory.json'))

        //check if parent is storage category
        if(![settings.storageIDS.house, settings.storageIDS.vehicle].includes(interaction.channel.parent.id)) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} This channel is not a registered storage channel.`)
            ],
            ephemeral: true
        })

        //READ PARAMS
        let storageID = interaction.channel.id
        let amount = interaction.options.getInteger('amount')
        let item = interaction.options.getString('item').toLowerCase()
        let today = moment.tz('Australia/Sydney')

        let type = interaction.channel.parent.id
        if(type === settings.storageIDS.house) type = 'house'
        if(type === settings.storageIDS.vehicle) type = 'vehicle'
        
        //ERROR CHECKS
        if(amount <= 0) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`:x: ${member}, Amount cannot be in negative.`)
            ]
        })

        //LOOKING FOR ITEM IN INVENTORY AND ADDING IT
        if(!INVENTORY_FILE[type][storageID].storage.hasOwnProperty(item)) INVENTORY_FILE[type][storageID].storage[item] = parseInt(amount)
        else {
            for(let keys in INVENTORY_FILE[type][storageID].storage) {
                if(item === keys) INVENTORY_FILE[type][storageID].storage[keys] += parseInt(amount)
            }
        }
        


        //LOGGING ADDITION
        INVENTORY_FILE[type][storageID].logs.push({
            "item": item,
            "process": 'add',
            "amount": amount,
            "by": `${member.nickname}`,
            "on": today.format('DD-MM-YYYY hh:mm:ss a')
        })
        fs.writeFileSync('./database/inventory.json', JSON.stringify(INVENTORY_FILE, null, 4))

        //SENDING MESSAGE
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor(ee.color)
                .setTitle(`Inventory - ${interaction.channel.name}`)
                .setThumbnail(guild.iconURL())
                .setDescription(`${settings.emotes.check}  **${nwc(amount)}x ${cap(item)}** successfully added in inventory: ${interaction.channel}`)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            ],
            ephemeral: true
        })

        //LOG MESSAGE
        client.channels.cache.get(settings.logs).send({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`**+ ${nwc(amount)}x ${cap(item)}** by ${member} in **${interaction.channel}** [${interaction.channel.name}]`)
            ]
        })

        //UPDATE LIVE FEED
        let inv_msg = ''
        for(let keys in INVENTORY_FILE[type][storageID].storage) {
            inv_msg += `- ${nwc(INVENTORY_FILE[type][storageID].storage[keys])}x ${cap(keys)}\n`
        }
        let feed_channel = client.channels.cache.get(storageID);
        feed_channel.messages.fetch(INVENTORY_FILE[type][storageID].msgID).then(msg => {
            msg.edit({embeds:[
                new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`Inventory - ${interaction.channel.name}`)
                .setThumbnail(guild.iconURL())
                .setDescription(inv_msg)
                .setTimestamp()
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            ]})
        })
    }
}