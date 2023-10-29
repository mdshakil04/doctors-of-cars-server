const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
// --------------------------
// console.log(process.env.DB_PASS)
// console.log(process.env.DB_USER)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l8rzo73.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const serviceCollection = client.db('doctorsOfCars').collection('services');
    const bookingCollection = client.db('doctorsOfCars').collection('bookings')

    app.get('/services', async(req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/services/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id) }
      //  Copy Options from mongodb collections docs
      const options = {
          projection: { title: 1, price: 1, service_id: 1, img: 1 },
      }
      const result = await serviceCollection.findOne(query, options);
      res.send(result);
    })
    // Booking
    // 2 Get Specific data
    app.get ('/bookings', async (req, res) =>{
      console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = { email: req.query.email}
      }
      const cursor = bookingCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })


    // 1
    app.post('/bookings', async (req, res) =>{
      const booking = req.body;
      console.log(booking)
      const result = await bookingCollection.insertOne(booking);
      res.send(result);

    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Doctors of Cars server is Running')
})
// ----------------------------
app.listen(port, () => {
    console.log(`Doctors of cars Server is running on port ${port}`)
})