//Import Modules
const { MessageEmbed } = require("discord.js");
const settings = require('../database/settings.json');
const fs = require('fs')
const moment = require('moment-timezone')
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if (interaction.type !== 'MODAL_SUBMIT') return;
    if(customId.startsWith('voteReason-')){

        //Read Poll File
        let PollFile = JSON.parse(fs.readFileSync(`./database/polls.json`))

        //Declare Variables
        let _votePoint = parseInt(customId.split('-')[1])
        let _messageID = interaction.message.id
        let _memberID = member.id
        let _voteReason = interaction.fields.getTextInputValue('reason');

        //Check if poll Exists
        if(PollFile.hasOwnProperty(_messageID)){
            if(PollFile[_messageID].vote.entries.hasOwnProperty(_memberID)){
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`${settings.emotes.wrong} You have already voted, Please wait for the results`)
                    ],
                    ephemeral: true
                })
            }else{
                //Add memebr in poll
                PollFile[_messageID].vote.entries[_memberID] = {
                    point: _votePoint,
                    reason: _voteReason
                }
                fs.writeFileSync(`./database/polls.json`, JSON.stringify(PollFile, null, 4))

                //Post a message in the thread
                let _threadChannel = await client.channels.cache.get('1114756907232661624')
                let _thread = _threadChannel.threads.cache.find(x => x.id === PollFile[_messageID].threadID);

                //Fetch total points
                let stats = {
                    _totalPoints : 0,
                    _entries: 0,
                    _maxPoints: 0
                }
                
                for(let keys in PollFile[_messageID].vote.entries){
                    stats._entries += 1
                    stats._maxPoints += 10
                    stats._totalPoints += PollFile[_messageID].vote.entries[keys].point
                }
                
                //Update log message
                _threadChannel.messages.fetch(PollFile[_messageID].threadID)
                .then(m => {
                    m.embeds[0].fields[0].value = `${stats._totalPoints}`
                    m.embeds[0].fields[1].value = `${stats._maxPoints}`
                    m.embeds[0].fields[2].value = `${stats._entries}`

                    m.edit({
                        embeds: [m.embeds[0]]
                    })
                })
                .catch(console.error);

                _thread.send({
                    embeds: [
                        new MessageEmbed()
                        .setColor('BLUE')
                        .setDescription(`**${member}** voted **(${_votePoint}/10)**`)
                        .addFields({
                            name: 'Vote Reason',
                            value: `${_voteReason}`
                        })
                        .setFooter({
                            text: `${member.user.tag} [ID: ${member.id}]`,
                            iconURL: member.avatarURL()
                        })
                        .setTimestamp()
                    ]
                })

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`${settings.emotes.check} Vote Registered successfully (**${_votePoint}/10**)`)
                        
                    ],
                    ephemeral: true
                })
            }
        }
    }
}