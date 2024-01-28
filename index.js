const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


/// middleware 
app.use(cors());
app.use(express.json());






// console.log(process.env.TOY_PASS)

const uri = `mongodb+srv://${process.env.TOY_USER}:${process.env.TOY_PASS}@cluster0.hun2r3q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {


    // creat a database in mongodb 
    const productsCollection = client.db('assinment_11').collection('products');
    const orderCollection = client.db('assinment_11').collection('orderProduct');

    // find multi Products in mongodb database
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // find a one products data in mongodb database 
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      // const options = {
      //   // Include only the `title` and `imdb` fields in the returned document
      //   projection: {  title: 1, name: 1 },
      // };
      // const result = await productsCollection.findOne(query, option);
      const result = await productsCollection.findOne(query);
      res.send(result)
    })


    //--------------- order start

    // insert a object data from client sit in mongodb database
    app.post('/orderProduct', async (req, res) => {
      const productOrder = req.body;
      console.log(productOrder);
      const result = await orderCollection.insertOne(productOrder);
      res.send(result)

    });

    app.get('/orderProduct', async (req, res) => {

      console.log(req.query.email);
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await orderCollection.find(query).toArray();
      res.send(result)
    })













    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);











app.get('/', (req, res) => {
  res.send('Hello Ashik Broooo')
})


app.listen(port, () => {
  console.log(`Hey Ashik Toy Shop is running on port ${port}`)
})