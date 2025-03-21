document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const clearStorageBtn = document.getElementById("clearStorage");
    const trainingContainer = document.getElementById("trainingContainer");
    const settingsModal = document.getElementById("settingsModal");
    const settingsBtn = document.getElementById("settingsBtn");
    const closeModalBtn = document.getElementById("closeModal");

    // Otwieranie modala ustawień
    settingsBtn.addEventListener("click", () => {
        settingsModal.style.display = "block";
    });

    // Zamknięcie modala ustawień
    closeModalBtn.addEventListener("click", () => {
        settingsModal.style.display = "none";
    });

    // Obsługa kliknięcia poza modalem
    window.addEventListener("click", (event) => {
        if (event.target === settingsModal) {
            settingsModal.style.display = "none";
        }
    });

    // Obsługa wgrywania pliku Excel
    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            localStorage.setItem("trainingPlan", JSON.stringify(jsonData));
            displayTrainings(jsonData);
        };

        reader.readAsArrayBuffer(file);
    });

    // Usuwanie danych z LocalStorage
    clearStorageBtn.addEventListener("click", function () {
        localStorage.removeItem("trainingPlan");
        trainingContainer.innerHTML = "";
        alert("Dane zostały usunięte!");
    });

    // Funkcja wyświetlająca treningi
    function displayTrainings(data) {
        trainingContainer.innerHTML = "";
        const groupedTrainings = {};

        data.forEach((row) => {
            if (!groupedTrainings[row.Category]) {
                groupedTrainings[row.Category] = [];
            }
            groupedTrainings[row.Category].push(row);
        });

        Object.keys(groupedTrainings).forEach((category) => {
            const card = document.createElement("div");
            card.classList.add("plan-card");

            const title = document.createElement("h2");
            title.textContent = category;
            card.appendChild(title);

            const header = document.createElement("div");
            header.classList.add("exercise-header");
            header.innerHTML = `<span>Exercise</span><span>Sets / Reps</span>`;
            card.appendChild(header);

            groupedTrainings[category].forEach((exercise) => {
                const exerciseItem = document.createElement("div");
                exerciseItem.classList.add("exercise-item");

                exerciseItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <span class="exercise-name">${exercise.Exercise}</span>
                        <span class="exercise-sets-reps">${exercise.Sets}x ${exercise.Reps}</span>
                    </div>
                    <span class="exercise-target">${exercise.Target}</span>
                `;

                card.appendChild(exerciseItem);
            });

            trainingContainer.appendChild(card);
        });
    }

    // Wczytanie danych z LocalStorage po załadowaniu strony
    const savedData = localStorage.getItem("trainingPlan");
    if (savedData) {
        displayTrainings(JSON.parse(savedData));
    }
});
