document.addEventListener("DOMContentLoaded", () => {
    // Na początku puste macroData
    let macroData = {};

    // Sprawdzenie localStorage, jeśli jest zapisane, uzupełniamy macroData
    if (localStorage.getItem('macroData')) {
        macroData = JSON.parse(localStorage.getItem('macroData'));
    }

    const logoImg = document.getElementById("logoImg");
    const infoModal = document.getElementById("infoModal");
    const infoContent = document.getElementById("infoContent");
    const macroCalcModal = document.getElementById("macroCalcModal");
    const closeCalcModal = document.getElementById("closeCalcModal");

    // Funkcja renderująca infoModal
    function renderInfoModal() {
        const content = macroData.calories ? `
            <button id="openCalcModal">Oblicz swoje makro</button>
            <h2>Zapotrzebowanie kcal na: <br><br>
                ${macroData.goal}<br><br>
                <strong>${macroData.calories}</strong>
            </h2>
            <br><br>
            <p>Białko: <strong>${macroData.protein}</strong></p>
            <p>Tłuszcz: <strong>${macroData.fat}</strong></p>
            <p>Węglowodany: <strong>${macroData.carbs}</strong></p>
            <p>Błonnik: <strong>${macroData.fiber}</strong></p>
            <button id="closeInfoModal">Close</button>
        ` : `
            <button id="openCalcModal">Oblicz swoje makro</button>
            <h2>Brak danych. Oblicz swoje makro!</h2>
            <button id="closeInfoModal">Close</button>
        `;

        infoContent.innerHTML = content;

        infoModal.style.display = "block";

        // Obsługa zamknięcia infoModal
        document.getElementById("closeInfoModal").addEventListener("click", () => {
            infoModal.style.display = "none";
        });

        // Obsługa otwarcia kalkulatora
        document.getElementById("openCalcModal").addEventListener("click", () => {
            macroCalcModal.style.display = "block";
        });
    }

    // Kliknięcie w logo otwiera infoModal
    logoImg.addEventListener("click", renderInfoModal);

    // Zamknięcie kalkulatora
    closeCalcModal.addEventListener("click", () => {
        macroCalcModal.style.display = "none";
    });

    // Zamknięcie modali po kliknięciu poza
    window.addEventListener("click", (event) => {
        if (event.target === infoModal) {
            infoModal.style.display = "none";
        }
        if (event.target === macroCalcModal) {
            macroCalcModal.style.display = "none";
        }
    });

    // Kalkulator
    function calculateMacros(weight, height, age, activity, goal) {
        const BMR = 10 * weight + 6.25 * height - 5 * age + 5;
        let calories = BMR * activity;
        if (goal === 'cut') calories -= 300;
        if (goal === 'bulk') calories += 300;

        const protein = weight * 2;
        const fat = weight * 0.8;
        const carbs = (calories - (protein * 4 + fat * 9)) / 4;

        return {
            calories: Math.round(calories),
            protein: Math.round(protein),
            fat: Math.round(fat),
            carbs: Math.round(carbs)
        };
    }

    // Obliczenie makro + zapis do localStorage
    document.getElementById("calculateBtn").addEventListener("click", () => {
        const weight = parseFloat(document.getElementById("weight").value);
        const height = parseFloat(document.getElementById("height").value);
        const age = parseInt(document.getElementById("age").value);
        const activity = parseFloat(document.getElementById("activity").value);
        const goal = document.getElementById("goal").value;

        if (!weight || !height || !age) {
            alert("Uzupełnij wszystkie pola!");
            return;
        }

        const result = calculateMacros(weight, height, age, activity, goal);

        document.getElementById("result").innerHTML = `
            <p>Kalorie: <strong>${result.calories} kcal</strong></p>
            <p>Białko: <strong>${result.protein} g</strong></p>
            <p>Tłuszcz: <strong>${result.fat} g</strong></p>
            <p>Węglowodany: <strong>${result.carbs} g</strong></p>
        `;

        // Aktualizacja danych + zapis
        macroData = {
            calories: `${result.calories} kcal`,
            goal: goal === 'cut' ? 'Redukcja' : goal === 'bulk' ? 'Masa' : 'Utrzymanie wagi',
            protein: `${result.protein} g`,
            fat: `${result.fat} g`,
            carbs: `${result.carbs} g`,
            fiber: "20-38 g"
        };
        localStorage.setItem('macroData', JSON.stringify(macroData));
    });
});