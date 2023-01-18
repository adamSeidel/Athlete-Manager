const express = require('express');
const app = express();

const fileNameForJSON = "./athletes.json";
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, 'client')));

const athletes = require(fileNameForJSON);

app.get('/athletes', function (req, resp) {
    const athleteKeys = Object.keys(athletes);
    resp.send(athleteKeys)
});

module.exports = app;