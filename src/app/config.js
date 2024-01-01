const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    botToken: process.env.BOT_TOKEN ?? '',
    witToken: process.env.WIT_TOKEN ?? '',
    port: process.env.PORT ?? 8000,
    webhookDomain: process.env.WEBHOOK ?? ''
};