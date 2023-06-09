//Import Modules
const { MessageEmbed } = require("discord.js");
const settings = require('../../database/settings.json');
const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: "conclude",
    description: "Ends the poll and posts result",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: ["1039443203411152916"], 
    alloweduserids: [],
    options: [
        {"String": { name: "message_id", description: "Enter the message ID of the Poll", required: true }}
    ],
    run: async (client, interaction) => {
        const {guild, member, customId} = interaction;
        
        let _enteredID = interaction.options.getString('message_id');
        
        //Read Poll File
        let PollFile = JSON.parse(fs.readFileSync(`./database/polls.json`));

        if(PollFile.hasOwnProperty(_enteredID)){
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`${settings.emotes.error} Are you sure you want to conclude the Poll?`)
                    .setFooter({
                        text: `Please dismiss this message if you dont want the poll to conclude`
                    })
                ],
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                        .setCustomId(`conclude-${_enteredID}`)
                        .setLabel(`Find Results and End the Poll`)
                        .setEmoji(settings.emotes.loading)
                        .setStyle('PRIMARY')
                    )
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