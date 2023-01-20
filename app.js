const express = require('express');
const app = express();

const fs = require('fs');

const fileNameForJSON = './athletes.json';
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
    const numberOfRaces = athleteData.numberOfRaces;
    resp.send('' + numberOfRaces);
});

app.post('/athlete/new', function (req, resp) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    console.log(firstName, lastName);

    const name = firstName + ' ' + lastName;
    const numberOfRaces = 0;

    athletes[name] = { numberOfRaces, races: {} };
    fs.writeFileSync(fileNameForJSON, JSON.stringify(athletes));

    resp.send(athletes);
});

app.get('/athlete/:athlete/:raceName', function (req, resp) {
    const athlete = req.params.athlete;
    const raceName = req.params.raceName;

    const raceData = athletes[athlete].races;
    const race = raceData[raceName];

    resp.send(race);
});

app.get('/races/:firstName/:secondName', function (req, resp) {
    const firstName = req.params.firstName;
    const secondName = req.params.secondName;

    const athleteID = firstName + ' ' + secondName;

    const races = Object.keys(athletes[athleteID].races);

    resp.send(races);
});

app.post('/newRace', function (req, resp) {
    const athleteName = req.body.athleteName;
    const raceName = req.body.raceName;
    const distance = req.body.distance;
    const time = req.body.time;
    const position = req.body.position;
    const comments = req.body.comments;

    athletes[athleteName].races[raceName] = {
distance,
finishingTime: time,
finishingPosition: position,
comments
};

    athletes[athleteName].numberOfRaces += 1;

    fs.writeFileSync(fileNameForJSON, JSON.stringify(athletes));
    resp.send(athletes);
});

module.exports = app;
