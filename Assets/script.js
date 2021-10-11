

var homePageURL = ""
var city;
var currentWeatherAPI;
// = `https://api.openweathermap.org/data/2.5/find?q=${city}&units=imperial&appid=f064d5cc6e2d5f072655cd51c2f3385d`;
var oneCallAPI;



var $h4 = $("h4")
var $temp = $("#temp")
var $feelsLike = $("#feelsLike")
var $humidity = $("#humidity")
var $wind = $("#wind")
var $description = $("#description")

function populateCurrentWeather(data) {
    var cityName = data.list[0].name
    var $icon = data.list[0].weather[0].icon
    $h4.html(`${cityName} <img src=http://openweathermap.org/img/wn/${$icon}@2x.png>`)
    var temp = data.list[0].main.temp
    $temp.text(`Temperature: ${temp} F`)
    var feelsLike = data.list[0].main.feels_like
    $feelsLike.text(`Feels like: ${feelsLike} F`)
    var humidity = data.list[0].main.humidity
    $humidity.text(`humidity: ${humidity}%`)
    var wind = data.list[0].wind.speed
    $wind.text(`wind: ${wind} mph`)
    var description = data.list[0].weather[0].description
    $description.text(description)
}

var $h5 = $("h5")
var $icon = $("#icon")
var $day1 = $("#dayOne")
var $day2 = $("#dayTwo")
var $day3 = $("#dayThree")
var $day4 = $("#dayFour")
var $day5 = $("#dayFive")
var days = [$day1, $day2, $day3, $day4, $day5]
var $daily = $(".daily")

function fiveDayPop(oneCallData) {
    for (var i = 0; i < days.length; i++) {
        var dateObject = new Date(oneCallData.daily[i+1].dt*1000)
        days[i].find("h5").text(dateObject.toLocaleDateString())
        var $icon = oneCallData.daily[i+1].weather[0].icon
        days[i].find("#icon").html("<img src=http://openweathermap.org/img/wn/" + $icon + "@2x.png>")
        var $temp = oneCallData.daily[i+1].temp.max
        days[i].find("#temp").text(`${$temp} F`)
        var $wind = oneCallData.daily[i+1].wind_speed
        days[i].find("#wind").text(`${$wind} mph`)
        var $humidity = oneCallData.daily[i+1].humidity
        days[i].find("#humidity").text(`${$humidity}%`)
    }
}


function fetchWeather() {
    fetch(currentWeatherAPI)
    
    .then(function(response) {
        if (response.status !== 200) {
            // change to correct html
            document.location.replace(google.com)
        } else {
            return response.json()
        }
    })
    .then(function(data) {
        populateCurrentWeather(data)
        var lat = data.list[0].coord.lat
        var lon = data.list[0].coord.lon
        oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=f064d5cc6e2d5f072655cd51c2f3385d`
        fetch(oneCallAPI)
        .then(function(oneCallRes) {
            if (oneCallRes.status !== 200) {
                // change to correct html
                document.location.replace(google.com)
            } else {
                return oneCallRes.json()
            }
        })
        .then(function(oneCallData) {
            fiveDayPop(oneCallData)
            
        })
    })
}

var $input = $("#form")
var inputField = $input.find("input")
var cityHolder = $input.find("ul")

function searchCity(event) {
    event.preventDefault() 
    city = inputField.val()
    // save to local storage
    cityHolder.append(
        $("<button>")
        .addClass("mt-1")
        .text(city.trim())
        // make li clickable to change city name
    )
    currentWeatherAPI = `https://api.openweathermap.org/data/2.5/find?q=${city}&units=imperial&appid=f064d5cc6e2d5f072655cd51c2f3385d`;   
    fetchWeather()
}
    
function init() {
    city = "Chicago"
    currentWeatherAPI = `https://api.openweathermap.org/data/2.5/find?q=${city}&units=imperial&appid=f064d5cc6e2d5f072655cd51c2f3385d`
    fetchWeather()
    // Call local storage and populate 
    // if city === null .hide card
}
    

init()
$input.on("submit", searchCity)

    