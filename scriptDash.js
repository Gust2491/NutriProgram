//Dette script hører til dashboard siden.
const dashMeals = JSON.parse(localStorage.getItem("meals")) || [];
const currentDate = new Date().toLocaleDateString();

//Funktion som tæller hvor mange retter er spist på den nuværende dag.
//Funktion som beregner den daglige mængde af vand, Protein og Kcal.
function dashDisplay() {
    let numOfMeals = 0;
    let dayEnergy = 0;
    let dayProtein = 0;
    let dayWater = 0;
    for (let i = 0; i < dashMeals.length; i++) {
        //tjekker om dagen er den nuværende før den ligger værdierne sammen.
        if (dashMeals[i].date === currentDate) {
            numOfMeals++;
            for (let j = 0; j < dashMeals[i].foodItems.length; j++) {
                let KcalperG = parseFloat(dashMeals[i].foodItems[j].Nutri[0]);
                let Kcalquant = parseFloat(dashMeals[i].foodItems[j].quantity);
                let foodItemKcal = KcalperG * Kcalquant;
                dayEnergy += foodItemKcal;
                let waterPerG = parseFloat(dashMeals[i].foodItems[j].Nutri[4]);
                let quantWater = parseFloat(dashMeals[i].foodItems[j].quantity);
                let foodItemWater = waterPerG * quantWater
                dayWater += foodItemWater;

                let proteinPerG = parseFloat(dashMeals[i].foodItems[j].Nutri[1]);
                let quantProtein = parseFloat(dashMeals[i].foodItems[j].quantity);
                let foodItemProtein = proteinPerG * quantProtein;
                dayProtein += foodItemProtein;
            }
        }
    }
    document.getElementById("NumberMeals").innerHTML = numOfMeals;
    dayEnergy = dayEnergy.toFixed(2);
    document.getElementById("EnergyAmount").innerHTML = dayEnergy + " Kcal";
    dayWater = dayWater / 1000;
    dayWater = dayWater.toFixed(2);
    document.getElementById("WaterAmount").innerHTML = dayWater + " L";
    dayProtein = dayProtein.toFixed(1);
    document.getElementById("ProteinAmount").innerHTML = dayProtein + " g";
}


//Kalder funktionen
dashDisplay();



