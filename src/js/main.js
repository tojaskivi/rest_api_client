console.log("Version 0.9.7");

const mainMenuEl = document.getElementById('main-menu');

let TOKEN = localStorage.getItem('api-token');
let NAME = localStorage.getItem('api-name');
if (TOKEN) {
    mainMenuEl.innerHTML = `<button onclick="signOut()">Logga ut - ${NAME}</button>`;
}

const coursesTableEl = document.getElementById("courses-table");
const searchFormEl = document.getElementById("form-search");

searchFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    let searchTerm = document.getElementById('search-bar').value;

    let url = `https://ojaskivi.se/rest_api/public/api/courses/search/${searchTerm}`
    if (searchTerm == "") url = `https://ojaskivi.se/rest_api/public/api/courses`
    const response = await fetch(url);
    let data = await response.json();
    printCourses(data);
});

const searchInfoEl = document.getElementById("search-info");
const signInFormEl = document.getElementById('sign-in-form');

if (signInFormEl) {
    signInFormEl.addEventListener('submit', async function (e) {
        e.preventDefault();
        let it = new FormData(e.target.closest('form'));
        let stringToken = "";
        for (var value of it.values()) {
            stringToken = value;
        }

        let object = {
            token: stringToken.toUpperCase()
        }

        let signature = JSON.stringify(object);

        const response = await fetch("https://ojaskivi.se/rest_api/public/api/login", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: signature
        }).then((response) => response.json())
            .then(data => { return data; })
            .catch(error => {
                console.error(error);
            });

        if (response.token) {
            localStorage.setItem('api-token', response.token);
            localStorage.setItem('api-name', response.user.name);
            TOKEN = response.token;
            mainMenuEl.innerHTML = `<button onclick="signOut()">Logga ut - ${response.user.name}</button>`;
        } else {
            document.getElementById('login-input-info').innerHTML = "Felaktig inloggning";
        }
    })
}

function signOut() {
    localStorage.clear();
    mainMenuEl.innerHTML = `<form id="sign-in-form">
    <div class="flex">
      <label for="login-input" class="hide-me">API Token</label>
      <input
        name="token"
        id="login-input"
        placeholder="Ange inloggning - Sex tecken"
        type="text"
        pattern="[A-Fa-f0-9]{6}"
      />
      <input type="submit" value="logga in" id="sign-in" />
    </div>
    <span id="login-input-info" class="api-info"></span>
  </form>`;

}

const newCourseFormEl = document.getElementById("form-new-course");
newCourseFormEl.addEventListener('submit', async function (e) {
    e.preventDefault();
    let it = new FormData(e.target.closest('form'));

    let object = {};
    for (let [key, value] of it.entries()) {
        object[key] = value;
    }

    const meta = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`

        },
        body: JSON.stringify(object)
    }

    const response = await fetch("https://ojaskivi.se/rest_api/public/api/courses", meta)

    if (response.status >= 200 || response.status < 300) {
        newCourseFormEl.reset();
        await fetchText();
        hideForms();
    }
})

async function fetchText(url = API_URL) {
    let response = await fetch(url);
    if (response.status >= 200 || response.status < 300) {
        let data = await response.json();
        printCourses(data);
    }


}

function printCourses(courses) {

    let row = `
    <div class="course-table-head course-table-row">
    <div><span>Kurskod</span>
    <span>Namn</span>
    </div>
    <div>
    <span>Progression</span>
    <span>Universitet</span>
    <span>Kursplan</span></div>
    <span><i class="fas fa-tools"></i></span>
    </div>
    `
    if (courses.length == 0) {
        coursesTableEl.innerHTML = row + "<p class='api-info error'>Inga kurser hittades</p>";
        return;
    }

    courses.forEach((course) => {
        let school = "-";
        let syllabus = "";
        let syllabusRow = "<span>-";

        if (course.school) school = course.school;
        if (course.syllabus) { syllabus = course.syllabus; syllabusRow = `<span><a href="${syllabus}" target="_blank">Kursplan</a></span>` }


        row += `<div class="course-table-row" data-id='${course.id}' data-code='${course.code}' data-name='${course.name}' data-progression='${course.progression}' data-school='${school}' data-syllabus='${syllabus}'>`;
        row += "<div><span>" + course.code + "</span>";
        row += "<span>" + course.name + "</span></div>";
        row += "<div><span>" + course.progression + "</span>";
        row += `<span>${school}</span>`;
        row += syllabusRow;

        row +=
            "</div><span><span class='table-buttons'>" +
            `<button data-id='${course.id}' onclick='showForm(event);' value="edit"><i class="far fa-edit"></i>
            <button data-id='${course.id}' onclick='destroy(this);' value="remove"><i class="fas fa-trash"></i>` +
            "</span></div>";
    });

    coursesTableEl.innerHTML = row;
}

const API_URL = "https://ojaskivi.se/rest_api/public/api/courses";
fetchText(API_URL);

async function destroy(e) {
    if (!TOKEN) {
        alert("Logga in för att ändra eller lägga till en kurs");
        return;
    }

    if (confirm("Vill du radera kursen? Detta går inte att ändra.")) {

        console.log(e);

        let meta = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            }
        }

        //let response = await fetch(`https://ojaskivi.se/rest_api/public/api/courses/${e.dataset.id}`, meta)
        e.closest('.course-table-row').classList.add('removed')

        if (response.status >= 200 || response.status < 300) {

        }
    }
}

let overlayContainerEl = document.getElementById("overlay-container");
let overlayEl = document.getElementById("overlay");

overlayEl.addEventListener("click", function () {
    hideForms();
})

function hideForms() {
    overlayContainerEl.classList.add('hidden');
}

const editCourseFormEl = document.getElementById('form-edit-course');

editCourseFormEl.addEventListener('submit', async function (e) {
    e.preventDefault();
    let form = e.target.closest('form');
    const courseId = form.dataset.id;
    let it = new FormData(form);

    let data = [];
    let object = {};
    for (let [key, value] of it.entries()) {
        object[key] = value;
    }

    let meta = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify(object)
    }


    await fetch(`https://ojaskivi.se/rest_api/public/api/courses/${courseId}`, meta)

    await fetchText();
    hideForms();

})


function fillEditForm(data) {

    editCourseFormEl.dataset.id = data.id;

    const codeInputEl = document.getElementById('edit-course-code');
    codeInputEl.value = data.code;

    const nameInputEl = document.getElementById('edit-course-name');
    nameInputEl.value = data.name;

    const progressionInputEl = document.getElementById('edit-course-progression');
    progressionInputEl.value = data.progression;

    const syllabusInputEl = document.getElementById('edit-course-syllabus');
    syllabusInputEl.value = data.syllabus;

    const schoolInputEl = document.getElementById('edit-course-school');
    schoolInputEl.value = data.school;
}

function showForm(event) {
    newCourseFormEl.style.display = "none";
    editCourseFormEl.style.display = "none";

    if (!TOKEN) {
        alert("Logga in för att ändra eller lägga till en kurs");
        return;
    }

    if (event.target.id == "show-form-new") {
        newCourseFormEl.style.display = "initial";
    } else {
        editCourseFormEl.style.display = "initial";
        fillEditForm(event.target.closest('div').dataset);
    }
    overlayContainerEl.classList.toggle('hidden');
}


