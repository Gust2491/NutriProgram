// Dette script hører til Meal Tracker Siden
// Funktion til at fjerne et Meal fra localStorage.
function deleteMeal(index) {
    const meals = JSON.parse(localStorage.getItem("meals")) || [];
    meals.splice(index, 1);
    localStorage.setItem("meals", JSON.stringify(meals));
    location.reload();
}

// Funktion til at opdatere et Meals foodItems mængder
function updateMeal(index) {
    const meals = JSON.parse(localStorage.getItem("meals")) || [];
    const mealToUpdate = meals[index];

    // Laver en div, som vil være hvor man kan ændre værdierne for de enkelte meals.
    const updateForm = document.createElement("div");
    updateForm.innerHTML = `<h3>Update Meal</h3>`;

    for (let i = 0; i < mealToUpdate.foodItems.length; i++) {
        const foodItem = mealToUpdate.foodItems[i];

        updateForm.innerHTML += `
            <div id="Updater">
                <label for="newQuantity-${i}">New Quantity for ${meals[index].foodItems[i].foodName}:</label>
                <input type="number" id="newQuantity-${i}" value="${foodItem.quantity}">
            </div>
        `;
    }
    updateForm.innerHTML += `<button id="upBtn"onclick="confirmUpdate(${index})">Confirm Update</button>`;
    const mealDiv = document.getElementById(`meal-${index}`);
    mealDiv.innerHTML = "";
    mealDiv.appendChild(updateForm);
}

//Funktion til en knap som sikre og opdatere når de nye værdier er indtastet
function confirmUpdate(index) {
    const meals = JSON.parse(localStorage.getItem("meals")) || [];
    const mealToUpdate = meals[index];

    for (let i = 0; i < mealToUpdate.foodItems.length; i++) {
        const newQuantity = parseFloat(document.getElementById(`newQuantity-${i}`).value);
        mealToUpdate.foodItems[i].quantity = newQuantity;
    }

    meals[index] = mealToUpdate;
    localStorage.setItem("meals", JSON.stringify(meals));
    location.reload();
}

// Funktionen som viser alle meals på Meal Tracker siden.
function displayTrackMeals() {
    const mealArea = document.getElementById("MealsArea");
    const meals = JSON.parse(localStorage.getItem("meals")) || [];
    let numOfIngredi = 0;
    let mealQuant = 0;

    for (let i = 0; i < meals.length; i++) {
        const mealDiv = document.createElement("div");
        mealDiv.className = "trackMeal";
        mealDiv.id = `meal-${i}`; // Add an ID for easy reference

        let totalNutriArray = Array(5).fill(0);

        for (let j = 0; j < meals[i].foodItems.length; j++) {
            numOfIngredi++;
            mealQuant += parseFloat(meals[i].foodItems[j].quantity);

            for (let l = 0; l < meals[i].foodItems[j].Nutri.length; l++) {
                totalNutriArray[l] += meals[i].foodItems[j].Nutri[l] * meals[i].foodItems[j].quantity;
            }
        }

        mealDiv.innerHTML = `
            <p id="nameMeal">${meals[i].name}</p>
            <div>
            <p> ${mealQuant} g</p>
            <p> ${totalNutriArray[0].toFixed(2)} Kcal</p>
            </div>
            <p>${meals[i].date}</p>
            <div id="NutriGrid">
            <p id="p1" > ${totalNutriArray[1].toFixed(2)} g/Protein</p>
            <p id="p2"> ${totalNutriArray[2].toFixed(2)} g/Fat</p>
            <p id="p3"> ${totalNutriArray[3].toFixed(2)} g/Fibers</p>
            <p id="p4"> ${(totalNutriArray[4] / 1000).toFixed(2)} L/Water</p>
            </div>
            <p class="updateButton" onclick="updateMeal(${i})">Update</p>
            <p class="deleteButton" onclick="deleteMeal(${i})">Delete</p>
            
        `;

        mealQuant = 0;
        numOfIngredi = 0;
        mealArea.appendChild(mealDiv);
    }
    console.log(meals);
}

// Kalder funktionen til at vise alle meals med deres ernæring.
displayTrackMeals();
