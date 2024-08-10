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
            const collection = database.collection("customers");

            const customerData = {
                email: req.body.email,
                fname: req.body.fname,
                lname: req.body.lname,
                hashedAndSaltedPassword: req.body.hashedAndSaltedPassword,
                emailVerified: req.body.emailVerified,
                address: {
                    country: req.body.address.country,
                    street1: req.body.address.street1,
                    street2: req.body.address.street2,
                    city: req.body.address.city,
                    state: req.body.address.state,
                    zip: req.body.address.zip,
                },
            };

            // Define filter for finding the customer by email
            const filter = { email: customerData.email };

            // Upsert the customer (update if exists, insert if not)
            const result = await collection.updateOne(filter, { $set: customerData }, { upsert: true });

            if (result.upsertedCount > 0) {
                res.status(201).json({
                    message: "Customer added successfully",
                    customerId: result.upsertedId._id
                });
            } else {
                res.status(200).json({
                    message: "Customer updated successfully"
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};