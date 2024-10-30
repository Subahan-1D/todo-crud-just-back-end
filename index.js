const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;

// middleware

app.use(express.json())

const uri =
  "mongodb+srv://todoUser:Ja2fplGX2M4zUiFj@cluster0.yqmtelq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoose.connect(uri);
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.get("/todos", async (req, res) => {
      // const todos = await todosCollection.find({}).toArray();
      res.send(todos);
    });

    app.post("/newdata" , async (req,res)=>{
      const todoData = req.body ;
      // const newData = await anyCollection.insertOne(todoData)
      res.send(newData)
    })
    app.get('/newdata' , async(req,res)=>{
      // const newdata = await anyCollection.find({}).toArray()
      res.send(newdata)
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
main().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running ");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
