const { Wit } = require('node-wit');
const config = require('./config');

const client = new Wit({
    accessToken: config.witToken,
});

const send = async (message) => {
    try {
        const data = await client.message(message, {});
        return data;
    } catch (error) {
        return error;
    }
};

module.exports = {
    send
};
