const config = require('./config');

const pg = require('knex')({
    client: 'pg',
    connection: {
        host : config.pgHost,
        port : config.pgPort,
        user : config.pgUser,
        password : config.pgPassword,
        database : config.pgDatabase,
    },
    searchPath: ['knex', 'public'],
});

module.exports = pg;