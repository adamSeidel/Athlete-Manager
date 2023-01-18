const express = require('express');
const app = express();

const fileNameForJSON = "./athletes.json";
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, 'client')));

const athletes = require(fileNameForJSON);

app.get('/athletes', function (req, resp) {
    const athleteKeys = Object.keys(athletes);
    const idsAndNames = []
    for (const key of athleteKeys) {
        idsAndNames.push({id: key, name: athletes[key]["name"]})
    };

    resp.send(idsAndNames)
});

app.get('/athlete/numberOfRaces/:athleteID', function (req, resp) {
    const athleteID = req.params.athleteID;
    const athleteData = athletes[athleteID];
    const numberOfRaces = athleteData["numberOfRaces"];
    resp.send("" + numberOfRaces);
});

module.exports = app;