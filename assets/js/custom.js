document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contact-form");
    const results = document.getElementById("contact-results");
    const averageBox = document.getElementById("contact-average");
    const popup = document.getElementById("popup-success");

    // ---- Function to color-code rating inputs ----
    function applyRatingColor(input) {
        const value = Number(input.value);

        if (value <= 4) {
            input.style.backgroundColor = "#ffb3b3";   // light red
        }
        else if (value <= 7) {
            input.style.backgroundColor = "#ffd9b3";   // light orange
        }
        else if (value <= 10) {
            input.style.backgroundColor = "#c2f0c2";   // light green
        }
        else {
            input.style.backgroundColor = "white";
        }
    }

    // Add live color update to rating inputs
    ["rating1", "rating2", "rating3"].forEach(id => {
        const input = form[id];
        input.addEventListener("input", () => applyRatingColor(input));
    });

    // ---- Form submission handling ----
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const data = {
            name: form.name.value.trim(),
            surname: form.surname.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            address: form.address.value.trim(),
            rating1: Number(form.rating1.value),
            rating2: Number(form.rating2.value),
            rating3: Number(form.rating3.value),
        };

        // Helper tag generation
        const tag = Array.from({ length: 5 }, () =>
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
                Math.floor(Math.random() * 36)
            )
        ).join("");

        data.helperTag = "FE24-JS-CF-" + tag;

        console.log("Submitted data:", data);

        // Display results
        results.innerHTML = `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Surname:</strong> ${data.surname}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Helper tag:</strong> ${data.helperTag}</p>
    
        // Calculate average
        const avg = ((data.rating1 + data.rating2 + data.rating3) / 3).toFixed(1);
        averageBox.textContent = `${data.name} ${data.surname}: ${avg}`;

        // Color-code average
        if (avg <= 4) {
            averageBox.style.color = "red";
        } else if (avg <= 7) {
            averageBox.style.color = "orange";
        } else {
            averageBox.style.color = "green";
        }

        // Show popup
        popup.style.display = "block";
        setTimeout(() => popup.style.display = "none", 3000);

    });
});
