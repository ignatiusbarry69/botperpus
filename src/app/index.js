const { Telegraf } = require('telegraf')
const { v4: uuidv4 } = require('uuid');
const express = require('express')
const config = require('../conf/config')
const mongo = require('../conf/mongo')
const wit = require('./wit')
const controller = require('./controller')

const app = express()
const bot = new Telegraf(config.botToken)

// const sessionId = uuidv4();

// bot.on('text', async (ctx) => {
//     const user = ctx.message.from.first_name + " " + ctx.message.from.last_name;
//     console.log(`Received message from ${user}: ${ctx.message.text}\n`);
//     console.log(JSON.stringify(ctx.message.from.id));

//     const id = ctx.message.from.id
//     const resp = await mongo.contextCollection.findOne({id:id})
//     console.log(JSON.stringify(resp));

//     if(resp){
//       await wit.startConvo(sessionId, resp.ctx, ctx.message.text)
//       .then((payload) => {
//           console.log(sessionId);
//           console.log(JSON.stringify(payload));
//           return mongo.contextCollection.updateOne({ id: id }, { $set: { ctx: payload.context_map } })
//                 .then(() => {
//                     ctx.reply(payload.response.text);
//                 })
//                 .catch((error) => {
//                     console.error("Error updating context map in MongoDB:", error);
//                 });
//       })
//       .catch((error) => {
//           console.error("Error:", error);
//       });
//     }else {
//       const newEntry = { id: id, ctx: {} };
//       await mongo.contextCollection.insertOne(newEntry)
//           .then(() => {
//               return wit.startConvo(sessionId, {}, ctx.message.text);
//           })
//           .then((payload) => {
//               console.log(sessionId);
//               console.log(JSON.stringify(payload));
//               return mongo.contextCollection.updateOne({ id: id }, { $set: { ctx: payload.context_map } })
//                 .then(() => {
//                     ctx.reply(payload.response.text);
//                 })
//                 .catch((error) => {
//                     console.error("Error updating context map in MongoDB:", error);
//                 });
//           })
//           .catch((error) => {
//               console.error("Error:", error);
//           });
//   }
// });
const sessionId = uuidv4();

bot.on('text', async (ctx) => {
    const user = ctx.message.from.first_name + " " + ctx.message.from.last_name;
    console.log(`Received message from ${user}: ${ctx.message.text}\n`);
    console.log(JSON.stringify(ctx.message.from.id));

    const id = ctx.message.from.id;
    const resp = await mongo.contextCollection.findOne({ id: id });

    const handleConversation = async (context) => {
      let witPayload;
      return wit.startConvo(sessionId, context, ctx.message.text)
          .then((payload) => {
              console.log(sessionId);
              console.log(JSON.stringify(payload));
              witPayload = payload;
              return mongo.contextCollection.updateOne({ id: id }, { $set: { ctx: payload.context_map } });
          })
          .then(() => {
              ctx.reply(witPayload.response.text);
          })
          .catch((error) => {
              console.error("Error wit:", error);
          });
  };
  

    if (resp) {
        await handleConversation(resp.ctx);
    } else {
        const newEntry = { id: id, ctx: {} };
        await mongo.contextCollection.insertOne(newEntry);
        await handleConversation({});
    }
});




bot.telegram.setWebhook(`${config.webhookDomain}msg`)
app.use(bot.webhookCallback('/msg'))

app.get('/', (req, res) => {
  res.send('Merry Christmast!')
})

app.listen(process.env.PORT, () => {
  console.log(`listen on port ${config.port}!`)
})
