//Import Modules
const { MessageEmbed } = require("discord.js");
const settings = require('../database/settings.json');
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!customId.startsWith('role-')) return;

    let _roleID = customId.split('-')[1]
    let role = await guild.roles.cache.find(r => r.id === _roleID)

    let _logChannel = await client.channels.cache.get('1115296778552627231')


    if (member.roles.cache.some(role => role.id === _roleID)) {
        member.roles.remove(role)
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.check} ${role} has been removed from your profile`)
            ],
            ephemeral: true
        })

        _logChannel.send({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.check} ${role} has been removed from ${member}`)
                .setTimestamp()
                .setFooter({
                    text: `${member.user.tag} [ID: ${member.id}]`
                })
            ]
        })
    }else{
        member.roles.add(role)
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} ${role} assigned successfully`)
            ],
            ephemeral: true
        })

        _logChannel.send({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} ${role} assigned successfully to ${member}`)
                .setTimestamp()
                .setFooter({
                    text: `${member.user.tag} [ID: ${member.id}]`
                })
            ]
        })
    }
    console.log(role.name)

    
}