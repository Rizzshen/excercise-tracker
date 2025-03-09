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
  name: {type: String,required: true}
  
});
Person = mongoose.model('Person', personSchema);

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.post('/api/users', async (req,res)=>{
  let user = new Person({name: req.body.username});
  let data = await user.save();
  console.log(data);
  res.json({"username": data.name, "id": data._id});
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
