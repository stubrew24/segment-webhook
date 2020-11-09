const MongoClient = require("mongodb").MongoClient;
const url = require("url");

let cachedDb = null;

async function connectToDatabase(uri) {
	if (cachedDb) {
		return cachedDb;
	}

	const client = await MongoClient.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
	});
	const db = await client.db(url.parse(uri).pathname.substr(1));
	cachedDb = db;
	return db;
}

module.exports = connectToDatabase;
