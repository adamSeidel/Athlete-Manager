// Further reading on response codes https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

// Execute code in strict mode
'use strict';

// Require and initialise express a minimalist web framework
// for Node.js
const express = require('express');
const app = express();

// Require file system module
const fs = require('fs');

// Bring in JSON file
const fileNameForJSON = './athletes.json';
app.use(express.json());
const athletes = require(fileNameForJSON);

// Construct file path
const path = require('path');
app.use(express.static(path.join(__dirname, 'client')));

// GET root to return the names of all athletes
app.get('/athletes', function (req, resp) {
    // Create array of all keys in the athlets JSON file
    const athleteKeys = Object.keys(athletes);

    // Send the array of athlete names as response
    resp.status(200)
    resp.send(athleteKeys);
});

// GET root to return the number of races an athlete has competed in
app.get('/athlete/numberOfRaces/:athleteID', function (req, resp) {
    // Parse the URL encoded variables
    const athleteID = req.params.athleteID;

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

// POST root to make new athlete
app.post('/athlete/new', function (req, resp) {
    // Extract body parameters
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    // Ensure both parameters were provided
    if (firstName === undefined || lastName === undefined) {
        // Parameters not provided
        resp.status(200);
        resp.send('Athlete not added: Athlete name is incomplete');
    } else {
        // Parameters provided
        const name = firstName + '-' + lastName;

        if (Object.keys(athletes).includes(name)) {
            resp.status(200);
            resp.send('Athlete not added: Athlete is already in the data base');
        } else {
            const numberOfRaces = 0;

            athletes[name] = { numberOfRaces, races: {} };
            fs.writeFileSync(fileNameForJSON, JSON.stringify(athletes));

            resp.status(200);
            resp.send('Athlete added sucessfully');
        };
    };
});

app.get('/athlete/:athleteID/:raceName', function (req, resp) {
    const athlete = req.params.athleteID;
    const raceName = req.params.raceName;

    // Race exists
    try {
        const raceData = athletes[athlete].races;
        const race = raceData[raceName];
        resp.status(200);
        resp.send(race);
        
    // Race does not exist
    } catch (err) {
        // 200 response code with error messgae
        resp.status(200);
        resp.send('Race not found');
    };
});

app.get('/races/:athleteID', function (req, resp) {
    const athleteID = req.params.athleteID;

    const races = Object.keys(athletes[athleteID].races);

    resp.send(races);
});

app.post('/newRace', function (req, resp) {
    const athleteName = req.body.athleteName;
    const raceName = req.body.raceName.replace(" ", "-");
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

    resp.status(200)
    resp.send('Race added sucesfully');
});

module.exports = app;
