//Import Modules
const { MessageEmbed } = require("discord.js");
const ee = require(`../../botconfig/embed.json`);
const cap = require('../../functions/cap.js');
const settings = require('../../database/settings.json');
const unix = require("unix-timestamp");
const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
    name: "create",
    description: "Create a poll",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: ["1039443203411152916"], 
    alloweduserids: [],
    options: [
        {"String": { name: "car_name", description: "Name of the vehicle", required: true }},
        {"String": { name: "image_link", description: "Enter the image URL", required: true }},
        {"String": { name: "description", description: "Optional description of the vehicle", required: false }}
    ],
    run: async (client, interaction) => {
        const {guild, member, customId} = interaction;

        let input = {
            "name": interaction.options.getString('car_name'),
            "image": interaction.options.getString('image_link'),
            "description":  interaction.options.getString('description')
        }

        //Check if description exception
        if(!input.description) input.description = 'No description added'

        //Check if submitted string is a link
        if(!input.image.startsWith('https://cdn.discordapp.com/attachments/') && !input.image.startsWith('https://i.imgur.com/') && input.image.startsWith('http://media.discordapp.net/')) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} Please enter a valid image URL`)
            ],
            ephemeral: true
        })

        //Process reply
        let pollChannel = await client.channels.cache.get('1114882841646477423')
        
        pollChannel.send({
            embeds: [
                new MessageEmbed()
                .setColor('YELLOW')
                .setDescription(`${input.description}`)
                .setTitle(cap(input.name))
                .setURL(input.image)
                .setImage(input.image)
                .setTimestamp()
                .setFooter({
                    text: ee.footertext,
                    iconURL: ee.footericon
                })
            ],
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId(`vote-1`)
                    .setLabel(`1`)
                    .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                    .setCustomId(`vote-2`)
                    .setLabel(`2`)
                    .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                    .setCustomId(`vote-3`)
                    .setLabel(`3`)
                    .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                    .setCustomId(`vote-4`)
                    .setLabel(`4`)
                    .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                    .setCustomId(`vote-5`)
                    .setLabel(`5`)
                    .setStyle('PRIMARY')
                ),
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId(`vote-6`)
                    .setLabel(`6`)
                    .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                    .setCustomId(`vote-7`)
                    .setLabel(`7`)
                    .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                    .setCustomId(`vote-8`)
                    .setLabel(`8`)
                    .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                    .setCustomId(`vote-9`)
                    .setLabel(`9`)
                    .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                    .setCustomId(`vote-10`)
                    .setLabel(`10`)
                    .setStyle('PRIMARY')
                )
            ]
        }).then(async pollID => {
            //Read Poll File
            let pollFile = JSON.parse(fs.readFileSync(`./database/polls.json`))

            let logChannel = await client.channels.cache.get('1114756907232661624')

            await logChannel.send({
                embeds: [
                    new MessageEmbed()
                    .setColor('YELLOW')
                    .setDescription(`${input.description}`)
                    .setTitle(`${cap(input.name)}`)
                    .setURL(input.image)
                    .addFields(
                        {
                            name: "Total Points",
                            value: "0",
                            inline: true
                        },
                        {
                            name: "Maximum Points",
                            value: "Calculating...",
                            inline: true
                        },
                        {
                            name: "Total Entries",
                            value: "0",
                            inline: true
                        }
                    )
                    .setImage(input.image)
                    .setTimestamp()
                    .setFooter({
                        text: ee.footertext,
                        iconURL: ee.footericon
                    })
                ]
            }).then(m => {
                m.startThread({
                    name: `Vote Reasons`,
                    type: 'GUILD_PUBLIC_THREAD'
                }).then(t => {
                    
                    pollFile[pollID.id] = {
                        "title": input.name,
                        "status": true,
                        "description": input.description,
                        "image": input.image,
                        "logMessageID": m.id,
                        "threadID": t.id,
                        "startedAt": unix.now(),
                        "vote": {
                            "entries": {}
                        }
                    }
                    fs.writeFileSync(`./database/polls.json`, JSON.stringify(pollFile, null, 4))
                })
            })
        })
    }
}