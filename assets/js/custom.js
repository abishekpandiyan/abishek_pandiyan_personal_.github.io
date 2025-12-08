/* ============================================================
   custom.js – Contact form logic for Lonely template
   Author: Abishek Pandiyan (EKFU 24)

   This file implements the required functionality:
   - Extends the contact form
   - Collects values on submit
   - Stores them in a JS object
   - Logs the object to the console
   - Displays the values below the form
   - Generates a helper tag
   - Computes and color-codes the average rating
   - Shows a success popup
   ============================================================ */

// Run the code only after the HTML document has loaded
document.addEventListener("DOMContentLoaded", function () {
    // 1. Grab the form element by its id (you must set id="contact-form" on your form)
    const form = document.getElementById("contact-form");

    // 2. Containers for displaying results and average below the form
    const resultsContainer = document.getElementById("contact-results");
    const averageContainer = document.getElementById("contact-average");

    // 3. If any of these elements are missing, stop – avoids JS errors
    if (!form || !resultsContainer || !averageContainer) {
        console.warn(
            "Contact form or results containers not found. Check element ids: contact-form, contact-results, contact-average."
        );
        return;
    }

    // 4. Create a popup element for success notification (hidden by default)
    const successPopup = createSuccessPopup();

    // 5. Attach the submit event handler to the form
    form.addEventListener("submit", function (event) {
        // Prevent the browser from reloading the page
        event.preventDefault();

        // 6. Read all form values from inputs by their name attributes
        const name = form.elements["name"]?.value.trim() || "";
        const surname = form.elements["surname"]?.value.trim() || "";
        const email = form.elements["email"]?.value.trim() || "";
        const phone = form.elements["phone"]?.value.trim() || "";
        const address = form.elements["address"]?.value.trim() || "";

        const rating1 = parseFloat(form.elements["rating1"]?.value);
        const rating2 = parseFloat(form.elements["rating2"]?.value);
        const rating3 = parseFloat(form.elements["rating3"]?.value);

        // 7. Basic validation – ensure required fields and ratings are present
        if (!name || !surname || !email || !phone || !address) {
            alert("Please fill in all text fields before submitting the form.");
            return;
        }

        if (
            isNaN(rating1) ||
            isNaN(rating2) ||
            isNaN(rating3) ||
            rating1 < 0 ||
            rating1 > 10 ||
            rating2 < 0 ||
            rating2 > 10 ||
            rating3 < 0 ||
            rating3 > 10
        ) {
            alert("Please provide valid ratings between 0 and 10 for all three questions.");
            return;
        }

        // 8. Generate the helper tag (random 5-character uppercase/digit code)
        const helperTag = generateHelperTag();

        // 9. Create a JavaScript object representing the form data
        const formData = {
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            address: address,
            rating1: rating1,
            rating2: rating2,
            rating3: rating3,
            helperTag: helperTag
        };

        // 10. Print the object to the browser console
        console.log("Contact form submission:", formData);

        // 11. Display the data below the form, one item per line
        displayFormData(formData, resultsContainer);

        // 12. Compute the average of the three ratings
        const average = calculateAverage(rating1, rating2, rating3);

        // 13. Display and color-code the average value
        displayAverage(name, surname, average, averageContainer);

        // 14. If everything is successful, show the popup notification
        showSuccessPopup(successPopup);
    });
});

/* ============================================================
   Helper functions
   ============================================================ */

/**
 * Generates a helper tag string like:
 *  "FE24-JS-CF-7KQ9B"
 */
function generateHelperTag() {
    const prefix = "FE24-JS-CF-";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }

    return prefix + code;
}

/**
 * Displays the form data in the results container
 * as separate lines, matching the example in the assignment.
 */
function displayFormData(data, container) {
    container.innerHTML = ""; // clear previous results

    const lines = [
        `Name: ${data.name}`,
        `Surname: ${data.surname}`,
        `Email: ${data.email}`,
        `Phone number: ${data.phone}`,
        `Address: ${data.address}`,
        `Rating 1: ${data.rating1}`,
        `Rating 2: ${data.rating2}`,
        `Rating 3: ${data.rating3}`,
        `Helper tag: ${data.helperTag}`
    ];

    lines.forEach((text) => {
        const lineElem = document.createElement("p");
        lineElem.textContent = text;
        container.appendChild(lineElem);
    });
}

/**
 * Computes the average of three numeric ratings.
 */
function calculateAverage(r1, r2, r3) {
    return (r1 + r2 + r3) / 3;
}

/**
 * Displays the average rating in the format:
 * "Name Surname: 4.8"
 * and color-codes the number:
 *  0–4   → red
 *  4–7   → orange
 *  7–10  → green
 */
function displayAverage(name, surname, average, container) {
    // Round to one decimal place for display
    const averageRounded = average.toFixed(1);

    // Clear any previous content
    container.innerHTML = "";

    const labelSpan = document.createElement("span");
    labelSpan.textContent = `${name} ${surname}: `;

    const valueSpan = document.createElement("span");
    valueSpan.textContent = averageRounded;

    // Color-coding the average
    // Here we interpret:
    //  [0,4)  → red
    //  [4,7)  → orange
    //  [7,10] → green
    if (average < 4) {
        valueSpan.style.color = "red";
    } else if (average < 7) {
        valueSpan.style.color = "orange";
    } else {
        valueSpan.style.color = "green";
    }

    container.appendChild(labelSpan);
    container.appendChild(valueSpan);
}

/**
 * Creates a popup div element for success messages,
 * styles it, hides it initially, and appends it to <body>.
 */
function createSuccessPopup() {
    const popup = document.createElement("div");
    popup.id = "form-success-popup";
    popup.textContent = "Form submitted successfully!";

    // Basic styling – you can refine in CSS as well
    popup.style.position = "fixed";
    popup.style.left = "50%";
    popup.style.top = "20px";
    popup.style.transform = "translateX(-50%)";
    popup.style.backgroundColor = "#4caf50";
    popup.style.color = "#ffffff";
    popup.style.padding = "10px 20px";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.25)";
    popup.style.zIndex = "9999";
    popup.style.display = "none";

    document.body.appendChild(popup);
    return popup;
}

/**
 * Displays the success popup temporarily.
 */
function showSuccessPopup(popup) {
    popup.style.display = "block";

    // Hide after 3 seconds
    setTimeout(function () {
        popup.style.display = "none";
    }, 3000);
}
