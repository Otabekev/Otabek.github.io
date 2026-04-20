// Back to Top button logic: shows the button after scrolling down and scrolls to top when clicked
document.addEventListener("DOMContentLoaded", function() {
    var backBtn = document.getElementById("backToTop");

    if (backBtn) {
        // Show or hide the button based on scroll position
        window.addEventListener("scroll", function() {
            if (window.pageYOffset > 200) {
                backBtn.style.display = "block";
            } else {
                backBtn.style.display = "none";
            }
        });

        // Scroll back to the top when the button is clicked
        backBtn.addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Attach the form submit handler only if the membership form is on the current page
    var form = document.getElementById("membershipForm");
    if (form) {
        form.addEventListener("submit", handleFormSubmit);
    }
});

// Handles the membership form submission and builds the results page
function handleFormSubmit(event) {
    event.preventDefault();

    // Collect all input values into an array of [label, value] pairs
    var data = [];

    data.push(["First Name", document.getElementById("firstName").value]);
    data.push(["Last Name", document.getElementById("lastName").value]);
    data.push(["Email Address", document.getElementById("email").value]);
    data.push(["Phone Number", document.getElementById("phone").value]);
    data.push(["Age", document.getElementById("age").value]);
    data.push(["Weight (kg)", document.getElementById("weight").value]);
    data.push(["Height (cm)", document.getElementById("height").value]);
    data.push(["Date of Birth", document.getElementById("dob").value]);

    // Radio group: find the selected membership plan
    var planRadios = document.getElementsByName("plan");
    var selectedPlan = "";
    for (var i = 0; i < planRadios.length; i++) {
        if (planRadios[i].checked) {
            selectedPlan = planRadios[i].value;
        }
    }
    data.push(["Membership Plan", selectedPlan]);

    // Radio group for gender
    var genderRadios = document.getElementsByName("gender");
    var selectedGender = "";
    for (var g = 0; g < genderRadios.length; g++) {
        if (genderRadios[g].checked) {
            selectedGender = genderRadios[g].value;
        }
    }
    data.push(["Gender", selectedGender]);

    // Checkbox group: collect all checked class interests
    var classBoxes = document.getElementsByName("classes");
    var selectedClasses = [];
    for (var j = 0; j < classBoxes.length; j++) {
        if (classBoxes[j].checked) {
            selectedClasses.push(classBoxes[j].value);
        }
    }
    var classesText = selectedClasses.length > 0 ? selectedClasses.join(", ") : "None selected";
    data.push(["Class Interests", classesText]);

    // Select dropdown value
    var trainerSelect = document.getElementById("trainer");
    data.push(["Preferred Trainer", trainerSelect.options[trainerSelect.selectedIndex].text]);

    // Select dropdown for schedule
    var timeSelect = document.getElementById("time");
    data.push(["Preferred Time Slot", timeSelect.options[timeSelect.selectedIndex].text]);

    // Textarea value
    data.push(["Fitness Goals", document.getElementById("goals").value]);

    // Build the results page using DOM creation methods only
    buildResultsPage(data);
}

// Opens a new window and builds a full HTML page containing the results table
function buildResultsPage(data) {
    var newWin = window.open("", "_blank");

    var doc = newWin.document;

    // Set the document title
    doc.title = "Iron Forge Gym - Registration Summary";

    // Add a link to the shared stylesheet so the results page matches the site theme
    var link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/styles.css";
    doc.head.appendChild(link);

    // Build the header section
    var header = doc.createElement("header");
    var brand = doc.createElement("div");
    brand.className = "brand";
    var logo = doc.createElement("img");
    logo.src = "assets/logo.svg";
    logo.alt = "Iron Forge Gym Logo";
    var title = doc.createElement("h1");
    var titlePart1 = doc.createTextNode("IRON ");
    var titlePart2 = doc.createElement("span");
    titlePart2.textContent = "FORGE";
    title.appendChild(titlePart1);
    title.appendChild(titlePart2);
    brand.appendChild(logo);
    brand.appendChild(title);
    header.appendChild(brand);
    doc.body.appendChild(header);

    // Main content container
    var main = doc.createElement("main");

    var section = doc.createElement("section");
    var heading = doc.createElement("h2");
    heading.textContent = "Registration Summary";
    section.appendChild(heading);

    var intro = doc.createElement("p");
    intro.innerHTML = "Thank you for joining <strong>Iron Forge Gym</strong>. The table below shows the details you submitted.";
    section.appendChild(intro);

    // Build the table with a header row and two data columns
    var table = doc.createElement("table");
    table.className = "results-table";

    var thead = doc.createElement("thead");
    var headerRow = doc.createElement("tr");
    var th1 = doc.createElement("th");
    th1.textContent = "Field";
    var th2 = doc.createElement("th");
    th2.textContent = "Your Details";
    headerRow.appendChild(th1);
    headerRow.appendChild(th2);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Fill the table body with every piece of data collected from the form
    var tbody = doc.createElement("tbody");
    for (var k = 0; k < data.length; k++) {
        var row = doc.createElement("tr");
        var cell1 = doc.createElement("td");
        cell1.textContent = data[k][0];
        var cell2 = doc.createElement("td");
        // If a value is empty, show a placeholder so every cell is filled
        cell2.textContent = data[k][1] && data[k][1].length > 0 ? data[k][1] : "Not provided";
        row.appendChild(cell1);
        row.appendChild(cell2);
        tbody.appendChild(row);
    }
    table.appendChild(tbody);

    section.appendChild(table);

    // Back link so the user can return to the register page
    var backPara = doc.createElement("p");
    backPara.className = "back-para";
    var backLink = doc.createElement("a");
    backLink.href = "register.html";
    backLink.textContent = "Back to Registration";
    backLink.className = "btn";
    backPara.appendChild(backLink);
    section.appendChild(backPara);

    main.appendChild(section);
    doc.body.appendChild(main);

    // Add a footer
    var footer = doc.createElement("footer");
    var copy = doc.createElement("p");
    copy.className = "copyright";
    copy.textContent = "Iron Forge Gym - Your membership is one step closer!";
    footer.appendChild(copy);
    doc.body.appendChild(footer);
}
