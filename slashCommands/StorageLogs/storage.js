//Import Modules
const { MessageEmbed } = require("discord.js");
const ee = require(`../../botconfig/embed.json`);
const nwc = require('../../functions/nwc.js');
const cap = require('../../functions/cap.js');
const settings = require('../../database/settings.json');
const fs = require('fs')
module.exports = {
    name: "storage",
    description: "Fetches storage logs",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: ["1039443203411152916"], 
    alloweduserids: [],
    options: [],
    run: async (client, interaction) => {
        const {guild, member, customId} = interaction;

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
        
        //READ FILES
        let INVENTORY_FILE = JSON.parse(fs.readFileSync('./database/inventory.json'))

        let maxLimit
        if(INVENTORY_FILE[type][storageID].logs.length > 20) maxLimit = 20
        else maxLimit = INVENTORY_FILE[type][storageID].logs.length

        let msg = `Past **${maxLimit}/${INVENTORY_FILE[type][storageID].logs.length}** Logs for **Storage** changes\n\n`
        for(i=0; i<maxLimit; i++){
            if(INVENTORY_FILE[type][storageID].logs[i].process === 'add') msg += `> <:offleave:979809532899364935> [${INVENTORY_FILE[type][storageID].logs[i].on}] **${nwc(INVENTORY_FILE[type][storageID].logs[i].amount)}x ${cap(INVENTORY_FILE[type][storageID].logs[i].item)}** By **${INVENTORY_FILE[type][storageID].logs[i].by}**\n`
            else if(INVENTORY_FILE[type][storageID].logs[i].process === 'recount') msg += `> ${settings.emotes.error} [${INVENTORY_FILE[type][storageID].logs[i].on}] **${nwc(INVENTORY_FILE[type][storageID].logs[i].amount)}x ${cap(INVENTORY_FILE[type][storageID].logs[i].item)}** By **${INVENTORY_FILE[type][storageID].logs[i].by}**\n`
            else msg += `> <:onleave:979808087684833330> [${INVENTORY_FILE[type][storageID].logs[i].on}] **${nwc(INVENTORY_FILE[type][storageID].logs[i].amount)}x ${cap(INVENTORY_FILE[type][storageID].logs[i].item)}** By **${INVENTORY_FILE[type][storageID].logs[i].by}**\n`
            
        }

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setTitle(`Lucifer's Fallen - Storage Logs`)
                .setThumbnail(guild.iconURL())
                .setDescription(msg)
                .setTimestamp()
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            ],
            ephemeral: true
        })
    }
}