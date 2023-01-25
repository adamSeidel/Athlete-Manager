// Excute code in strict mode
'use strict';

// Local host end point root
const endpointRoot = 'http://127.0.0.1:8080/';

// Display the athletes on the page
async function listAthletes () {
    try {
        // Fetch athletes names
        const athletesResponse = await fetch(endpointRoot + 'athletes');

        // Throw error if 404 response
        if (!athletesResponse.ok) {
            // Throw error with error message taken from response
            throw new Error(await athletesResponse.text());
        }

        // Parse the athletes names into JSON
        const athletesKeysText = await athletesResponse.text();
        const athletesKeys = JSON.parse(athletesKeysText);

        // Select the athletesList from the DOM
        const athletesList = document.querySelector('#athleteList ul');
        // Make sure list is empty
        athletesList.innerHTML = '';

        // Iteratively add each athlete to page
        for (const athlete of athletesKeys) {
            // Create element with id of athlete name and desired bootstrap styling
            const newAthlete = document.createElement('li');
            newAthlete.setAttribute('class', 'athlete list-group-item list-group-item-action d-flex justify-content-between align-items-center');
            newAthlete.setAttribute('id', athlete);
            // Remove the '-' character used when storing athlete data
            newAthlete.innerHTML = athlete.replace('-', ' ');

            // Create number of entires element
            const spanElement = document.createElement('span');
            spanElement.setAttribute('class', 'badge bg-primary rounded-pill');

            // Fetch number of races for current athlete
            const numberOfRacesRequest = await fetch(`${endpointRoot}athlete/numberOfRaces/${athlete}`);

            // Throw error if 404 response
            if (!numberOfRacesRequest.ok) {
                // Throw error with message taken from response
                throw new Error(await numberOfRacesRequest.text());
            }

            // Extract text from valid response
            const numberOfRaces = await numberOfRacesRequest.text();

            // Deal with plural vs singular numberOfRaces
            if (numberOfRaces === '1') {
                // Singluar
                spanElement.innerHTML = numberOfRaces + ' entry';
            } else {
                // Plural
                spanElement.innerHTML = numberOfRaces + ' entries';
            }

            // Append the number of races to list element
            newAthlete.appendChild(spanElement);

            // Append athlete to page
            athletesList.appendChild(newAthlete);
        };

        // Make the athlete clickable
        addAthleteClick();

    // Catch errors
    } catch (e) {
        // Access error section on page
        const athletesListSectionMessage = document.getElementById('athletesListSectionMessage');

        // Catching a TypeError https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
        // For cases where server drops out - make the error message more descriptive
        if (e instanceof TypeError) {
            // eslint-disable-next-line no-ex-assign
            e = 'Server connection error: Unable to access athlete data';
        }

        // Display error message
        athletesListSectionMessage.innerHTML = e;
    };
};

// Add a new athlete to database
async function addAthlete () {
    // Access the add athlete form
    const athleteForm = document.getElementById('athleteSumbit');
    // Add event listener for when forms sumbitted
    athleteForm.addEventListener('submit', async function (event) {
        try {
            // Prevent the page reloading on sumbit
            event.preventDefault();

            // Construct FormData object from user input
            const data = new FormData(athleteForm);

            // conversion from FormData to JSON at https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json //
            const dataJSON = JSON.stringify(Object.fromEntries(data));

            // POST the new athlete details
            const response = await fetch(endpointRoot + 'athlete/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: dataJSON
            });

            // Was the POST successful
            if (!response.ok) {
                // Throw error on 404
                throw new Error(await response.text());
            };

            // Update the athletes on the site to include new athlete
            listAthletes();

            // Clear the form
            athleteForm.reset();

            // Access the response text
            const userMessage = await response.text();

            // Display the response message to the user
            const addAthleteMessage = document.getElementById('addAthleteMessage');
            addAthleteMessage.innerHTML = userMessage;
            // Display message as green
            addAthleteMessage.setAttribute('class', 'text-success');

        // POST was unsuccessful
        } catch (e) {
            // Make TypeError case more user freindly
            if (e instanceof TypeError) {
                // eslint-disable-next-line no-ex-assign
                e = 'Server connection error: Unable to add new athlete';
            };

            // Display the response error message
            const addAthleteMessage = document.getElementById('addAthleteMessage');
            addAthleteMessage.innerHTML = e;
            // Display message as red
            addAthleteMessage.setAttribute('class', 'text-danger');
        };
    });
};

// Add a new race
async function addRace () {
    // Access the race form
    const raceForm = document.getElementById('raceSubmit');

    // Event listener on form sumbit
    raceForm.addEventListener('submit', async function (event) {
        try {
            // Prevent page reload on form sumbit
            event.preventDefault();

            // Extract the from input as FormData object
            const data = new FormData(raceForm);

            // Get athlete name
            const athleteName = document.getElementById('athleteName').innerHTML.replace(' ', '-');

            // Add data to FormData at https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
            data.append('athleteName', athleteName);

            // conversion from FormData to JSON at https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json //
            const dataJSON = JSON.stringify(Object.fromEntries(data));

            // POST request with form data
            const response = await fetch(endpointRoot + 'newRace', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: dataJSON
            });

            // Handle 404 case
            if (!response.ok) {
                // Throw error with message extracted from response
                throw new Error(await response.text());
            };

            // Clear form for next input
            raceForm.reset();

            // Extract response text for sucessful responses
            const userMessage = await response.text();

            // Display response message to user
            const addRaceMessage = document.getElementById('addRaceMessage');
            addRaceMessage.innerHTML = userMessage;
            // Display error as green
            addRaceMessage.setAttribute('class', 'text-success');

        // Catch any errors / 404 cases
        } catch (e) {
            // Make TypeError case more user freindly
            if (e instanceof TypeError) {
                // eslint-disable-next-line no-ex-assign
                e = 'Server connection error: Unable to add new athlete';
            };

            // Display error message to the user
            const addRaceMessage = document.getElementById('addRaceMessage');
            addRaceMessage.innerHTML = e;
            // Display error as red
            addRaceMessage.setAttribute('class', 'text-danger');
        };
    });
};

// Display the data of an athlete
async function showAthleteData (athlete) {
    try {
        // Make sure only athlete data section is shown on the page
        // Hide the athletes list section of the page
        const athleteList = document.getElementById('athletesListSection');
        athleteList.style.display = 'none';
        // Hide the add an athlete section of the page
        const addAthlete = document.getElementById('addAnAthleteSection');
        addAthlete.style.display = 'none';
        // Show the athlete data section of the page
        const athleteDataSection = document.getElementById('athleteDataSection');
        athleteDataSection.style.display = 'block';
        // Show athlete name on the screen
        const athleteName = document.getElementById('athleteName');
        athleteName.innerHTML = athlete.replace('-', ' ');

        // Fetch races for given athlete
        const raceResponse = await fetch(endpointRoot + 'races/' + athlete);

        // Ensure response was not 404
        if (!raceResponse.ok) {
            throw new Error();
        };

        // Extract races from response as JSON
        const racesText = await raceResponse.text();
        const races = JSON.parse(racesText);

        // Access the races list
        const racesList = document.querySelector('#raceList ul');

        // Make sure list is empty to avoid adding duplicates
        racesList.innerHTML = '';

        // Iteratively add each race to the page
        for (const race of races) {
            // Make new race element
            const newRace = document.createElement('li');

            // Apply bootstrap styling and id
            newRace.setAttribute('class', 'race list-group-item list-group-item-action d-flex justify-content-between align-items-center');
            newRace.setAttribute('id', race);

            // Remove '-' thats used for storage
            newRace.innerHTML = race.replace('-', ' ');

            // Add new element to list
            racesList.appendChild(newRace);
        };

        // Make the race clickable
        addRaceClick();

        // Clear the message section
        const athleteDataMessage = document.getElementById('athleteDataMessage');
        athleteDataMessage.innerHTML = '';

    // Handle errors / 404
    } catch (e) {
        // Display error message to the user
        const athleteDataMessage = document.getElementById('athleteDataMessage');
        athleteDataMessage.innerHTML = 'Server Error: Unable to show athletes data';
        // Red error message
        athleteDataMessage.setAttribute('class', 'text-danger');
    };
};

// Make the athletes clickable
function addAthleteClick () {
    // Select all athletes
    const athletes = document.querySelectorAll('.athlete');

    // Add event listener to all athletes on page
    for (const athlete of athletes) {
        athlete.addEventListener('click', () => showAthleteData(athlete.id));
    };
};

// Make races clickable to view details
function addRaceClick () {
    // Access all races on the screen
    const races = document.querySelectorAll('.race');

    // Extract athletes name from the page
    const athlete = document.getElementById('athleteName').innerHTML;

    // Iteratively make races clickable
    for (const race of races) {
        // Add event listener to each race passing the athelte name and race name
        // so the race can be accessed by showRaceData on click
        race.addEventListener('click', () => showRaceData(athlete, race.id));
    };
};

// Show the data of a specific race
async function showRaceData (athlete, race) {
    try {
        // Hide the athlete data section
        const athleteDataSection = document.getElementById('athleteDataSection');
        athleteDataSection.style.display = 'none';

        // Show the race data section
        const raceDataSection = document.getElementById('raceDataSection');
        raceDataSection.style.display = 'block';

        // Fetch the details of the required athletes race
        const raceResponse = await fetch(endpointRoot + 'athlete/' + athlete.replace(' ', '-') + '/' + race);

        // Make sure response was valid
        if (!raceResponse.ok) {
            // Error if not valid response (404)
            throw new Error();
        };

        // Extract race data from response as JSON
        const raceResponseText = await raceResponse.text();
        const raceData = JSON.parse(raceResponseText);

        // Display the name of the race on the screen
        const raceName = document.getElementById('raceName');
        // Remove '-' used for storage
        raceName.innerHTML = race.replace('-', ' ');

        // Display athlete name on the screen
        const raceAthlete = document.getElementById('raceAthlete');
        raceAthlete.innerHTML = athlete;

        // Display race distance on the screen
        const distance = document.getElementById('displayDistance');
        distance.innerHTML = raceData.distance;

        // Display race time on the screen
        const time = document.getElementById('displayTime');
        time.innerHTML = raceData.time;

        // Dispay race position on the screen
        const position = document.getElementById('displayPosition');
        position.innerHTML = raceData.position;

        // Display comment on the screen
        const comments = document.getElementById('displayComments');
        comments.innerHTML = raceData.comments;

        // Clear message section
        const raceDataMessage = document.getElementById('raceDataMessage');
        raceDataMessage.innerHTML = '';

    // Deal with errors / 404
    } catch (e) {
        // Display error message on the page
        const raceDataMessage = document.getElementById('raceDataMessage');
        raceDataMessage.innerHTML = 'Server Error: Unable to display race data';
        raceDataMessage.setAttribute('class', 'text-danger');
    }
};

// Add event listeners to the various navigation buttons on the site
function addButtonListners () {
    // Add an athlete button
    const addAnAthleteButton = document.getElementById('addAnAthleteButton');
    addAnAthleteButton.addEventListener('click', () => {
        // Show add an athlete section
        const addAnAthleteSection = document.getElementById('addAnAthleteSection');
        addAnAthleteSection.style.display = 'block';

        // Hide athletes section
        const athleteListSection = document.getElementById('athletesListSection');
        athleteListSection.style.display = 'none';
    });

    // Go back to athletes button
    const backToAthletesButton = document.getElementById('backToAthletesButton');
    backToAthletesButton.addEventListener('click', () => {
        // Show athletes section
        const athleteListSection = document.getElementById('athletesListSection');
        athleteListSection.style.display = 'block';

        // Hide add an athlete section
        const addAnAthleteSection = document.getElementById('addAnAthleteSection');
        addAnAthleteSection.style.display = 'none';
    });

    // Go back to athletes button
    const backToAllAthletesButton2 = document.getElementById('backToAllAthletesButton2');
    backToAllAthletesButton2.addEventListener('click', () => {
        // Show athletes section
        const athleteListSection = document.getElementById('athletesListSection');
        athleteListSection.style.display = 'block';

        // Update athlete list
        listAthletes();

        // Hide athlete data section
        const athleteDataSection = document.getElementById('athleteDataSection');
        athleteDataSection.style.display = 'none';
    });

    // Go back to the athletes race data
    const backToAthleteRaceData = document.getElementById('backToAthleteData');
    backToAthleteRaceData.addEventListener('click', () => {
        // Show athlete data section
        const athleteDataSection = document.getElementById('athleteDataSection');
        athleteDataSection.style.display = 'block';

        // Hide race data section
        const raceDataSection = document.getElementById('raceDataSection');
        raceDataSection.style.display = 'none';
    });

    // Go back to the athletes race data
    const backToAthleteRaceData2 = document.getElementById('backToAthleteData2');
    backToAthleteRaceData2.addEventListener('click', () => {
        // Show athlete data section
        const athleteDataSection = document.getElementById('athleteDataSection');
        athleteDataSection.style.display = 'block';

        // Get athlete name
        const athleteName = document.getElementById('athleteName').innerHTML.replace(' ', '-');

        // Update athlete data
        showAthleteData(athleteName);

        // Hide add race section
        const raceDataSection = document.getElementById('addRaceSection');
        raceDataSection.style.display = 'none';
    });

    // Go to add a race section
    const addRaceButton = document.getElementById('addRace');
    addRaceButton.addEventListener('click', () => {
        // Show add race section
        const addRaceSection = document.getElementById('addRaceSection');
        addRaceSection.style.display = 'block';

        // Hide athlete data section
        const athleteDataSection = document.getElementById('athleteDataSection');
        athleteDataSection.style.display = 'none';
    });
}

// Call various functions once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    listAthletes();
    addAthlete();
    addRace();
    addButtonListners();
});
