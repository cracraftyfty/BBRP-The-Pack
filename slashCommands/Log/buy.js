//Import Modules
const { MessageEmbed } = require("discord.js");
const nwc = require('../../functions/nwc.js');
const cap = require('../../functions/cap.js');
const settings = require('../../database/settings.json');
const moment = require('moment-timezone')
module.exports = {
    name: "buy",
    description: "Log item purchases",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: ["1039443203411152916"], 
    alloweduserids: [],
    options: [
        {"String": { name: "item", description: "Enter the name of the item", required: true }},
    	{"Integer": { name: "count", description: "Mention the count of items being purchased", required: true }},
    	{"Integer": { name: "total_price", description: "total sale cost", required: true }},
        {"String": { name: "seller", description: "Who was the seller?", required: true }},
        {"String": { name: "note", description: "Additional note for the log", required: false }}
    ],
    run: async (client, interaction) => {

        //Make these commands used in inventory channel
        //Add confirmation
        const {guild, member, customId} = interaction;
        
        let today = moment.tz("Australia/Sydney")
        
        let _salesChannel = await client.channels.cache.get(settings.saleLogs)

        let item = {
            "name": interaction.options.getString('item'),
            "count": interaction.options.getInteger('count'),
            "price": interaction.options.getInteger('total_price'),
            "note": interaction.options.getString('note'),
            "seller": interaction.options.getString('seller')
        }   

        if(!item.note) item.note = "No notes added"

        _salesChannel.send({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`[+] ${member} bought **${nwc(item.count)}**x **${cap(item.name)}** for **$${nwc(item.price)}** from **${cap(item.seller)}** at **${today.format('DD-MM-YYYY | HH:mm:ss a')}**`)
                .addFields(
                    {
                        name: 'Note',
                        value: item.note
                    }
                )
                .setTimestamp()
                .setFooter ({
                    text: `${member.user.tag} [ID: ${member.id}]`,
                    iconURL: member.avatarURL()
                })
            ]
        })
    }
}