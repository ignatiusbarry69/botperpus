const { Wit } = require('node-wit');
const config = require('../conf/config');

const client = new Wit({
    accessToken: config.witToken,
});

// const interactive = interactive(client)


const send = async (message) => {
    try {
        const data = await client.message(message, {});
        return data;
    } catch (error) {
        return error;
    }
};

const startConvo = async (sessionId, ctx_map, message) => {
    try {
        const data = await client.event(sessionId, ctx_map, message);
        return data;
    } catch (error) {
        console.log("masuk error");

        return error;
    }
};

module.exports = {
    send,
    startConvo
};
