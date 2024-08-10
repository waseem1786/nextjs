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

             // If an _id is provided, use it to attempt an update; otherwise, add a new product
             const filter = productData._id ? { _id: new ObjectId(productData._id) } : {};

             // Remove _id from productData if it exists, to prevent modification of the primary key
             delete productData._id;

             // Upsert the product (update if exists, insert if not)
             const result = await collection.updateOne(filter, { $set: productData }, { upsert: true });

             if (result.upsertedCount > 0) {
                 res.status(201).json({
                     message: "Product added successfully",
                     productId: result.upsertedId._id
                 });
             } else {
                 res.status(200).json({
                     message: "Product updated successfully"
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