//Dette er scriptet til siden Meal Creator

//Definere API key'et og de forskellige API'er
const apiKey = "170482";
const foodItemsApi = "https://nutrimonapi.azurewebsites.net/api/FoodItems";
const foodItemSpecsApi = "https://nutrimonapi.azurewebsites.net/api/FoodCompSpecs/ByItem";
const mad = JSON.parse(localStorage.getItem("meals")) || [];
const foodIDs = getFoodInfo();

//Funktion til at fetche en foodItem ud fra dens navn
function fetchFoodItemsByName(searchInput) {
    const url = `https://nutrimonapi.azurewebsites.net/api/FoodItems/BySearch/${searchInput}`;

    return fetch(url, {
            headers: {
                "x-api-key": "170482"
            }
        })
        .then(response => response.json())
        .catch(error => console.error("Error fetching food items:", error));
}

//Funktion til at vise foodItems ud fra søgning
function searchFood() {
    const searchInput = document.getElementById("foodSearch").value.trim();
    if (searchInput === "") {
        alert("Please enter a food name for search.");
        return;
    }
    const foodItemsSelect = document.getElementById("foodItems");
    foodItemsSelect.innerHTML = "";
    fetchFoodItemsByName(searchInput)
        .then(foodItems => {
            foodItems.forEach(item => {
                const option = document.createElement("option");
                option.value = item.foodName;
                option.text = item.foodName;
                foodItemsSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error fetching food items:", error);
        });
}


//Funktion til at lave arrays med foodID'erne og FoodNavnene.
function getFoodInfo() {
    let arrayIDs = [];
    let arrayFoodName = [];
    return fetch(foodItemsApi, {
        method: "GET",
        headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(FoodInfo => {
            for (let i = 0; i < FoodInfo.length; i++) {
                arrayIDs.push(FoodInfo[i].foodID);
                arrayFoodName.push(FoodInfo[i].foodName);
            }
            return arrayIDs;
        })
        .catch(error => {
            console.error("Error fetching selected food data:", error);
        });
}

//fetcher Hele listen af foodItems fra API'et
function fetchFoodItems() {
    return fetch(foodItemsApi, {
        headers: {
            "x-api-key": apiKey
        }
    })
        .then(response => response.json())
        .catch(error => console.error("Error fetching food items:", error));
}

//Funktion som tilføjer de valgte foodItems til en liste af valgte food items
//samt viser mængden af dem.
function addFoodItem() {
    const foodItemsSelect = document.getElementById("foodItems");
    const selectedFoodList = document.getElementById("selectedFoodList");
    Array.from(foodItemsSelect.selectedOptions).forEach(option => {
        const quantity = document.getElementById("quantity").value;
        const listItem = document.createElement("li");
        listItem.textContent = `${option.value} (  ${quantity} g)`;
        selectedFoodList.appendChild(listItem);
    });
    foodItemsSelect.selectedIndex = -1;
}

//Funktion som laver et meal på baggrund af det indtastede Meal Navn og valgte foodItems.
//Funktionen gemmer så de oprettede Meal Objekter i localStorage.
//Med deres: ID, Navn, Mængde og hver foodItems ErnæringsIndhold per gram.
//Funktionen vsier også mealet og resetter de indtastede værdier.
async function createMeal() {
    const mealName = document.getElementById("mealName").value;
    //alerter hvis ikke meal Navne er indtastet
    if (!mealName) {
        alert("Please enter a meal name.");
        return;
    }
    try {
        //Tager værdierne fra API'sne og gemmer dem i variabler
        const foodItems = await fetchFoodItems();
        const selectedFoodList = document.getElementById("selectedFoodList");
        const foodItemsInfo = await Promise.all(Array.from(selectedFoodList.children).map(async item => {
            const [foodName, quantity] = item.textContent.split(" (  ");
            const selectedFoodItem = foodItems.find(f => f.foodName === foodName);
            const foodID = selectedFoodItem ? selectedFoodItem.foodID : null;
            const Nutri = await getDataFromAPI(foodID);
            //Returnere de hentede værdier i variabler der nu kan anvendes i funktionen
            return {
                foodID,
                foodName,
                quantity: quantity.replace("g)", ""),
                Nutri
            };
        }));
        //Laver et meal Objekt med værdierne som er hentet fra API'sne.
        const meal = {
            name: mealName,
            date: new Date().toLocaleDateString(),
            foodItems: foodItemsInfo
        };
        //Kører 3 funktioner, En som gemmer mealobjektet lige oprettet fra API-værdier
        //En som viser selve mealet på siden, samt et som resetter indput værdierne
        saveMeal(meal);
        displayMeals();
        clearInputs();
        location.reload();
    } catch (error) {
        console.error("Error creating meal:", error);
    }
}


//Funktion som resetter indput værdier
function clearInputs() {
    document.getElementById("mealName").value = "";
    document.getElementById("quantity").value = 1;
    document.getElementById("selectedFoodList").innerHTML = "";
}

//Funktion som gemmer et objekt i localStorage.
function saveMeal(meal) {
    const meals = JSON.parse(localStorage.getItem("meals")) || [];
    meals.push(meal);
    localStorage.setItem("meals", JSON.stringify(meals));
}

//Funktion som fjerner et meal på en specifik plads.
function deleteMeal(index) {
    const meals = JSON.parse(localStorage.getItem("meals")) || [];
    meals.splice(index, 1);
    localStorage.setItem("meals", JSON.stringify(meals));
    displayMeals();
}

//Funktion som viser alle fooditems i select feltet.
function displayFoodItems() {
    const foodItemsSelect = document.getElementById("foodItems");
    fetchFoodItems()
        .then(foodItems => {
            foodItems.forEach(item => {
                const option = document.createElement("option");
                option.value = item.foodName;
                option.text = item.foodName;
                foodItemsSelect.appendChild(option);
            });
        });
}

let data;
//Funktion som henter ernæringsindhold fra API'et, ud fra et ID
async function getDataFromAPI(foodId) {
    const apiUrl = "https://nutrimonapi.azurewebsites.net/api/FoodCompSpecs/ByItem";
    let foodIdData = [];
    let sortKey = [1030, 1110, 1310, 1240, 1620];
    for (let i = 0; i < sortKey.length; i++) {
        try {
            const response = await fetch(`${apiUrl}/${foodId}/BySortKey/${sortKey[i]}`, {
                method: "GET",
                withCredentials: true,
                headers: {
                    "X-API-Key": "170482",
                    "Content-Type": "text/plain"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            //Laver ernæringsindholds-værdierne om til per gram
            //samt ændre dem fra , til . 
            //Og sørger for at værdierne er tal.
            const data = await response.json();
            var stringValue = data[0].resVal;
            var number = parseFloat(stringValue.replace(',', '.'));
            var data1g = number / 100;
            data1g = data1g.toFixed(4);
            foodIdData.push(data1g);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    }
    return foodIdData;
}

//Funktion som viser all oprettede meals under Create Meal
async function displayMeals() {
    const mealsContainer = document.getElementById("mealsContainer");
    mealsContainer.innerHTML = "";
    try {
        const meals = await getMealsAsync();
        meals.forEach(async (meal, index) => {
            const mealDiv = document.createElement("div");
            mealDiv.className = "meal";
            const foodItemsArray = meal.foodItems || [];
            const foodNamesArray = foodItemsArray.map(foodItem => foodItem.foodName);
            let ingredients = 0;
            //tæller antal af ingredienser
            for (let i = 0; i < foodNamesArray.length; i++) {
                ingredients++;

            }
            //Viser de relevante informationer på siden.
            //Og opretter delete knappen.
            mealDiv.innerHTML = `
                <p> ${meal.name}</p>
                <p> ${meal.date}</p>
                <p> ${ingredients}</p>
                <p class="deleteButton" onclick="deleteMeal(${index})">Delete</p>`;
            mealsContainer.appendChild(mealDiv);
        });
    } catch (error) {
        console.error("Error fetching meals:", error);
    }
}

//Funktion som modtager mealsne og returnere dem som en promise
async function getMealsAsync() {
    return new Promise((resolve) => {
        const meals = JSON.parse(localStorage.getItem("meals")) || [];
        resolve(meals);
    });
}


//funktion til at gemme Meal creator bag en knap.
function showMealCreator() {
    const mealsCreatorArea = document.getElementById("MealCreatorArea");
    mealsCreatorArea.innerHTML = `
    <div id="createMealArea">
            <h2>Create a Meal</h2>
            <label for="mealName">Meal Name</label>
            <input type="text" id="mealName">
            <label for="foodSearch"> Search for Food</label>
            <input type="text" id="foodSearch" placeholder="Enter food name">
            <button onclick="searchFood()">Search</button>
            <label for="foodItems">Select Ingredients</label>
            <select id="foodItems" multiple></select>
            <label for="quantity"> Grams of selected ingredient</label>
            <input type="number" id="quantity" min="1" value="1">
            <button onclick="addFoodItem()">Add Ingredient</button>

            <div id="selectedFoodItems">
                <h3 id="h33">Selected Ingredients</h3>
                <ul id="selectedFoodList"></ul>
            </div>

            <button style="background-color: #FFAB40;" onclick="createMeal()">Create Meal</button>
        </div>
    
    `
}

//Kalder funktionerne
displayMeals();
displayFoodItems();

