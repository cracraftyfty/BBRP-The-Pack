//here the event starts
const config = require("../../botconfig/config.json")
const { change_status } = require("../../handlers/functions");
module.exports = client => {
  
  try{
    try{
      console.log(`[ThePack] Discord Bot is online!`.bold.brightGreen+` /--/ ${client.user.tag} /--/ `)
    }catch{ /* */ }
    change_status(client);
    //loop through the status per each 10 minutes
    setInterval(()=>{
      change_status(client);
    }, 15 * 1000);
  
  } catch (e){
    console.log(String(e.stack).grey.italic.dim.bgRed)
  }
}
