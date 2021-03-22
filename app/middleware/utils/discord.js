// import { DISCORD_CHANNEL_LINK } from 'config';
const { MessageBuilder, Webhook } = require('discord-webhook-node')

const discordLib = async (title, message, channelLink) => {
  try {
    const hook = new Webhook(channelLink)
    const embed = new MessageBuilder()
      .setTitle(`${title}`)
      .setAuthor(
        'bitmamahq',
        'https://avatars.githubusercontent.com/u/43728975?s=400&u=24b17e6b86913b7e0ced6cd873060fac958d433b&v=4',
        'https://github.com/bitmamahq/bitmama-api-v2'
      )
      .setDescription(`${message}`)
    hook.send(embed)
    return Promise.resolve(true)
  } catch (err) {
    return Promise.reject(err)
  }
}

module.exports = discordLib
