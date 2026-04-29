/**
 * External JavaScript for all pages
 *
 * Features:
 *  - Back to Top button
 *  - Scroll-triggered reveal animations
 *  - Animated stat counters
 *  - Trainer skill bars
 *  - Accordion / FAQ
 *  - Membership form handler with DOM-built results page
 *  - Toast notifications
 *  - Live form validation
 */

/* ============================================================
   DOM Ready
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {

    // --- Back to Top Button ---
    initBackToTop();

    // --- Scroll Reveal ---
    initReveal();

    // --- Animated Counters ---
    initCounters();

    // --- Skill / Stat Bars ---
    initStatBars();

    // --- Accordion ---
    initAccordion();

    // --- Membership Form ---
    var form = document.getElementById("membershipForm");
    if (form) {
        initFormValidation(form);
        form.addEventListener("submit", handleFormSubmit);
    }
});

/* ============================================================
   Back to Top
   ============================================================ */
function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;

    // Listen for scroll events to show or hide the button
    window.addEventListener("scroll", function () {
        if (window.pageYOffset > 300) {
            btn.style.display = "flex";
        } else {
            btn.style.display = "none";
        }
    });

    // Scroll to top smoothly when the button is clicked
    btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ============================================================
   Scroll Reveal Animation
   ============================================================ */
function initReveal() {
    // Select all elements marked for reveal
    var revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;

    // Use IntersectionObserver for performance
    var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                entries[i].target.classList.add("visible");
                observer.unobserve(entries[i].target);
            }
        }
    }, { threshold: 0.12 });

    for (var j = 0; j < revealEls.length; j++) {
        observer.observe(revealEls[j]);
    }
}

/* ============================================================
   Animated Stat Counters
   ============================================================ */
function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    var counterObserver = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                animateCounter(entries[i].target);
                counterObserver.unobserve(entries[i].target);
            }
        }
    }, { threshold: 0.5 });

    for (var j = 0; j < counters.length; j++) {
        counterObserver.observe(counters[j]);
    }
}

/**
 * Animates a counter element from 0 to its data-count value.
 * Uses requestAnimationFrame for smooth animation.
 */
function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600; // ms
    var start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        // Ease-out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target + suffix;
        }
    }
    requestAnimationFrame(step);
}

/* ============================================================
   Skill / Stat Bars
   ============================================================ */
function initStatBars() {
    var bars = document.querySelectorAll(".stat-bar-fill");
    if (!bars.length) return;

    var barObserver = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                var el = entries[i].target;
                el.style.width = el.getAttribute("data-width") + "%";
                barObserver.unobserve(el);
            }
        }
    }, { threshold: 0.3 });

    for (var j = 0; j < bars.length; j++) {
        barObserver.observe(bars[j]);
    }
}

/* ============================================================
   Accordion / FAQ
   ============================================================ */
function initAccordion() {
    var buttons = document.querySelectorAll(".accordion-btn");
    if (!buttons.length) return;

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            var content = this.nextElementSibling;
            var isOpen = this.classList.contains("open");

            // Close all
            var allBtns = document.querySelectorAll(".accordion-btn");
            for (var k = 0; k < allBtns.length; k++) {
                allBtns[k].classList.remove("open");
                allBtns[k].setAttribute("aria-expanded", "false");
                var c = allBtns[k].nextElementSibling;
                if (c) c.classList.remove("open");
            }

            // Toggle clicked one
            if (!isOpen) {
                this.classList.add("open");
                this.setAttribute("aria-expanded", "true");
                if (content) content.classList.add("open");
            }
        });
    }
}

/* ============================================================
   Live Form Validation
   ============================================================ */
function initFormValidation(form) {
    // Validate text inputs on blur
    var inputs = form.querySelectorAll("input[required], select[required], textarea[required]");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("blur", function () {
            validateField(this);
        });
        inputs[i].addEventListener("input", function () {
            if (this.classList.contains("invalid")) validateField(this);
        });
    }
}

/**
 * Validates a single form field and adds visual feedback classes.
 */
function validateField(field) {
    var hint = field.parentElement.querySelector(".field-hint");
    if (!hint) {
        hint = document.createElement("span");
        hint.className = "field-hint";
        field.parentElement.appendChild(hint);
    }

    // Check validity
    if (!field.checkValidity() || field.value.trim() === "") {
        field.classList.remove("valid");
        field.classList.add("invalid");
        hint.className = "field-hint error";
        hint.textContent = field.validationMessage || "This field is required.";
    } else {
        field.classList.remove("invalid");
        field.classList.add("valid");
        hint.className = "field-hint success";
        hint.textContent = "✓ Looks good";
    }
}

/* ============================================================
   Toast Notification
   ============================================================ */
function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function () {
        toast.classList.remove("show");
    }, 3500);
}

/* ============================================================
   Form Submission Handler
   ============================================================ */
function handleFormSubmit(event) {
    event.preventDefault();

    // Collect all form data into an array of [label, value] pairs
    var data = [];

    data.push(["First Name",      document.getElementById("firstName").value]);
    data.push(["Last Name",       document.getElementById("lastName").value]);
    data.push(["Email Address",   document.getElementById("email").value]);
    data.push(["Phone Number",    document.getElementById("phone").value]);
    data.push(["Age",             document.getElementById("age").value]);
    data.push(["Weight (kg)",     document.getElementById("weight").value]);
    data.push(["Height (cm)",     document.getElementById("height").value]);
    data.push(["Date of Birth",   document.getElementById("dob").value]);

    // --- Loop through radio buttons for Membership Plan ---
    var planRadios = document.getElementsByName("plan");
    var selectedPlan = "Not selected";
    for (var i = 0; i < planRadios.length; i++) {
        if (planRadios[i].checked) {
            selectedPlan = planRadios[i].value;
            break;
        }
    }
    data.push(["Membership Plan", selectedPlan]);

    // --- Loop through radio buttons for Gender ---
    var genderRadios = document.getElementsByName("gender");
    var selectedGender = "Not specified";
    for (var g = 0; g < genderRadios.length; g++) {
        if (genderRadios[g].checked) {
            selectedGender = genderRadios[g].value;
            break;
        }
    }
    data.push(["Gender", selectedGender]);

    // --- Loop through checkboxes for Class Interests ---
    var classBoxes = document.getElementsByName("classes");
    var selectedClasses = [];
    for (var j = 0; j < classBoxes.length; j++) {
        if (classBoxes[j].checked) {
            selectedClasses.push(classBoxes[j].value);
        }
    }
    var classesText = selectedClasses.length > 0 ? selectedClasses.join(", ") : "None selected";
    data.push(["Class Interests", classesText]);

    // --- Select dropdowns ---
    var trainerSelect = document.getElementById("trainer");
    data.push(["Preferred Trainer", trainerSelect.options[trainerSelect.selectedIndex].text]);

    var timeSelect = document.getElementById("time");
    data.push(["Preferred Time Slot", timeSelect.options[timeSelect.selectedIndex].text]);

    var fitnessLevelSelect = document.getElementById("fitnessLevel");
    data.push(["Current Fitness Level", fitnessLevelSelect.options[fitnessLevelSelect.selectedIndex].text]);

    var hearAboutSelect = document.getElementById("hearAbout");
    data.push(["How You Heard About Us", hearAboutSelect.options[hearAboutSelect.selectedIndex].text]);

    // --- Textarea ---
    data.push(["Fitness Goals", document.getElementById("goals").value]);

    // Build the results page with all collected data
    buildResultsPage(data);
}

/* ============================================================
   Build Results Page (DOM API only)
   ============================================================ */
/**
 * Opens a new browser tab and constructs a full HTML results page
 * using the DOM API exclusively. Populates a two-column table with
 * all submitted form fields.
 *
 * @param {Array} data - Array of [fieldLabel, fieldValue] pairs
 */
function buildResultsPage(data) {
    var newWin = window.open("", "_blank");
    if (!newWin) {
        showToast("⚠ Pop-up blocked. Please allow pop-ups and try again.");
        return;
    }

    var doc = newWin.document;
    doc.title = "Iron Forge Gym – Registration Summary";

    // ---- <head> ----
    var meta = doc.createElement("meta");
    meta.setAttribute("charset", "UTF-8");
    doc.head.appendChild(meta);

    var viewport = doc.createElement("meta");
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1.0";
    doc.head.appendChild(viewport);

    // Link to shared CSS so results page matches site theme
    var link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/styles.css";
    doc.head.appendChild(link);

    // ---- <body> ----
    doc.body.id = "top";

    // Header
    var header = doc.createElement("header");
    var brand = doc.createElement("div");
    brand.className = "brand";
    var logo = doc.createElement("img");
    logo.src = "assets/logo.svg";
    logo.alt = "Iron Forge Gym Logo";
    var h1 = doc.createElement("h1");
    var t1 = doc.createTextNode("IRON ");
    var span = doc.createElement("span");
    span.textContent = "FORGE";
    h1.appendChild(t1);
    h1.appendChild(span);
    brand.appendChild(logo);
    brand.appendChild(h1);
    header.appendChild(brand);
    doc.body.appendChild(header);

    // Main
    var main = doc.createElement("main");

    var section = doc.createElement("section");
    section.className = "reveal visible";

    var h2 = doc.createElement("h2");
    h2.textContent = "Registration Summary";
    section.appendChild(h2);

    var intro = doc.createElement("p");
    intro.innerHTML = "Thank you for joining <strong>Iron Forge Gym</strong>. Your registration details are shown below. We will be in touch soon!";
    section.appendChild(intro);

    // Build the results table — header + two data columns
    var table = doc.createElement("table");
    table.className = "results-table";

    // Table header row
    var thead = doc.createElement("thead");
    var headRow = doc.createElement("tr");
    var th1 = doc.createElement("th");
    th1.textContent = "Field";
    var th2 = doc.createElement("th");
    th2.textContent = "Your Details";
    headRow.appendChild(th1);
    headRow.appendChild(th2);
    thead.appendChild(headRow);
    table.appendChild(thead);

    // Table body — loop through all collected data
    var tbody = doc.createElement("tbody");
    for (var k = 0; k < data.length; k++) {
        var row = doc.createElement("tr");

        var td1 = doc.createElement("td");
        td1.textContent = data[k][0]; // Field label

        var td2 = doc.createElement("td");
        // Conditional: show placeholder when value is empty
        if (data[k][1] && String(data[k][1]).trim().length > 0) {
            td2.textContent = data[k][1];
        } else {
            td2.textContent = "Not provided";
            td2.className = "muted-value";
        }

        row.appendChild(td1);
        row.appendChild(td2);
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    section.appendChild(table);

    // Back link
    var backP = doc.createElement("p");
    backP.className = "results-actions";
    var backLink = doc.createElement("a");
    backLink.href = "register.html";
    backLink.className = "btn";
    backLink.textContent = "← Back to Registration";
    backP.appendChild(backLink);
    section.appendChild(backP);

    main.appendChild(section);
    doc.body.appendChild(main);

    // Footer
    var footer = doc.createElement("footer");
    var footerInner = doc.createElement("div");
    footerInner.className = "footer-bottom results-footer";
    var copy = doc.createElement("p");
    copy.textContent = "© 2026 Iron Forge Gym. All rights reserved.";
    footerInner.appendChild(copy);
    footer.appendChild(footerInner);
    doc.body.appendChild(footer);

    // Close write stream
    doc.close();
}
