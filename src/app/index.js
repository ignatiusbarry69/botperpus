const { Telegraf } = require('telegraf')
const { v4: uuidv4 } = require('uuid');
const express = require('express')
const config = require('../conf/config')
const mongo = require('../conf/mongo')
const wit = require('./wit')
const controller = require('./controller')

const app = express()
const bot = new Telegraf(config.botToken)

const sessionId = uuidv4();

bot.on('text', async (ctx) => {
    const user = ctx.message.from.first_name;
    console.log(`Received message from ${user}: ${ctx.message.text}`);
    console.log(JSON.stringify(ctx.message.from.id));

    const id = ctx.message.from.id;
    const resp = await mongo.contextCollection.findOne({ id: id });
    console.log(resp)
    const handleConversation = async (context) => {
      let witPayload;
      return wit.startConvo(sessionId, context, ctx.message.text)
          .then((payload) => {
            //   console.log(sessionId);
              console.log(JSON.stringify(payload));
              witPayload = payload;
              return mongo.contextCollection.updateOne({ id: id }, { $set: { ctx: payload.context_map } });
          })
          .then(() => {
            controller.execute(witPayload)
            .then(answer => {
                const currentDate = new Date();
                const newConversation = { date: currentDate, id: id, nama: user, request: ctx.message.text, response: answer };
                mongo.conversationCollection.insertOne(newConversation);
                ctx.reply(answer);
            })
            .catch(error => {
                ctx.reply("Wah maaf, service itu lagi dibenerin, coba lagi nanti 🙏");
                console.error('Error executing controller:', error);
                // Handle the error if needed
            });
          })
          .catch((error) => {
              console.error("Error wit:", error);
          });
  };
  

    if (resp) {
        if(resp.ctx!=null){
          await handleConversation(resp.ctx);
        }else{
          await mongo.contextCollection.deleteOne({ id: id });
          const newEntry = { id: id, ctx: {} };
          await mongo.contextCollection.insertOne(newEntry);
          await handleConversation({});
        }
    } else {
        const newEntry = { id: id, ctx: {} };
        await mongo.contextCollection.insertOne(newEntry);
        await handleConversation({});
    }
});




bot.telegram.setWebhook(`${config.webhookDomain}msg`)
app.use(bot.webhookCallback('/msg'))

app.get('/', (req, res) => {
  res.send('<center style="font-size:40px;margin-top:23%">Bot Perpus UKDW Service 👋</center>')
})

app.listen(process.env.PORT, () => {
  console.log(`listen on port ${config.port}!`)
})
