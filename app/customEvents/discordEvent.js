const discordLib = require('../middleware/utils/discord')

const discordCreateEvent = (eventEmitter) => {
  console.log('listening @discordLibEvent')
  eventEmitter.on('sendDiscordWebhook', async (title, message, channelLink) => {
    if (!title) {
      console.warn('Title not supplied to sendDiscordWebhook')
      return
    }
    if (!message) {
      console.warn('Message not supplied to sendDiscordWebhook', title)
      return
    }
    if (!message) {
      console.warn('Channel link not supplied to sendDiscordWebhook', title)
      return
    }
    await discordLib(title, message, channelLink)
  })
}

module.exports = discordCreateEvent
