import { MongoClient } from "mongodb";
import { ObjectId } from 'mongodb';

export default async (req, res) => {
    if (req.method === 'POST') {
        try {
          const { id } = req.body;
       
        const client = new MongoClient(process.env.MONGODB_URI);

        await client.connect();

        console.log('connected')

        // Choose a name for your database
        const database = client.db("e_store");

        const collection = database.collection("customers");
        
        const customer = await collection.findOne({ _id: new ObjectId(id) },{ projection: { hashedAndSaltedPassword: 0 }} );

        console.log('customer',customer)
        
        if (!customer) {
          res.status(404).json({ message: 'Customer not found' });
        } else {
          res.status(200).json(customer);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  };