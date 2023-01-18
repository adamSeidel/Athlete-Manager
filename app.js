const express = require('express');
const app = express();

const fileNameForJSON = "./athletes.json";
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, 'client')));

const athletes = require(fileNameForJSON);

//Keep track of the next free ID number
console.log(Object.keys(athletes).length)

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

app.post('/athlete/new', function (req, resp) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
})

module.exports = app;