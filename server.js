const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/canyonBeta', {
  useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  path: String,
  location: String,
  coords: Number,
  conditions: String,
  rotate: Boolean,
});

// Create a model for items in the museum.
const Canyon = mongoose.model('Canyon', itemSchema);

const multer = require('multer')
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 100000000
  }
});

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a new item in the museum: takes a title and a path to an image.

app.post('/api/canyons', async (req, res) => {
  const canyon = new Canyon({
    name: req.body.name,
    description: req.body.description,
    path: req.body.path,
    location: req.body.location,
    coords: req.body.coords,
    conditions: req.body.conditions,
    rotate: req.body.rotate,
  });
  try {
    await canyon.save();
    res.send(canyon);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the museum.
app.get('/api/canyons', async (req, res) => {
  try {
    let canyons = await Canyon.find();
    res.send(canyons);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/canyons/:id', async (req, res) => {
  try {
    await Canyon.deleteOne({
      _id: req.params.id
    })
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/canyons/:id', async (req, res) => {
  try {
    let canyon = await Canyon.findOne({
      _id: req.params.id
    });
    console.log(canyon);
    canyon.name = req.body.name;
    canyon.description = req.body.description;
    canyon.location = req.body.location;
    canyon.coords = req.body.coords;
    canyon.conditions = req.body.conditions;
    canyon.rotate = req.body.rotate;
    try {
      await canyon.save();
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});



app.listen(3000, () => console.log('Server listening on port 3000!'));