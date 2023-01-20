// Further reading on response codes https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

'use strict';

const express = require('express');
const app = express();

const fs = require('fs');

const fileNameForJSON = './athletes.json';
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, 'client')));

const athletes = require(fileNameForJSON);

// GET root to return the names of all athletes
app.get('/athletes', function (req, resp) {
    // Create array of all keys in the athlets JSON file
    const athleteKeys = Object.keys(athletes);

    // Send the array of athlete names as response
    resp.send(athleteKeys);
});

// GET root to return the number of races an athlete has competed in
app.get('/athlete/numberOfRaces/:firstName/:secondName', function (req, resp) {
    // Parse the URL encoded variables
    const firstName = req.params.firstName;
    const secondName = req.params.secondName;

    // Construct the athleteID
    const athleteID = firstName + ' ' + secondName;

    // Attempt to access athlete numberOfRaces data
    try {
        const athleteData = athletes[athleteID];
        const numberOfRaces = athleteData.numberOfRaces;

        // Send response Content-Type: text/html
        resp.send('' + numberOfRaces);

    // Athlete does not exist
    } catch (err) {
        // 404 response code with error message
        // How to specify error code in Express? https://stackoverflow.com/questions/10563644/how-to-specify-http-error-code-using-express-js
        resp.status(404);
        resp.send('The requested athlete could not be found in the system');
    };
});

app.post('/athlete/new', function (req, resp) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    if (firstName === undefined || lastName === undefined) {
        resp.status(404);
        resp.send('Athlete name is incomplete');
    } else {
        const name = firstName + ' ' + lastName;

        if (Object.keys(athletes).includes(name)) {
            resp.status(404);
            resp.send('Athlete is already in the data base');
        } else {
            const numberOfRaces = 0;

            athletes[name] = { numberOfRaces, races: {} };
            fs.writeFileSync(fileNameForJSON, JSON.stringify(athletes));

            resp.send(athletes);
        };
    };
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
time,
position,
comments
};

    athletes[athleteName].numberOfRaces += 1;

    fs.writeFileSync(fileNameForJSON, JSON.stringify(athletes));
    resp.send(athletes);
});

module.exports = app;
