const fs = require('fs')
module.exports = async (client) => {
    const allevents = [];
    const event_files = fs.readdirSync(`./eventCommands/`).filter((file) => file.endsWith(".js"));
    for (const file of event_files) {
        try {
            const event = require(`../../eventCommands/${file}`)
            let eventName = file.split(".")[0];
            allevents.push(eventName);
            client.on('interactionCreate', event.bind(null, client));
        } catch (e) {
            console.log(e)
        }
    }
    
}