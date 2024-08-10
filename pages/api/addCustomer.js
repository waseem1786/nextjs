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

            const customer = {
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

            // Insert the new customer
            await collection.insertOne(customer);

            res.status(200).json({ message: 'Customer added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};