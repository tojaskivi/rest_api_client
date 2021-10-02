const coursesTableEl = document.getElementById("courses-table");
const searchBarEl = document.getElementById("search-bar");
searchBarEl.addEventListener("keyup", (e) => {
    console.log(searchBarEl.value);
    search(searchBarEl.value);
});

const searchInfoEl = document.getElementById("search-info");

const newCourseFormEl = document.getElementById("form-new-course");
const addCourseButtonEl = document.getElementById("addCourse");
addCourseButtonEl.addEventListener("click", (e) => {
    e.preventDefault;
    console.log("GET DATA FROM FORM");
});

async function fetchText(url, searchTerm = "") {
    let response = await fetch(url + searchTerm);

    console.log(response.status); // 200
    console.log(response.statusText); // OK

    if (response.status === 200) {
        let data = await response.json();
        let row = `
    <thead>
                    <tr>
                        <th>Kurskod</th>
                        <th>Namn</th>
                        <th>Progression</th>
                        <th>Universitet</th>
                        <th>Kursplan</th>
                        <th>Inställningar</th>
                    </tr>
                </thead>`;

        data.forEach((course) => {
            row += "<tr>";
            row += "<td>" + course.code + "</td>";
            row += "<td>" + course.name + "</td>";
            row += "<td>" + course.progression + "</td>";

            if (course.school) row += "<td>" + course.school + "</td>";
            else row += "<td>";
            if (course.syllabus) {
                row +=
                    "<td>" +
                    `<a href="${course.syllabus}" target="_blank">Kursplan</a>` +
                    "</td>";
            } else row += "<td>";
            row +=
                "<td><span class='table-buttons'>" +
                `<button data-id='${course.id}' onclick='update(this);' value="edit"><i class="far fa-edit"></i>
                <button data-id='${course.id}' onclick='destroy(this);' value="remove"><i class="fas fa-trash"></i>` +
                "</span></td>";
        });
        coursesTableEl.innerHTML = row;
    }
}

const API_URL = "https://ojaskivi.se/rest_api/public/api/courses";
fetchText(API_URL);

function update(e) {
    console.log(e.dataset.id);
}

function destroy(e) {
    if (confirm("Vill du radera kursen? Detta går inte att ändra.")) {
        e.parentNode.parentNode.classList.add("strikeout");
        fetch(API_URL + `/${e.dataset.id}`, {
            method: "GET",
        }).then((res) => {
            console.log("Request complete:", res);
        });
    }
}

let overlayContainerEl = document.getElementById("overlay-container");
let overlayEl = document.getElementById("overlay");

overlayEl.addEventListener("click", function () {
    hideForms();
})

function hideForms(){
    overlayContainerEl.classList.add('hidden');
}

function addNewCourse() {
    overlayContainerEl.classList.toggle('hidden');
}