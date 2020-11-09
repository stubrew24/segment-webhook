const connectToDatabase = require("./dbConnect");

module.exports = async (req, res) => {
	const db = await connectToDatabase(process.env.MONGODB_URI);
	const results = await db.collection(req.query.type).find().toArray();

	res.status(200).json(results);
};
