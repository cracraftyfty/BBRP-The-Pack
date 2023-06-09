//Import Modules
const { MessageEmbed } = require("discord.js");
const settings = require('../database/settings.json');
const fs = require('fs')
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals');
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!customId.startsWith('vote-')) return;
    
    //Read Poll File
    let PollFile = JSON.parse(fs.readFileSync(`./database/polls.json`))
    
    if(PollFile[interaction.message.id].vote.entries.hasOwnProperty(member.id)){
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} You have already voted, Please wait for the results`)
            ],
            ephemeral: true
        })
    }


    let _votePoint = customId.split("-")[1]
    
    //Create modal
    let comps = [
        new TextInputComponent() 
            .setCustomId(`reason`)
            .setLabel("Vote Reason")
            .setStyle("LONG")
            .setMinLength(3)
            .setMaxLength(150)
            .setPlaceholder(`Enter the reason for your vote [Vote Point Selected: ${_votePoint}]`)
            .setRequired(true)
    ]

    discordModals(client);
    const modal = new Modal() 
    .setCustomId(`voteReason-${_votePoint}`)
    .setTitle("Car Vote")
    .addComponents(comps);
    await showModal(modal, {
        client: client,
        interaction: interaction
    }).catch(e => {
        console.log(e.message ? e.message : e);
    })
}