const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("MongoDB connected");
let Person;
const personSchema = new mongoose.Schema({
  username: {type: String,required: true}  
});
Person = mongoose.model('Person', personSchema);

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req,res)=>{
  let user = new Person({username: req.body.username});
  let data = await user.save();
  res.json({"username": data.username, "id": data._id});
});

app.get('/api/users', async(req,res) =>{
  try{
    let person = await Person.find()
    res.json(person);
  }
  catch{
    res.json({"err": "From get method"})
  }
});

app.post('/api/users/:_id/exercises', async(req,res)=> {
  let person = await Person.find({_id: req.params._id});
  console.log(req.params._id);
  console.log(person);

  res.json({"username": person[0].username, "description": req.body.description , "duration": req.body.duration, "date": req.body.date, "_id": req.params._id});
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
