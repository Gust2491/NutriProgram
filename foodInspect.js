//Dette er Scriptet der hører til Food Inspector siden.
//Dette sikre at koden først kører når hele HTML dokumentet er loaded.
document.addEventListener("DOMContentLoaded", () => {
    const ingredientContainer = document.getElementById("ingredient-container");

    //Opretter det meste af Sidens HTML elementer her i JS koden
    const foodTableContainer = document.createElement("div");
    const foodTableHeader = document.createElement("h2");
    foodTableHeader.textContent = "Ingredients";
    foodTableContainer.appendChild(foodTableHeader);
    const foodTable = document.createElement("table");
    const tableBody = document.createElement("tbody");
    const detailContainer = document.createElement("div");
    const nameContainer = document.createElement("div");
    nameContainer.style.width = "1fr";
    nameContainer.style.height = "71.813px";
    const nutritionHeader = document.createElement("h2");
    nutritionHeader.textContent = "Nutrition";
    detailContainer.appendChild(nutritionHeader);
    const foodInformationContainer = document.createElement("div");
    const foodInformationHeader = document.createElement("h2");
    foodInformationHeader.textContent = "Food Information";
    foodInformationContainer.appendChild(foodInformationHeader);
    //Api Key'en og API urls'ne
    const apiKey = "170482";
    const apiUrlFoodItems = "https://nutrimonapi.azurewebsites.net/api/FoodItems"; // Add this line
    const apiUrlFoodCompSpecs = "https://nutrimonapi.azurewebsites.net/api/FoodCompSpecs/ByItem";
    let foodData;

    // Henter alle foodItems fra Api'et og viser dem.
    fetch(apiUrlFoodItems, {
        method: "GET",
        headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(data => {
            foodData = data;

            // Laver et nyt row for hver foodItem
            data.forEach(foodItem => {
                const row = tableBody.insertRow();
                const cell = row.insertCell();
                cell.textContent = foodItem.foodName;
                cell.addEventListener("click", () => handleFoodItemClick(foodItem.foodID));
            });

            //Tilføjer oprettede HTML elementer til de andre HTML elementer 
            foodTable.appendChild(tableBody);
            foodTableContainer.appendChild(foodTable);
            ingredientContainer.appendChild(foodTableContainer);
            ingredientContainer.appendChild(detailContainer);
            ingredientContainer.appendChild(nameContainer);
            ingredientContainer.appendChild(foodInformationContainer);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });


    // Funktion som viser dataen når en foodItem blir klikket på
    function handleFoodItemClick(selectedFoodID) {
        //Den fetcher data fra alle de forskellige sortkeys til den klikkede foodItem.
        let sortKeyArray = [1030, 1110, 1310, 1240, 1210, 1510, 1410, 1610, 1620, 1010];


        Promise.all([
            fetch(`${apiUrlFoodItems}/${selectedFoodID}`, {
                method: "GET",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
            }).then(response => response.json()),

            fetch(`${apiUrlFoodCompSpecs}/${selectedFoodID}/BySortKey/1030`, {
                method: "GET",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
            }).then(response => response.json()),

            fetch(`${apiUrlFoodCompSpecs}/${selectedFoodID}/BySortKey/1110`, {
                method: "GET",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
            }).then(response => response.json()),

            fetch(`${apiUrlFoodCompSpecs}/${selectedFoodID}/BySortKey/1310`, {
                method: "GET",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
            }).then(response => response.json()),

            fetch(`${apiUrlFoodCompSpecs}/${selectedFoodID}/BySortKey/1240`, {
                method: "GET",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
            }).then(response => response.json()),

            fetch(`${apiUrlFoodCompSpecs}/${selectedFoodID}/BySortKey/1210`, {
                method: "GET",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
            }).then(response => response.json()),

            fetch(`${apiUrlFoodCompSpecs}/${selectedFoodID}/BySortKey/1510`, {
                method: "GET",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
            }).then(response => response.json()),

            fetch(`${apiUrlFoodCompSpecs}/${selectedFoodID}/BySortKey/1410`, {
                method: "GET",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
            }).then(response => response.json()),

            fetch(`${apiUrlFoodCompSpecs}/${selectedFoodID}/BySortKey/1610`, {
                method: "GET",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
            }).then(response => response.json()),

            fetch(`${apiUrlFoodCompSpecs}/${selectedFoodID}/BySortKey/1620`, {
                method: "GET",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
            }).then(response => response.json()),

            fetch(`${apiUrlFoodCompSpecs}/${selectedFoodID}/BySortKey/1010`, {
                method: "GET",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
            }).then(response => response.json()),
        ])

            //Opretter et array for som hvert får en af ernæringsværdierne for den klikkede vare
            .then(([foodInfo, kcalSpec, proteinSpec, fatSpec, fibersSpec, carboHydratesSpec,
                saltSpec, alchoSpec, drySpec, waterSpec, kjSpec]) => {
                //Indsætter alt ernæringsinformationen for den klikkede vare.
                nameContainer.innerHTML = `<h2>${foodInfo.foodName || ""}</h2>`;
                detailContainer.innerHTML = `<h2>Nutrition pr 100g</h2>`;
                detailContainer.innerHTML += `<p>Energy(kJ): ${kjSpec[0].resVal}</p>`;
                detailContainer.innerHTML += `<p>Energy(kcal): ${kcalSpec[0].resVal}</p>`;
                detailContainer.innerHTML += `<p>Protein: ${proteinSpec[0].resVal} g</p>`;
                detailContainer.innerHTML += `<p>Fat: ${fatSpec[0].resVal} g</p>`;
                detailContainer.innerHTML += `<p>Fibers: ${fibersSpec[0].resVal} g</p>`;
                detailContainer.innerHTML += `<p>Carbohydrates: ${carboHydratesSpec[0].resVal} g</p>`;
                detailContainer.innerHTML += `<p>Salt: ${saltSpec[0].resVal} g</p>`;
                detailContainer.innerHTML += `<p>Alcohol: ${alchoSpec[0].resVal} g</p>`;
                detailContainer.innerHTML += `<p>Dry Matter: ${drySpec[0].resVal} g</p>`;
                detailContainer.innerHTML += `<p>Water: ${waterSpec[0].resVal} g</p>`;
                //Viser food informationen får den klikkede vare
                foodInformationContainer.innerHTML = `<h2>Food Information</h2>`;
                foodInformationContainer.innerHTML += `<p>Food ID: ${foodInfo.foodID}</p>`;
                foodInformationContainer.innerHTML += `<p>Taxonomic Name: ${foodInfo.taxonomicName}</p>`;
                foodInformationContainer.innerHTML += `<p>Fødevare Gruppe: ${foodInfo.fødevareGruppe}</p>`;
            })
            .catch(error => {
                console.error("Error fetching selected food data:", error);
            });
    }
});
