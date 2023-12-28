//Denne side er scriptet til Nutrition Report siden.

//Funktion til at display de daglige Rapporter
function displayReport() {
    const mealArea = document.getElementById("ReportArea");
    //Kalder meals objekterne fra localStorage
    const meals = JSON.parse(localStorage.getItem("meals")) || [];
    const totalNutrientsByDate = {};
    //For loop som beregner de relevante informationer til de daglige rapporter
    for (let i = 0; i < meals.length; i++) {
        const currentDate = meals[i].date;
        const totalNutriArray = totalNutrientsByDate[currentDate] || Array(5).fill(0);
        for (let j = 0; j < meals[i].foodItems.length; j++) {
            const quantity = parseFloat(meals[i].foodItems[j].quantity);

            for (let l = 0; l < meals[i].foodItems[j].Nutri.length; l++) {
                totalNutriArray[l] += meals[i].foodItems[j].Nutri[l] * quantity;
            }
        }
        totalNutrientsByDate[currentDate] = totalNutriArray;
    }
    //Delen som opretter selve rapporten.
    for (const date in totalNutrientsByDate) {
        const totalNutriArray = totalNutrientsByDate[date];
        const reportDiv = document.createElement("div");
        reportDiv.className = "Reports";
        reportDiv.innerHTML = `
            <p>${date}</p>
            <p>${meals.filter(meal => meal.date === date).length} Meals</p>
            <p>${(totalNutriArray[4] / 1000).toFixed(2)}L</p>
            <p>${totalNutriArray[0].toFixed(2)} Kcal</p>
            <p>${totalNutriArray[1].toFixed(2)}g</p>
            <p>${totalNutriArray[2].toFixed(2)}g</p>
            <p>${totalNutriArray[3].toFixed(2)}g</p>
        `;
        mealArea.appendChild(reportDiv);
    }
}
//Kalder funktionen
displayReport();
console.log(localStorage);