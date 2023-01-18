const express = require('express');
const app = express();

const fs = require('fs');

const fileNameForJSON = "./athletes.json";
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, 'client')));

const athletes = require(fileNameForJSON);

app.get('/athletes', function (req, resp) {
    const athleteKeys = Object.keys(athletes);
    resp.send(athleteKeys);
});

app.get('/athlete/numberOfRaces/:athleteID', function (req, resp) {
    const athleteID = req.params.athleteID;
    const athleteData = athletes[athleteID];
    const numberOfRaces = athleteData["numberOfRaces"];
    resp.send("" + numberOfRaces);
});

app.post('/athlete/new', function (req, resp) {
    //ID of next athlete
    let nextKey = Object.keys(athletes).length + 1

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    console.log(firstName, lastName);

    const name = firstName + " " + lastName;
    const numberOfRaces = 0

    athletes[name] = {"numberOfRaces": numberOfRaces}
    fs.writeFileSync(fileNameForJSON, JSON.stringify(athletes));
    resp.send(athletes);
});

app.get('/athlete/:athlete/:raceName', function (req, resp) {
    let athlete = req.params.athlete;
    const raceName = req.params.raceName;

    const raceData = athletes[athlete]["races"];
    const race = raceData[raceName];

    resp.send('' + race);
});

app.get('/races/:athleteID', function (req, resp) {
    let athleteID = req.params.athleteID

    const raceData = athletes[athlete]["races"];
    
    resp.send('' + raceData)
})

module.exports = app;