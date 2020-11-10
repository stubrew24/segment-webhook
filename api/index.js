const connectToDatabase = require("./dbConnect");

module.exports = async (req, res) => {
	const { type, timestamp, anonymousId } = req.body;
	let data = { timestamp, anonymousId };

	switch (type) {
		case "track":
			{
				const { event, properties } = req.body;
				data.event = event;
				data.properties = properties;
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

	res.status(200).json({ body: "success" });
};
