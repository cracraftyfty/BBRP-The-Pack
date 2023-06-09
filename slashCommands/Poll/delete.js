//Import Modules
const { MessageEmbed } = require("discord.js");
const cap = require('../../functions/cap.js');
const settings = require('../../database/settings.json');
const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
    name: "delete",
    description: "Create a poll",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: ["1039443203411152916"], 
    alloweduserids: [],
    options: [
        {"String": { name: "message_id", description: "Enter the message ID of the Poll", required: true }}
    ],
    run: async (client, interaction) => {
        const {guild, member, customId} = interaction;
        
        let _enteredID = interaction.options.getString('message_id')
        
        //Read Poll File
        let PollFile = JSON.parse(fs.readFileSync(`./database/polls.json`))

        //Check if its already deleted

        if(PollFile.hasOwnProperty(_enteredID)){
            if(!PollFile[_enteredID].status) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${settings.emotes.wrong} The poll [**${cap(PollFile[_enteredID].title)}**] has already been deleted or finished`)
                ],
                ephemeral: true
            })

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('ORANGE')
                    .setDescription(`${settings.emotes.error} Are you sure you want to delete the Poll?`)
                    .setFooter({
                        text: `Please dismiss this message if you dont want the poll to delete`
                    })
                ],
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                        .setCustomId(`deletePoll-${_enteredID}`)
                        .setLabel(`Delete Poll`)
                        .setEmoji(settings.emotes.error)
                        .setStyle('DANGER')
                    ),
                ],
                ephemeral: true
            })
        }else return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} Please enter a valid message ID`)
            ],
            ephemeral: true
        })    
    }
}