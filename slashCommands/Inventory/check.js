//Import Modules
const { MessageEmbed } = require("discord.js");
const ee = require(`../../botconfig/embed.json`);
const cap = require('../../functions/cap.js');
const settings = require('../../database/settings.json');
const fs = require('fs')
module.exports = {
    name: "check",
    description: "checks if the item mentioned is in the storage or not",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: ["1039443203411152916"], 
    alloweduserids: [],
    options: [
    	{"String": { name: "item", description: "Enter the name of the item", required: true }},
    ],
    run: async (client, interaction) => {
        const {guild, member, customId} = interaction;

        //READ FILES
        let INVENTORY_FILE = JSON.parse(fs.readFileSync('./database/inventory.json'))

        //READ PARAMS
        let item = interaction.options.getString('item').toLowerCase()

        let msg = ''

        for(let keys in INVENTORY_FILE){
            for(let storages in INVENTORY_FILE[keys]){
                if(INVENTORY_FILE[keys][storages].storage.hasOwnProperty(item)){
                    msg += `<#${storages}> | **${INVENTORY_FILE[keys][storages].storage[item]}**x **${cap(item)}**\n`
                }
            }
        }

        if(!msg) msg = `${settings.emotes.wrong} **${item}** does not exist in any storages`

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setTitle('ThePack - Inventory Tracker')
                .setThumbnail(guild.iconURL())
                .setURL(ee.footericon)
                .setDescription(msg)
                .setTimestamp()
                .setFooter({text: ee.footertext, iconURL: ee.footericon})
            ],
            ephemeral: true
        })
    }
}