const express = require('express');
const cors = require('cors');
require('dotenv').config()
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const port = process.env.PORT || 5000
const app = express()


app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.33tct4k.mongodb.net/?retryWrites=true&w=majority`;

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

        const productCollection = client.db("productDB").collection("product")

        app.get("/product", async (req, res) => {
            const result = await productCollection.find().toArray()
            res.send(result)
        })

        app.get("/product/:id", async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product)
            res.send(result)
        })

        app.put("/product/:id", async (req, res) => {
            const id = req.params.id
            const product = req.body
            const query = {
                _id: new ObjectId(id)
            }
            const options = {
                upsert: true
            }
            const updateProduct = {
                $set : {
                    name: product.name,
                    brandName: product.brandName,
                    productType: product.productType,
                    price: product.price,
                    rating: product.rating,
                    productImageURL: product.productImageURL,
                    detailedDescription: product.detailedDescription,

                }
            }

            const result = await productCollection.updateOne(query, updateProduct, options)
            res.send(result)
        })

        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id
            // const product = req.body
            const query = {
                _id: new ObjectId(id)
            }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server is running.....")
})

app.listen(port, () => {
    console.log(`Server running Port is ${port}`);
})