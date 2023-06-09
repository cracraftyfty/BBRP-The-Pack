//Import Modules
const { MessageEmbed } = require("discord.js");
const settings = require('../database/settings.json');
const Discord = require('discord.js')
const fs = require('fs')
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!customId.startsWith('conclude-')) return;

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

    //Read Files
    let PollFile = JSON.parse(fs.readFileSync(`./database/polls.json`))

    //Fetch total points
    let stats = {
        _totalPoints : 0,
        _entries: 0,
        _maxPoints: 0
    }
    
    for(let keys in PollFile[_pollID].vote.entries){
        stats._entries += 1
        stats._maxPoints += 10
        stats._totalPoints += PollFile[_pollID].vote.entries[keys].point
    }

    //Update the File for status
    PollFile[_pollID].status = false
    fs.writeFileSync(`./database/polls.json`, JSON.stringify(PollFile, null, 4))

    //Delete Embed
    let _pollChannel = await client.channels.cache.get('1114882841646477423')
    let _pollMessage = await _pollChannel.messages.fetch(_pollID)

    _pollMessage.embeds[0].setColor('GREEN')
    _pollMessage.edit({
        embeds: [_pollMessage.embeds[0]],
        components: [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId(`votrfgse-1`)
                .setLabel(`Poll has Ended`)
                .setEmoji('🎉')
                .setStyle('SUCCESS')
                .setDisabled(true)
            )
        ]
    })

    //Update Log File
    let _logChannel = await client.channels.cache.get('1114756907232661624')
    let _logMessageID = await _logChannel.messages.fetch(PollFile[_pollID].logMessageID)

    _logMessageID.embeds[0].setDescription(`${settings.emotes.check} **THIS POLL HAS ENDED** ${settings.emotes.check}`)
    _logMessageID.embeds[0].setColor('GREEN')

    //Eidt the message
    _logMessageID.edit({
        embeds:[_logMessageID.embeds[0]]
    })

    //Find the Thread
    let _thread = await _logChannel.threads.cache.find(t => t.id === PollFile[_pollID].threadID)
    _thread.send({
        embeds: [
            new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${settings.emotes.error} **${member}** ended the Poll ${settings.emotes.check}`)
            .addFields(
                {
                    name: `Results`,
                    value: `${stats._totalPoints}/${stats._maxPoints}`,
                    inline: true
                },
                {
                    name: `Total Entries`,
                    value: `${stats._entries}`,
                    inline: true
                }
            )
            .setFooter({
                text: `${member.user.tag} [ID: ${member.id}]`,
                iconURL: member.avatarURL()
            })
            .setTimestamp()
        ]
    })

    //Update the button so it cannot be spammed
    interaction.update({
        components: [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId(`defdsfsff`)
                .setLabel(`Poll has been concluded`)
                .setEmoji(settings.emotes.check)
                .setStyle('SUCCESS')
                .setDisabled(true)
            )
        ]
    })
}