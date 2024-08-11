import { MongoClient } from "mongodb";

export default async function (req, res) {
    if (req.method === 'POST') {

        console.log(process.env.MONGODB_URI)
        const client = new MongoClient(process.env.MONGODB_URI);

        try {
            await client.connect();

            console.log('connected')

            // Choose a name for your database
            const database = client.db("e_store");

            // Choose a name for your collection
            const collection = database.collection("inventory");

            // Get product data from request body
            const productData = req.body;


            // Initialize filter object
            let filter = {};

            // Check if an _id is provided
            if (productData._id) {
                filter = { _id: new ObjectId(productData._id) };
                // Remove _id from productData to prevent modification of the primary key
                delete productData._id;

                // Attempt to update the existing document
                const result = await collection.updateOne(filter, { $set: productData });

                if (result.matchedCount > 0) {
                    res.status(200).json({
                        message: "Product updated successfully"
                    });
                } else {
                    res.status(404).json({
                        message: "Product not found"
                    });
                }
            } else {
                // If no _id is provided, insert a new document
                const result = await collection.insertOne(productData);

                res.status(201).json({
                    message: "Product added successfully",
                    productId: result.insertedId
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to add or update product" });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};