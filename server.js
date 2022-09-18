const express = require('express');
const app = express(); 
const fs = require('fs');
const path = require('path'); 
//port 
const PORT = process.env.PORT || 3001; 
// parse incoming string / array data
app.use(express.urlencoded ( { extended: true }));
// parse incoming JSON data
app.use(express.json());
// middleware
app.use(express.static('public')); 

const { notes } = require('./data/db.json');

function createNewNote (body, notesArray) {
    const note = body; 
    notesArray.push(note); 

    // path writes file 
    fs.writeFileSync(
        path.join(__dirname, './data/db.json'),
        JSON.stringify({ notes : notesArray }, null, 2)
    );
    return note; 
};

// validating data
function validateNote (note) {
    if (!note.title || typeof note.title !== 'string') {
        return false; 
    }
    if (!note.text || typeof note.text !== "string") {
        return false;
    }
    return true;   
};

app.get('/api/notes', (req, res) => {
    res.json(notes); 
});
// route to server, accepts data for usage or server-side storage
app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString(); 

    if (!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted.');     
    } else {
        const note = createNewNote(req.body, notes); 
        res.json(note);
    }
});
// delete notes
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    let note;

    notes.map((element, index) => {
      if (element.id == id){
        note = element
        notes.splice(index, 1)
        return res.json(note);
      } 
    })
});
// route to index.html 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
}); 
// route to notes.html 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/notes.html'));
}); 
//server listening at port
app.listen(PORT, () => {
    console.log(`API server on port ${PORT}!`);
});