'use strict';

const endpointRoot = 'http://127.0.0.1:8090/';

// Error handling applied - happy
async function listAthletes () {
    try {
        const athletesResponse = await fetch(endpointRoot + 'athletes');

        if (!athletesResponse.ok) {
            throw new Error(await athletesResponse.text());
        }

        const athletesKeysText = await athletesResponse.text();

        const athletesKeys = JSON.parse(athletesKeysText);

        const athletesList = document.querySelector('#athleteList ul');
        athletesList.innerHTML = '';

        for (const athlete of athletesKeys) {
            const newAthlete = document.createElement('li');
            newAthlete.setAttribute('class', 'athlete list-group-item list-group-item-action d-flex justify-content-between align-items-center');
            newAthlete.setAttribute('id', athlete);
            newAthlete.innerHTML = athlete.replace('-', ' ');

            const spanElement = document.createElement('span');
            spanElement.setAttribute('class', 'badge bg-primary rounded-pill');

            const numberOfRacesRequest = await fetch(`${endpointRoot}athlete/numberOfRaces/${athlete}`);

            if (!numberOfRacesRequest.ok) {
                throw new Error(await numberOfRacesRequest.text());
            }

            const numberOfRaces = await numberOfRacesRequest.text();

            // Deal with plural vs singular numberOfRaces
            if (numberOfRaces === '1') {
                // Singluar
                spanElement.innerHTML = numberOfRaces + ' entry';
            } else {
                // Plural
                spanElement.innerHTML = numberOfRaces + ' entries';
            }

            newAthlete.appendChild(spanElement);

            athletesList.appendChild(newAthlete);
        };

        addAthleteClick();
    } catch (e) {
        const athletesListSectionMessage = document.getElementById('athletesListSectionMessage');

        // Catching a TypeError https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
        if (e instanceof TypeError) {
            // eslint-disable-next-line no-ex-assign
            e = 'Server connection error: Unable to access athlete data';
        }

        athletesListSectionMessage.innerHTML = e;
    }
};

// Error handling applied
async function addAthlete () {
        const athleteForm = document.getElementById('athleteSumbit');
        athleteForm.addEventListener('submit', async function (event) {
            try {
                event.preventDefault();
                const data = new FormData(athleteForm);
                // conversion from FormData to JSON at https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json //
                const dataJSON = JSON.stringify(Object.fromEntries(data));

                // eslint-disable-next-line no-unused-vars
                const response = await fetch(endpointRoot + 'athlete/new', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: dataJSON
                });

                if (!response.ok) {
                    throw new Error(await response.text());
                }

                listAthletes();
                athleteForm.reset();

                const userMessage = await response.text();

                const addAthleteMessage = document.getElementById('addAthleteMessage');
                addAthleteMessage.innerHTML = userMessage;
                addAthleteMessage.setAttribute('class', 'text-success');
            } catch (e) {
                const addAthleteMessage = document.getElementById('addAthleteMessage');

                if (e instanceof TypeError) {
                    // eslint-disable-next-line no-ex-assign
                    e = 'Server connection error: Unable to add new athlete';
                }

                addAthleteMessage.innerHTML = e;
                addAthleteMessage.setAttribute('class', 'text-danger');
            };
        });
};

// Error handling applied - happy
async function addRace () {
    const raceForm = document.getElementById('raceSubmit');
    raceForm.addEventListener('submit', async function (event) {
        try {
            event.preventDefault();
            const data = new FormData(raceForm);

            // Get athlete name
            const athleteName = document.getElementById('athleteName').innerHTML.replace(' ', '-');

            // Add data to FormData at https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
            data.append('athleteName', athleteName);

            // conversion from FormData to JSON at https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json //
            const dataJSON = JSON.stringify(Object.fromEntries(data));

            // eslint-disable-next-line no-unused-vars
            const response = await fetch(endpointRoot + 'newRace', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: dataJSON
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            raceForm.reset();

            const userMessage = await response.text();
            console.log(userMessage);

            const addRaceMessage = document.getElementById('addRaceMessage');
            addRaceMessage.innerHTML = userMessage;
            addRaceMessage.setAttribute('class', 'text-success');
        } catch (e) {
            const addRaceMessage = document.getElementById('addRaceMessage');
            console.log(e);
            addRaceMessage.innerHTML = e;
            addRaceMessage.setAttribute('class', 'text-danger');
        }
    });
}

// No await
function addAthleteClick () {
    const athletes = document.querySelectorAll('.athlete');

    for (const athlete of athletes) {
        athlete.addEventListener('click', () => showAthleteData(athlete.id));
    }
}

// Error handling applied
async function showAthleteData (athlete) {
    try {
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

        // Select the race date list
        const raceResponse = await fetch(endpointRoot + 'races/' + athlete);

        if (!raceResponse.ok) {
            throw new Error();
        }
        const racesText = await raceResponse.text();
        const races = JSON.parse(racesText);

        // Add the athletes races to the page
        const racesList = document.querySelector('#raceList ul');

        // Make sure list is empty to avoid adding duplicates
        racesList.innerHTML = '';

        for (const race of races) {
            const newRace = document.createElement('li');
            newRace.setAttribute('class', 'race list-group-item list-group-item-action d-flex justify-content-between align-items-center');
            newRace.setAttribute('id', race);
            newRace.innerHTML = race.replace('-', ' ');

            racesList.appendChild(newRace);
        };

        addRaceClick();

        const athleteDataMessage = document.getElementById('athleteDataMessage');
        athleteDataMessage.innerHTML = '';
    } catch (e) {
        const athleteDataMessage = document.getElementById('athleteDataMessage');
        athleteDataMessage.innerHTML = 'Unable to show athletes data';
        athleteDataMessage.setAttribute('class', 'text-danger');
    }
};

// No await
function addRaceClick () {
    const races = document.querySelectorAll('.race');
    const athlete = document.getElementById('athleteName').innerHTML;

    for (const race of races) {
        race.addEventListener('click', () => showRaceData(athlete, race.id));
    };
};

// Error handling applied
async function showRaceData (athlete, race) {
    try {
        // Hide the athlete data section
        const athleteDataSection = document.getElementById('athleteDataSection');
        athleteDataSection.style.display = 'none';

        // Show the race data section
        const raceDataSection = document.getElementById('raceDataSection');
        raceDataSection.style.display = 'block';

        const raceResponse = await fetch(endpointRoot + 'athlete/' + athlete.replace(' ', '-') + '/' + race);

        if (!raceResponse.ok) {
          throw new Error();
        }

        const raceResponseText = await raceResponse.text();
        const raceData = JSON.parse(raceResponseText);

        const raceAthlete = document.getElementById('raceAthlete');
        raceAthlete.innerHTML = athlete;

        const distance = document.getElementById('displayDistance');
        distance.innerHTML = raceData.distance;

        const time = document.getElementById('displayTime');
        time.innerHTML = raceData.time;

        const position = document.getElementById('displayPosition');
        position.innerHTML = raceData.position;

        const comments = document.getElementById('displayComments');
        comments.innerHTML = raceData.comments;
    } catch (e) {
        const raceDataMessage = document.getElementById('raceDataMessage');
        raceDataMessage.innerHTML = 'Unable to display race data';
        raceDataMessage.setAttribute('class', 'text-danger');
    }
};

// No await
function addButtonListners () {
    const addAnAthleteButton = document.getElementById('addAnAthleteButton');
    addAnAthleteButton.addEventListener('click', () => {
        // Show add an athlete section
        const addAnAthleteSection = document.getElementById('addAnAthleteSection');
        addAnAthleteSection.style.display = 'block';

        // Hide athletes section
        const athleteListSection = document.getElementById('athletesListSection');
        athleteListSection.style.display = 'none';
    });

    const backToAthletesButton = document.getElementById('backToAthletesButton');
    backToAthletesButton.addEventListener('click', () => {
        // Show athletes section
        const athleteListSection = document.getElementById('athletesListSection');
        athleteListSection.style.display = 'block';

        // Hide add an athlete section
        const addAnAthleteSection = document.getElementById('addAnAthleteSection');
        addAnAthleteSection.style.display = 'none';
    });

    const backToAllAthletesButton2 = document.getElementById('backToAllAthletesButton2');
    backToAllAthletesButton2.addEventListener('click', () => {
        // Show athletes section
        const athleteListSection = document.getElementById('athletesListSection');
        athleteListSection.style.display = 'block';

        listAthletes();

        // Hide athlete data section
        const athleteDataSection = document.getElementById('athleteDataSection');
        athleteDataSection.style.display = 'none';
    });

    const backToAthleteRaceData = document.getElementById('backToAthleteData');
    backToAthleteRaceData.addEventListener('click', () => {
        // Show athlete data section
        const athleteDataSection = document.getElementById('athleteDataSection');
        athleteDataSection.style.display = 'block';

        // Hide race data section
        const raceDataSection = document.getElementById('raceDataSection');
        raceDataSection.style.display = 'none';
    });

    const backToAthleteRaceData2 = document.getElementById('backToAthleteData2');
    backToAthleteRaceData2.addEventListener('click', () => {
        // Show athlete data section
        const athleteDataSection = document.getElementById('athleteDataSection');
        athleteDataSection.style.display = 'block';

        // Get athlete name
        const athleteName = document.getElementById('athleteName').innerHTML.replace(' ', '-');
        showAthleteData(athleteName);

        // Hide add race section
        const raceDataSection = document.getElementById('addRaceSection');
        raceDataSection.style.display = 'none';
    });

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

// No await
document.addEventListener('DOMContentLoaded', () => {
    listAthletes();
    addAthlete();
    addRace();
    addButtonListners();
});

// document.addEventListener('DOMContentLoaded', listAthletes);
// document.addEventListener('DOMContentLoaded', addAthlete);
// document.addEventListener('DOMContentLoaded', addRace);
// document.addEventListener('DOMContentLoaded', addButtonListners);
