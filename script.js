document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const clearStorageBtn = document.getElementById("clearStorage");
    const trainingContainer = document.getElementById("trainingContainer");
    const settingsModal = document.getElementById("settingsModal");
    const settingsBtn = document.getElementById("settingsBtn");
    const closeModalBtn = document.getElementById("closeModal");
    const themeSwitch = document.getElementById("themeSwitch");

    function getCategoryIcons(category) {
        const icons = {
            "Push": ["push-icon1.png", "push-icon2.png", "push-icon3.png"],
            "Pull": ["pull-icon1.png", "pull-icon2.png", "pull-icon3.png"],
            "Leg": ["leg-icon1.png", "leg-icon2.png", "leg-icon3.png"],
            "ABS": ["abs-icon1.png", "abs-icon2.png"]
        };
        return icons[category] || [];
    }

    settingsBtn?.addEventListener("click", () => {
        settingsModal.style.display = "block";
    });

    closeModalBtn?.addEventListener("click", () => {
        settingsModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === infoModal) {
            infoModal.style.display = "none";
        }
    });


    window.addEventListener("click", (event) => {
        if (event.target === settingsModal) {
            settingsModal.style.display = "none";
        }
    });

    fileInput?.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rawData = XLSX.utils.sheet_to_json(sheet);

            const jsonData = {};

            rawData.forEach(row => {
                const category = row.Category;
                if (!jsonData[category]) {
                    jsonData[category] = {
                        icon: getCategoryIcons(category),
                        exercises: []
                    };
                }
                jsonData[category].exercises.push({
                    name: row.Exercise,
                    sets: row.Sets,
                    reps: row.Reps,
                    target: row.Target
                });
            });

            localStorage.setItem("trainingPlan", JSON.stringify(jsonData));
            displayTrainings(jsonData);
        };

        reader.readAsArrayBuffer(file);
    });

    clearStorageBtn?.addEventListener("click", function () {
        localStorage.removeItem("trainingPlan");
        trainingContainer.innerHTML = "";
        alert("Dane zostały usunięte!");
    });

    function displayTrainings(data) {
        trainingContainer.innerHTML = "";

        Object.keys(data).forEach((category) => {
            const section = document.createElement("div");
            section.classList.add("plan-wrapper");

            const card = document.createElement("div");
            card.classList.add("plan-card");

            const title = document.createElement("h2");
            title.textContent = category;
            card.appendChild(title);

            if (data[category].icon && data[category].icon.length > 0) {
                const iconContainer = document.createElement("div");
                iconContainer.classList.add("icon-container");

                data[category].icon.forEach((icon) => {
                    const img = document.createElement("img");
                    img.src = `./icons/${icon}`;
                    img.alt = category;
                    img.classList.add("workout-icon");
                    iconContainer.appendChild(img);
                });
                card.appendChild(iconContainer);
            }

            const header = document.createElement("div");
            header.classList.add("exercise-header");
            header.innerHTML = `<span>Exercise</span><span>Sets / Reps</span>`;
            card.appendChild(header);

            data[category].exercises.forEach((exercise) => {
                const exerciseItem = document.createElement("div");
                exerciseItem.classList.add("exercise-item");

                exerciseItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <span class="exercise-name">${exercise.name}</span>
                        <span class="exercise-sets-reps">${exercise.sets}x ${exercise.reps}</span>
                    </div>
                    <span class="exercise-target">${exercise.target}</span>
                `;

                card.appendChild(exerciseItem);
            });

            section.appendChild(card);
            trainingContainer.appendChild(section);
        });
    }

    const savedData = localStorage.getItem("trainingPlan");
    if (savedData) {
        displayTrainings(JSON.parse(savedData));
    }

    // DARK/LIGHT MODE HANDLER
    function setTheme(isDark) {
        const logoImg = document.getElementById("logoImg");
        const settingIcon = document.getElementById("settingIcon");
    
        if (isDark) {
            document.body.classList.add("dark-mode");
            document.body.classList.remove("light-mode");
            localStorage.setItem("theme", "dark");
            themeSwitch.checked = true;
            logoImg.src = "img/logo-light.png";
            settingIcon.src = "img/settings-icon-dark.png";

        } else {
            document.body.classList.add("light-mode");
            document.body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
            themeSwitch.checked = false;
            logoImg.src = "img/logo-dark.png";
            settingIcon.src = "img/settings-icon-light.png";

        }
    }
    

    themeSwitch?.addEventListener("change", (e) => {
        setTheme(e.target.checked);
    });

    const savedTheme = localStorage.getItem("theme");
    setTheme(savedTheme === "dark");
});
