//Import Modules
const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
const fs = require('fs')
const moment = require('moment-timezone')
module.exports = {
    name: "createstorage",
    description: "Creates a new Storage",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: ["1039443203411152916"], 
    alloweduserids: [],
    options: [
        {"StringChoices": { name: "storage_type", description: "Select the type of storage you want to create", required: true, choices: [["vehicle", "vehicle"], ["house", "house"]] }},
        {"String": { name: "name", description: "Enter the name of the channel", required: false }}
    ],
    run: async (client, interaction) => {
        const {guild, member, customId} = interaction;
        let today = moment.tz('Australia/Sydney');

        //READ FILES
        let INVENTORY_FILE = JSON.parse(fs.readFileSync('./database/inventory.json'))

        let TYPE = interaction.options.getString('storage_type')
        let category = client.channels.cache.get(settings.storageIDS[TYPE])

        let NAME = interaction.options.getString('name') || `${TYPE}-storage`

        guild.channels.create(NAME, {
            type: 'text',
            parent: category.id
        }).then(c => {
            c.send({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(`${cap(TYPE)} Storage - ${NAME}`)
                    .setDescription('PLACEHOLDER_TEXT')
                    .setTimestamp()
                    .setFooter({ text: ee.footertext, iconURL: ee.footericon})
                ]   
            }).then(m => {
                INVENTORY_FILE[TYPE][c.id] = {
                    "msgID": m.id,
                    'createdAt': `${today.format('DD-MM-YYYY HH:mm:ss')} AEDT`,
                    'createdBy': `${member.user.tag} [ID: ${member.id}]`,
                    'name': NAME,
                    "storage": {},
                    "logs": []
                }

                fs.writeFileSync('./database/inventory.json', JSON.stringify(INVENTORY_FILE, null, 4))
                
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`${settings.emotes.check} Storage Created: **${NAME}** ${c}`)
                    ],
                    ephemeral: true
                })
            })           
        })

    }
}