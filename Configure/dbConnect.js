const { MongoClient } = require("mongodb");



const uri = process.env.URI;

const client = new MongoClient(uri);

const dbConnect = async () => {
    try {
        await client.connect();
        console.log("db connected")
    } catch (error) {
        console.log(error.message, error.status)
    }
}


module.exports = { client, dbConnect }