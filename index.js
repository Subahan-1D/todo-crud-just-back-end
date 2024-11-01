const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;

// mongoose Schema

const todoSchema = new mongoose.Schema({
  name: String,
  roll: Number,
  registration: Number,
});

const Todo = mongoose.model("Todos", todoSchema);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("User", userSchema);

// middleware
app.use(express.json());

const uri =
  "mongodb+srv://todoUser:Ja2fplGX2M4zUiFj@cluster0.yqmtelq.mongodb.net/todoDB?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoose.connect(uri);
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.post("/todo", async (req, res) => {
      const todoData = req.body;
      // const todo = new Todo(todoData);
      // todo.save();
      const todo = await Todo.create(todoData);
      console.log(todo);
      res.send(todo);
    });

    app.get("/todo", async (req, res) => {
      const todos = await Todo.find({});
      res.send(todos);
    });

    app.get("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const todos = await Todo.findById(id);
      res.send(todos);
    });

    // put and patch
    app.patch("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const todos = await Todo.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      res.send(todos);
    });

    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      await Todo.findByIdAndDelete(id);
      res.send("Deleted Successfully");
    });

    // register
    app.post("/register", async (req, res) => {
      const userData = req.body;
      console.log(userData);
      const todo = await User.create(userData);
      res.send(todo);
    });

    // login
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const user = await User.findOne({
        email,
        password,
      });
      if (user) {
        const userResponse = {
          message: "LodgedIn Successfully",
          data:{
            name:user.name,
            email:user.email
          },
        };
        res.send(userResponse);
      }
      res.send("Email or Password not Correct");
    });
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
