//Import Modules
const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const nwc = require('../functions/nwc.js');
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
const Discord = require('discord.js')
const fs = require('fs')
const moment = require('moment-timezone')
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!customId.startsWith('recount-')) return;

    //READ FILES
    let INVENTORY_FILE = JSON.parse(fs.readFileSync('./database/inventory.json'))

    //PARSE CUSTOM ID
    let item = customId.split('-')[1]
    let amount = customId.split('-')[2]
    let type = customId.split('-')[3]
    let storageID = interaction.channel.id

    if(!INVENTORY_FILE[type][storageID].storage.hasOwnProperty(item)) INVENTORY_FILE[type][storageID].storage[item] = 0

    //LOG MESSAGE
    client.channels.cache.get('1032269005899173898').send({
        embeds: [
            new MessageEmbed()
            .setColor('YELLOW')
            .setDescription(`**[R] ${nwc(INVENTORY_FILE[type][storageID].storage[item])}x ${cap(item)}** => **${nwc(amount)}x ${cap(item)}** by ${member} in ${interaction.channel} [${interaction.channel.name}]`)
        ]
    })

    if(parseInt(amount) === 0) delete INVENTORY_FILE[type][storageID].storage[item]
    else INVENTORY_FILE[type][storageID].storage[item] = parseInt(amount)
    

    
    let today = moment.tz('Australia/Sydney')


    INVENTORY_FILE[type][storageID].logs.push({
        "item": item,
        "process": "recount",
        "amount": parseInt(amount),
        "by": member.nickname,
        "on": today.format('DD-MM-YYYY hh:mm:ss a')
    })
    fs.writeFileSync(`./database/inventory.json`, JSON.stringify(INVENTORY_FILE, null, 4))

    let inv_msg = ''
        for(let keys in INVENTORY_FILE[type][storageID].storage) {
            inv_msg += `- ${nwc(INVENTORY_FILE[type][storageID].storage[keys])}x ${cap(keys)}\n`
        }
        let feed_channel = client.channels.cache.get(storageID);
        feed_channel.messages.fetch(INVENTORY_FILE[type][storageID].msgID).then(msg => {
            msg.edit({embeds:[new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`Inventory - ${interaction.channel.name}`)
                .setThumbnail(guild.iconURL())
                .setDescription(inv_msg)
                .setTimestamp()
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            ]})
        })

    interaction.update({
        components: [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId(`recount`)
                    .setLabel('Updated')
                    .setEmoji(settings.emotes.check)
                    .setStyle('SECONDARY')
                    .setDisabled(true)          
            )
        ]
    })

    
}