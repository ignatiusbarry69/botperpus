const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    botToken: process.env.BOT_TOKEN ?? '',
    witToken: process.env.WIT_TOKEN ?? '',
    port: process.env.PORT ?? 8000,
    webhookDomain: process.env.WEBHOOK ?? '',
    pgDatabase: process.env.PG_DB ?? '',
    pgPassword: process.env.PG_PW ?? '',
    pgUser: process.env.PG_USER ?? '',
    pgHost: process.env.PG_HOST ?? '',
    pgPort: process.env.PG_PORT ?? 5432
};