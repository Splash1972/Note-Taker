const express = require('express');
const fs = require('fs');
const path = require('path');
// generate unique ID from npmjs package
const generateUniqueId = require('generate-unique-id');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded( { extended: true }));

let notes = require('./db/db.json');

// Load notes from file on startup
fs.readFile('./db/db.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    notes = JSON.parse(data);
  }
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
  
  // GET /api/notes
  app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      // console.log(notes);
      res.json(notes);
    });
  });
  
  // POST /api/notes
  app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    const newNote = { title, text, id: generateUniqueId() };
    notes.push(newNote);
    console.log(notes);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json('New Note Created');
  });

app.listen(PORT, () =>
  console.log(`Serving static asset routes on port ${PORT}!`)
);