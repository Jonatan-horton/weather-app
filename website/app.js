/* Global Variables */
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';

/* API key*/
const apiKey = '58163d165072b2e4eb461b90e9804a23';

// Create a new date instance dynamically with JS
let d = newFunction();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

document.getElementById('generate').addEventListener('click', getWeather);

function newFunction() {
    return new Date();
}

function getWeather(e){
    e.preventDefault();
    const zipCode = document.getElementById('zip-input').value;
    const userFeeling = document.getElementById('user-feeling').value;
    getWeatherInfo(baseURL, zipCode, apiKey)
    .then(function(weatherData){
        const temperature = weatherData.main.temp;
        const city = weatherData.name;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const windSpeed = weatherData.windSpeed;
        const humidity = weatherData.main.humidity;
        const feeling = userFeeling;
        const country = weatherData.sys.country;

        //server posting
        postData('/add', {
            temperature,
            city,
            description,
            icon,
            windSpeed,
            humidity,
            feeling,
            country
        }).then(() => {updateUI();})
        //funticon to be called after click is fire off and weather info is gathered
    });
}

//take the info and call shte API for data
const getWeatherInfo = async (baseURL, zipCode, apiKey) =>{
    console.log(baseURL + zipCode + ',us&appid=' + apiKey);
    const response = await fetch(baseURL + zipCode + ',us&appid=' + apiKey)
    try{
        const newData = await response.json();
        return newData;
    }
    catch(error){
        console.log("error", error);
    }
};

//Post
async function postData(url, data){
    await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

// get fuction that takes info to server
async function updateUI(){
    const response = await fetch('/retrieve');
    const lastEntry = await response.json();
    document.querySelector('.city').innerText = "Weather in " + lastEntry.city;
    document.querySelector('.country').innerText = lastEntry.country;
    document.querySelector('.temperature').innerText = Math.floor(lastEntry.temperature) + `&deg;`;
    document.querySelector('.description').innerText = lastEntry.description;
    document.querySelector('.humidity').innerText = "Humidity: " + lastEntry.humidity + "%";
    document.querySelector('.wind').innerText = "Wind speed " + lastEntry.windSpeed + "km/H";
    document.querySelector('.icon').src = "https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png" + lastEntry.icon +"@2x.png";
    document.querySelector('.date').innerText = dateToday;
    document.querySelector('.content').innerText = lastEntry.feeling;
}
