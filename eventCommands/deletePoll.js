//Import Modules
const { MessageEmbed } = require("discord.js");
const settings = require('../database/settings.json');
const Discord = require('discord.js')
const fs = require('fs')
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!customId.startsWith('deletePoll-')) return;

    //Fetch Poll ID
    let _pollID = customId.split('-')[1]

    if(interaction.channel.id != '1114882841646477423') return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} This is not a poll channel`)
        ],
        ephemeral: true
    })
    
    //Update the button so it cannot be spammed
    interaction.update({
        components: [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId(`defdsfsff`)
                .setLabel(`Poll has been deleted`)
                .setEmoji(settings.emotes.check)
                .setStyle('SUCCESS')
                .setDisabled(true)
            )
        ]
    })

    //Update the File for status
    let PollFile = JSON.parse(fs.readFileSync(`./database/polls.json`))
    PollFile[_pollID].status = false
    fs.writeFileSync(`./database/polls.json`, JSON.stringify(PollFile, null, 4))

    //Delete Embed
    let _pollChannel = await client.channels.cache.get('1114882841646477423')
    let _pollMessage = await _pollChannel.messages.fetch(_pollID)
    _pollMessage.delete()

    //Update Log File
    let _logChannel = await client.channels.cache.get('1114756907232661624')
    let _logMessageID = await _logChannel.messages.fetch(PollFile[_pollID].logMessageID)

    _logMessageID.embeds[0].setDescription(`${settings.emotes.error} **THIS POLL HAS BEEN DELETED** ${settings.emotes.error}`)
    _logMessageID.embeds[0].setColor('RED')

    //Eidt the message
    _logMessageID.edit({
        embeds:[_logMessageID.embeds[0]]
    })

    //Find the Thread
    let _thread = await _logChannel.threads.cache.find(t => t.id === PollFile[_pollID].threadID)
    _thread.send({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.error} **${member}** deleted the Poll ${settings.emotes.error}`)
            .setFooter({
                text: `${member.user.tag} [ID: ${member.id}]`,
                iconURL: member.avatarURL()
            })
            .setTimestamp()
        ]
    })
    
}