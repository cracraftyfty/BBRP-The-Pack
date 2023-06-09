//Import Modules
const { MessageEmbed } = require("discord.js");
const settings = require('../database/settings.json');
const Discord = require('discord.js')
const fs = require('fs')
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!customId.startsWith('delete-')) return;

    

    //READ FILES
    let INVENTORY_FILE = JSON.parse(fs.readFileSync('./database/inventory.json'))

    let storageID = interaction.channel.id

    let type = interaction.channel.parent.id
    if(type === '1032264559358115890') type = 'house'
    if(type === '1032264615805063189') type = 'vehicle'

    delete INVENTORY_FILE[type][storageID]
    
    interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription('Storage Deletion in progres...')   
        ],
        components: [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId(`recount`)
                    .setLabel('Storage will delete in 10 seconds')
                    .setEmoji(settings.emotes.check)
                    .setStyle('SECONDARY')
                    .setDisabled(true)          
            )
        ]
    })

    setTimeout(() => {
        //LOG MESSAGE
        client.channels.cache.get('1032269005899173898').send({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`[**||**] Storage: **${interaction.channel.name}** deleted by ${interaction.member} [${interaction.member.user.tag}]`)
            ]
        })
        interaction.channel.delete()
        delete INVENTORY_FILE[type][storageID]
        fs.writeFileSync('./database/inventory.json', JSON.stringify(INVENTORY_FILE, null, 4))
    }, 10000)
}