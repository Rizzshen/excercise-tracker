const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("MongoDB connected");
let Person;
const personSchema = new mongoose.Schema({
  username: { type: String, required: true },
});
Person = mongoose.model("Person", personSchema);
let exercise;
const exerciseSchema = new mongoose.Schema({
  userId: { type: String },
  description: { type: String },
  duration: { type: Number },
  date: { type: String, default: () => new Date().toDateString() },
});
exercise = mongoose.model("exercise", exerciseSchema);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  let user = new Person({ username: req.body.username });
  let data = await user.save();
  res.json({ username: data.username, _id: data._id });
});

app.get("/api/users", async (req, res) => {
  try {
    let person = await Person.find();
    res.json(person);
  } catch {
    res.json({ err: "From get method" });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    let person = await Person.findOne({ _id: req.params._id });
    let exercise1 = new exercise({
      userId: person._id,
      description: req.body.description,
      date: req.body.date ? new Date(req.body.date).toDateString() : undefined,
      duration: req.body.duration,
    });
    let data = await exercise1.save();
    console.log(data);
    console.log(req.body);
    return res.json({
      _id: data.userId,
      username: person.username,
      date: data.date,
      duration: data.duration,
      description: data.description,
    });
  } catch {
    res.json({ error: "no id found" });
  }
});

app.get("/api/users/:_id?/logs", async (req, res) => {
  try {
    let exercises = await exercise.find({ userId: req.params._id });
    let person = await Person.findOne({ _id: req.params._id });
    let count = exercises.length;
    const logs = [];
    let limit = req.query.limit;
    let {from, to} = req.query;
    let yaha = new Date (from);
    let thyaha = new Date(to);
    
    
    if (!req.query.limit){limit = count}
    for(let i = 0; i < limit; i++ ){
      if(yaha < new Date(exercises[i].date)){continue;}
      if(thyaha > new Date(exercises[i].date)){continue;}
      logs.push({"description": exercises[i].description, "duration": exercises[i].duration, "date": exercises[i].date});
    }
    res.json({
      _id: person._id,
      username: person.username,
      count: count,
      log: logs,
    });
    console.log(req.query);
  } 
  catch (error) {
    res.json({ eror: error });
  }
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
