const coursesTableEl = document.getElementById("courses-table");
const searchBarEl = document.getElementById("search-bar");
searchBarEl.addEventListener("keyup", (e) => {
  console.log(searchBarEl.value);
  search(searchBarEl.value);
});

const searchInfoEl = document.getElementById("search-info");

const newCourseFormEl = document.getElementById("newCourseForm");
const addCourseButtonEl = document.getElementById("addCourse");
addCourseButtonEl.addEventListener("click", (e) => {
  e.preventDefault;
  console.log("GET DATA FROM FORM");
});

function search(search) {
  if (search.length < 3) {
    searchInfoEl.innerHTML = "Skriv minst tre tecken";
    for (i = 1; i < tr.length; i++) tr[i].style.display = "";
    return;
  }
  searchInfoEl.innerHTML = "";
  // Declare variables
  var input, filter, table, tr, td, i;
  input = search;
  filter = input.toUpperCase();
  table = coursesTableEl;
  tr = table.getElementsByTagName("tr");
  th = table.getElementsByTagName("th");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 1; i < tr.length; i++) {
    tr[i].style.display = "none";
    for (var j = 0; j < 4; j++) {
      td = tr[i].getElementsByTagName("td")[j];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
          tr[i].style.display = "";
          break;
        }
      }
    }
  }
}

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
                        <th>Raderigera</th>
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
        `<button data-id='${course.id}' onclick='update(this);' value="edit"><i class="far fa-edit"></i><button data-id='${course.id}' onclick='destroy(this);' value="remove"><i class="fas fa-trash"></i>` +
        "</span></td>";
    });
    coursesTableEl.innerHTML = row;
  }
  // handle data
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
