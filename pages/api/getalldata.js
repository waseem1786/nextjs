import { MongoClient } from "mongodb";

export default async function (req, res) {
    if (req.method === "GET") {
        
        console.log(process.env.MONGODB_URI)
        const client = new MongoClient(process.env.MONGODB_URI);

        try {
            await client.connect();

            console.log('connected')

            // Choose a name for your database
            const database = client.db("sample_mflix");

            // Choose a name for your collection
            const collection = database.collection("sessions");
            const allData = await collection.find({}).toArray();

            res.status(200).json(allData);
        } catch (error) {
            console.log('error',error)
            res.status(500).json({ message: "Something went wrong!" });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: "Method not allowed!" });
    }
}