const { Telegraf } = require('telegraf')
const express = require('express')
const config = require('./config')
const wit = require('./wit')
const controller = require('./controller')

const app = express()

const bot = new Telegraf(config.botToken)

bot.on('text', async (ctx) => {
    const user = ctx.message.from.first_name + " " + ctx.message.from.last_name
    // console.log(ctx.message.text)
    console.log(`Received message from ${user}: ${ctx.message.text}`);
    const payload = await wit.send(ctx.message.text)
    console.log(payload);
    const response = controller.execute(payload, ctx.from.first_name)
    ctx.reply(response);
  });  


bot.telegram.setWebhook(`${config.webhookDomain}msg`)
app.use(bot.webhookCallback('/msg'))

app.get('/', (req, res) => {
  res.send('Merry Christmast!')
})

app.listen(process.env.PORT, () => {
  console.log(`listen on port ${config.port}!`)
})
