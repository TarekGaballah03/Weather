const tname = document.getElementById("today_name");
const tnumb = document.getElementById("today_number");
const tmonth = document.getElementById("today_month");
const tloc = document.getElementById("today_location");
const ttemp = document.getElementById("today_temp");
const timg = document.getElementById("today_img");
const ttext = document.getElementById("today_text");
const nextname = document.getElementById("next_name");
const nexttemp = document.getElementById("next_mtemp");
const nexttempmin = document.getElementById("nextmintemp");
const nextimg = document.getElementById("next_img");
const nexttext = document.getElementById("next_text");
const nametomo = document.getElementById("aftertomorrow_name");
const maxtemptomo = document.getElementById("aftertomorrow_maxtemp");
const mintemptomo = document.getElementById("aftertomorrow_mintemp");
const tomoimg = document.getElementById("aftertomorrow_img");
const tomotext = document.getElementById("after_tomorrow_text");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const direction = document.getElementById("wind_direction");

async function getWeather(cityName) {
    let apiKey = "6a4e03688ebb4862b8383228242606";
    let respond = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=3`);
    let Data = await respond.json();
    return Data;
}

let Icons;

async function fetchIcons() {
    Icons = await getIcons();
}

function getConditionIcon(conditionCode) {
    let condition = Icons.find(cond => cond.code === conditionCode);
    return condition ? condition.icon : null;
}

function displayTodayData(data) {
    tloc.innerHTML = data.location.name;
    ttemp.innerHTML = data.current.temp_c;
    timg.setAttribute("src", `https://${data.current.condition.icon}`);
    ttext.innerHTML = data.current.condition.text;
    humidity.innerHTML = data.current.humidity + "%";
    wind.innerHTML = data.current.wind_kph + " km/h";
    direction.innerHTML = data.current.wind_dir;

    let today = new Date();
    tname.innerHTML = today.toLocaleDateString("en-US", { weekday: "long" });
    tnumb.innerHTML = today.getDate();
    tmonth.innerHTML = today.toLocaleDateString("en-US", { month: "long" });
}

function displayNextData(data) {
    let forecastData = data.forecast.forecastday;
    let nextDate = new Date(forecastData[1].date);
    nextname.innerHTML = nextDate.toLocaleDateString("en-US", { weekday: "long" });
    nextimg.setAttribute("src", `https://${forecastData[1].day.condition.icon}`); 
    nexttemp.innerHTML = forecastData[1].day.maxtemp_c;
    nexttempmin.innerHTML = forecastData[1].day.mintemp_c;
    nexttext.innerHTML = forecastData[1].day.condition.text;
}

function displayDayAfterTomorrowData(data) {
    let forecastData = data.forecast.forecastday;
    let dayAfterTomorrowDate = new Date(forecastData[2].date);
    nametomo.innerHTML = dayAfterTomorrowDate.toLocaleDateString("en-US", { weekday: "long" });
    tomoimg.setAttribute("src", `https://${forecastData[2].day.condition.icon}`);
    maxtemptomo.innerHTML = forecastData[2].day.maxtemp_c;
    mintemptomo.innerHTML = forecastData[2].day.mintemp_c;
    tomotext.innerHTML = forecastData[2].day.condition.text;
}

async function startApp(city = "London") {
    let Data = await getWeather(city);
    if (!Data.error) {
        displayTodayData(Data);
        displayNextData(Data);
        displayDayAfterTomorrowData(Data);
    }
}

let searchInput = document.getElementById("search");
let searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", function () {
    let city = searchInput.value.trim(); 
    if (city.length > 2) {
        startApp(city);
    }
});

searchInput.addEventListener("input", function () {
    let city = searchInput.value.trim(); 
    if (city.length > 2) {
        startApp(city);
    }
});
async function getIcons() {
    let conditionResponse = await fetch("https://www.weatherapi.com/docs/conditions.json");
    let conditionData = await conditionResponse.json();
    return conditionData;
}

searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        let city = searchInput.value.trim(); 
        if (city.length > 2) {
            startApp(city);
        }
    }
});

fetchIcons().then(() => startApp());