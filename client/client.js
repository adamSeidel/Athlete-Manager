const endpointRoot = 'http://127.0.0.1:8090/';

async function listAthletes() {
    const athletesResponse = await fetch(endpointRoot + 'athletes')
    const athletesKeysText = await athletesResponse.text();
    const athletesKeys = JSON.parse(athletesKeysText);

    let athletesList = document.querySelector("#athleteList ul");
    athletesList.innerHTML = "";

    for (const athlete of athletesKeys){
        let newAthlete = document.createElement('li')
        newAthlete.setAttribute('class', 'athlete list-group-item list-group-item-action d-flex justify-content-between align-items-center');
        newAthlete.setAttribute('id', athlete)
        newAthlete.innerHTML = athlete

        let spanElement = document.createElement('span')
        spanElement.setAttribute('class', "badge bg-primary rounded-pill")
        let numberOfRacesRequest = await fetch(endpointRoot + "athlete/numberOfRaces/" + athlete)
        let numberOfRaces = await numberOfRacesRequest.text();
        spanElement.innerHTML = numberOfRaces + ' entries';

        newAthlete.appendChild(spanElement);

        athletesList.appendChild(newAthlete);
    };

    addAthleteClick();
};

async function addAthlete() {
    const athleteForm = document.getElementById("athleteSumbit");
    athleteForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const data = new FormData(athleteForm);
        // conversion from FormData to JSON at https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json //
        const dataJSON = JSON.stringify(Object.fromEntries(data));

        const response = await fetch(endpointRoot + 'athlete/new', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: dataJSON
        });
        listAthletes();
        athleteForm.reset();
    });
};

async function addAthleteClick() {
    let athletes = document.querySelectorAll(".athlete")

    for (const athlete of athletes) {
        athlete.addEventListener("click", () => showAthleteData(athlete.id));
    }
}

async function showAthleteData(athlete) {
    // Hide the athletes list section of the page
    athleteList = document.getElementById("athletesListSection");
    athleteList.style.display = "none";

    // Hide the add an athlete section of the page
    addAthlete = document.getElementById("addAnAthleteSection");
    addAthlete.style.display = "none";

    // Show the athlete data section of the page
    athleteDataSection = document.getElementById("athleteDataSection");
    athleteDataSection.style.display = "block";

    // Select the race date list
    const raceResponse = await fetch(endpointRoot + "races/" + athlete)
    const racesText = await raceResponse.text();
    const races = JSON.parse(racesText);
    
    // Add the athletes races to the page
    let racesList = document.querySelector("#raceList ul");

    // Make sure list is empty to avoid adding duplicates
    racesList.innerHTML = "";

    for (const race of races) {
        let newRace = document.createElement('li')
        newRace.setAttribute('class', 'race list-group-item list-group-item-action d-flex justify-content-between align-items-center');
        newRace.setAttribute('id', race)
        newRace.innerHTML = race

        racesList.appendChild(newRace);
    };

}

document.addEventListener('DOMContentLoaded', listAthletes);
document.addEventListener('DOMContentLoaded', addAthlete);