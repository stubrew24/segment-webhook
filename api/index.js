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

module.exports = async (req, res) => {
	const { type, properties, timestamp } = req.body;
	let data = { properties, timestamp };

	switch (type) {
		case "track":
			{
				const { event } = req.body;
				data.event = event;
			}
			break;
		case "page":
			{
				const { name } = req.body;
				data.name = name;
			}
			break;
		case "identify":
			{
				const { userId, traits } = req.body;
				data.userId = userId;
				data.traits = traits;
			}
			break;
	}

	const db = await connectToDatabase(process.env.MONGODB_URI);

	const allCollection = await db.collection("all");
	await allCollection.insertOne({ type, ...data });

	const typeCollection = await db.collection(type);
	await typeCollection.insertOne({ ...data });

	res.status(200);
};
