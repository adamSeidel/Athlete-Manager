// function listAthletes() {
//     let athletes = document.querySelector("#athleteList ul");

//     let newAthlete = document.createElement('li')
//     newAthlete.setAttribute('class', 'list-group-item list-group-item-action d-flex justify-content-between align-items-center');
//     newAthlete.innerHTML = 'David Boam'

//     let spanElement = document.createElement('span')
//     spanElement.setAttribute('class', "badge bg-primary rounded-pill")
//     spanElement.innerHTML = 10

//     newAthlete.appendChild(spanElement)

//     athletes.appendChild(newAthlete);
// }

const endpointRoot = 'http://127.0.0.1:8090/';

async function listAthletes() {
    const athletesResponse = await fetch(endpointRoot + 'athletes')
    const athletesKeysText = await athletesResponse.text();
    const athletesKeys = JSON.parse(athletesKeysText);

    let athletesList = document.querySelector("#athleteList ul");

    for (const athlete of athletesKeys){
        let newAthlete = document.createElement('li')
        newAthlete.setAttribute('class', 'list-group-item list-group-item-action d-flex justify-content-between align-items-center');
        newAthlete.innerHTML = athlete

        let spanElement = document.createElement('span')
        spanElement.setAttribute('class', "badge bg-primary rounded-pill")
        spanElement.innerHTML = 10

        newAthlete.appendChild(spanElement)

        athletesList.appendChild(newAthlete);
    }
}

document.addEventListener('DOMContentLoaded', listAthletes);