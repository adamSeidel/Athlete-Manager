const endpointRoot = 'http://127.0.0.1:8090/';

async function listAthletes() {
    const athletesResponse = await fetch(endpointRoot + 'athletes')
    const athletesKeysText = await athletesResponse.text();
    const athletesKeys = JSON.parse(athletesKeysText);

    let athletesList = document.querySelector("#athleteList ul");

    for (const athlete of athletesKeys){
        let newAthlete = document.createElement('li')
        newAthlete.setAttribute('class', 'list-group-item list-group-item-action d-flex justify-content-between align-items-center');
        newAthlete.innerHTML = athlete.name

        let spanElement = document.createElement('span')
        spanElement.setAttribute('class', "badge bg-primary rounded-pill")
        let numberOfRacesRequest = await fetch(endpointRoot + "athlete/numberOfRaces/" + athlete.id)
        let numberOfRaces = await numberOfRacesRequest.text();
        spanElement.innerHTML = numberOfRaces + ' entries';

        newAthlete.appendChild(spanElement)

        athletesList.appendChild(newAthlete);
    }
}

document.addEventListener('DOMContentLoaded', listAthletes);