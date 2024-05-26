const { MongoClient, ServerApiVersion } = require("mongodb");
const config = require('./config');

const uri = `mongodb://${config.mgUser}:${config.mgPassword}@${config.mgHost}:${config.mgPort}`;
const client = new MongoClient(uri,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);
const myDB = client.db(config.mgDatabase);

const contextCollection = myDB.collection("context");
const conversationCollection = myDB.collection("conversation");


module.exports = {
	contextCollection,
    conversationCollection
};