const connectToDatabase = require("./dbConnect");

const allowCors = (fn) => async (req, res) => {
	res.setHeader("Access-Control-Allow-Credentials", true);
	res.setHeader("Access-Control-Allow-Origin", "*");
	// another common pattern
	// res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET,OPTIONS,PATCH,DELETE,POST,PUT"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
	);
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}
	return await fn(req, res);
};

const handler = async (req, res) => {
	const db = await connectToDatabase(process.env.MONGODB_URI);
	const results = await db.collection(req.query.type).find().toArray();

	res.status(200).json(results);
};

module.exports = allowCors(handler);
