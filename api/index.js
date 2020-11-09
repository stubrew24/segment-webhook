const connectToDatabase = require("./dbConnect");

module.exports = async (req, res) => {
	const { type, timestamp } = req.body;
	let data = { timestamp };

	switch (type) {
		case "track":
			{
				const { event, properties } = req.body;
				data.event = event;
			}
			break;
		case "page":
			{
				const { name, properties } = req.body;
				data.name = name;
				data.properties = properties;
			}
			break;
		case "identify":
			{
				const { userId, traits, properties } = req.body;
				data.userId = userId;
				data.traits = traits;
				data.properties = properties;
			}
			break;
	}

	const db = await connectToDatabase(process.env.MONGODB_URI);

	const allCollection = await db.collection("all");
	await allCollection.insertOne({ type, ...data });

	const typeCollection = await db.collection(type);
	await typeCollection.insertOne({ ...data });

	res.status(200).json({ body: "success" });
};
