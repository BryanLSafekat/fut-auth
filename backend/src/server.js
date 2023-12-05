const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(cors());

app.get('/api/futbolistas', (req,res) =>{
    res.sendFile(path.join(__dirname, '../api.json'))
});

app.listen(port, () => {
    console.log(`Servidor en funcionamiento: en ${port}`);
})