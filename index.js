const express = require("express");
const app = express();
var jwt = require("jsonwebtoken");
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

    app.get(
      "/todo",
      async (req, res, next) => {
        console.log("ami tor badha");
        console.log(req.headers);
        const token = req.headers.authorization;
        const privatekey = "secret";
        const verifiedToken = jwt.verify(token, privatekey);
        console.log(verifiedToken);
        if (verifiedToken) {
          next();
        }
        else{
          res.send("You are not authorization")
        }
      },
      async (req, res) => {
        const todos = await Todo.find({});
        res.send(todos);
      }
    );
    app.post("/todo", async (req, res) => {
      const todoData = req.body;
      // const todo = new Todo(todoData);
      // todo.save();
      const todo = await Todo.create(todoData);
      console.log(todo);
      res.send(todo);
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
        const payload = {
          name: user.name,
          email: user.email,
        };
        const privatekey = "secret";
        const expireTime = "2d";
        const accessToken = jwt.sign(payload, privatekey, {
          expiresIn: expireTime,
        });
        const userResponse = {
          message: "LodgedIn Successfully",
          data: {
            accessToken,
          },
        };
        res.send(userResponse);
      } else {
        res.send("Email or Password not Correct");
      }
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
