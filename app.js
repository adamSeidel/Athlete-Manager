// Conducted some further reading on response codes https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

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
    try {
        // Create array of all keys in the athlets JSON file
        const athleteKeys = Object.keys(athletes);

        // Send the array of athlete names as response
        resp.status(200);
        resp.send(athleteKeys);

    // Catch any errors that occur
    } catch (e) {
        // Send 404 response with error message
        resp.status(404);
        resp.send('Unable to access athletes data');
    };
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
        resp.status(200);
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
    // Parameters not provided
    if (firstName === undefined || lastName === undefined ||
        firstName === '' || lastName === '') {
        // Send response of 404 with error message
        resp.status(404);
        resp.send('Athlete name is incomplete');

    // Parameters provided
    } else {
        // Construct athleteName in the style used for JSON storage
        const name = firstName + '-' + lastName;

        // Ensure the athlete is not already in the data base
        const athletesKeys = Object.keys(athletes);
        // Athlete is already in the data base
        if (athletesKeys.includes(name)) {
            // Send 404 response
            resp.status(404);
            resp.send('Athlete is already in the data base');

        // Athlete does not already exist
        } else {
            // Initial number of races is 0
            const numberOfRaces = 0;

            // Update local JSON object to include new athlete
            athletes[name] = { numberOfRaces, races: {} };

            // Write local JSON to the JSON storage file
            fs.writeFileSync(fileNameForJSON, JSON.stringify(athletes));

            // Send valid response
            resp.status(200);
            resp.send('Athlete added sucessfully');
        };
    };
});

// GET root to return details of a race
app.get('/athlete/:athleteID/:raceName', function (req, resp) {
    // Extract URL parameters
    const athlete = req.params.athleteID;
    const raceName = req.params.raceName;

    // Race exists
    try {
        // Access the race data for the specified athlete
        const raceData = athletes[athlete].races;

        // Access the names of all the athletes different races
        const raceDataKeys = Object.keys(raceData);

        // Make sure the requested race is a valid race in the athletes
        // data
        if (!raceDataKeys.includes(raceName)) {
            // Throw error in case race does not exist in JSON
            throw new Error();
        }

        // Construct response and send 200
        const race = raceData[raceName];
        resp.status(200);
        resp.send(race);

    // Race does not exist
    } catch (e) {
        // 404 response code with error messgae
        resp.status(404);
        resp.send('Race not found');
    };
});

// GET root to return a specific athletes races
app.get('/races/:athleteID', function (req, resp) {
    try {
        // Extract URL variables
        const athleteID = req.params.athleteID;

        // Array of the names of all the specified athletes races
        const races = Object.keys(athletes[athleteID].races);

        // Send athletes races as response 200
        resp.status(200);
        resp.send(races);

    // Catch error / 400
    } catch (e) {
        resp.status(404);
        resp.send('Athlete does not exist');
    };
});

// POST root to add a new race
app.post('/newRace', function (req, resp) {
    try {
        // Extract all the body parameters submitted by the user
        const athleteName = req.body.athleteName;
        const raceName = req.body.raceName.replace(' ', '-');
        const distance = req.body.distance;
        const time = req.body.time;
        const position = req.body.position;
        const comments = req.body.comments;

        // Throw an error if any of the parameters are blank or undefined
        if (athleteName === undefined || athleteName === '') {
            throw new Error();
        };
        if (raceName === undefined || raceName === '') {
            throw new Error();
        };
        if (distance === undefined || distance === '') {
            throw new Error();
        };
        if (time === undefined || time === '') {
            throw new Error();
        };
        if (position === undefined || position === '') {
            throw new Error();
        };
        if (comments === undefined || comments === '') {
            throw new Error();
        };

        // Check that race does not already exist
        const raceData = athletes[athleteName].races;
        const raceDataKeys = Object.keys(raceData);
        if (raceDataKeys.includes(raceName)) {
            // Error thrown if race is duplicate
            throw new Error();
        };

        // Construct and add new race to the athletes race data
        athletes[athleteName].races[raceName] = {
        distance,
        time,
        position,
        comments
        };

        // Increment value tracking how many races athlete has done
        athletes[athleteName].numberOfRaces += 1;

        // Write the local JSON to the athletes.json file
        fs.writeFileSync(fileNameForJSON, JSON.stringify(athletes));

        // Send valid response and message
        resp.status(200);
        resp.send('Race added successfully');

    // Deal with errors
    } catch (e) {
        // Send 404 response with error message
        resp.status(404);
        resp.send('New race details are invalid');
    };
});

// Allow this file to be required by other scripts
// in this case the server.js file
module.exports = app;
