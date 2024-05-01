const { Telegraf } = require('telegraf')
const express = require('express')
const config = require('./config')
const wit = require('./wit')
const controller = require('./controller')

const app = express()

const bot = new Telegraf(config.botToken)

const { v4: uuidv4 } = require('uuid');

const sessionId = uuidv4();

let context_map = {};

bot.on('text', async (ctx) => {
    const user = ctx.message.from.first_name + " " + ctx.message.from.last_name;
    console.log(`Received message from ${user}: ${ctx.message.text}`);
    
    await wit.startConvo(sessionId, context_map, ctx.message.text)
        .then((payload) => {
            console.log(JSON.stringify(payload));
            const context_map_from_payload = payload.context_map;
            context_map = { ...context_map, ...context_map_from_payload };
            ctx.reply(payload.response.text);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});



bot.telegram.setWebhook(`${config.webhookDomain}msg`)
app.use(bot.webhookCallback('/msg'))

app.get('/', (req, res) => {
  res.send('Merry Christmast!')
})

app.listen(process.env.PORT, () => {
  console.log(`listen on port ${config.port}!`)
})
