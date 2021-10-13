// call local storage to populate
var savedChar = JSON.parse(localStorage.getItem("city")) ||[]
console.log("savedChar", savedChar)
var homePageURL = ""
var city;
var currentWeatherAPI;
var oneCallAPI;



var $h4 = $("h4")
var $temp = $("#temp")
var $feelsLike = $("#feelsLike")
var $humidity = $("#humidity")
var $wind = $("#wind")
var $description = $("#description")

// populates current day weather with currentweather API fetch call
function populateCurrentWeather(data) {
    var cityName = data.list[0].name
    var $icon = data.list[0].weather[0].icon
    // sets city name and icon
    $h4.html(`Today in ${cityName} <img src=http://openweathermap.org/img/wn/${$icon}@2x.png>`)
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

// loops through each card with id of day[i] to place 5 day weather forecast
// same concept as the currentweather API, but this one uses oneCall 
function fiveDayPop(oneCallData) {
    for (var i = 0; i < days.length; i++) {
        // use plus one because in api fetch [0] is for current day
        var dateObject = new Date(oneCallData.daily[i + 1].dt * 1000)
        // days[i] is is the days array with content of #days
        days[i].find("h5").text(dateObject.toLocaleDateString())
        var $icon = oneCallData.daily[i + 1].weather[0].icon
        days[i].find("#icon").html("<img src=http://openweathermap.org/img/wn/" + $icon + "@2x.png>")
        var $temp = oneCallData.daily[i + 1].temp.max
        days[i].find("#temp").text(`${$temp} F`)
        var $wind = oneCallData.daily[i + 1].wind_speed
        days[i].find("#wind").text(`${$wind} mph`)
        var $humidity = oneCallData.daily[i + 1].humidity
        days[i].find("#humidity").text(`${$humidity}%`)
    }
}


function fetchWeather() {
    fetch(currentWeatherAPI)
        // checks to see if the response is ok
        .then(function (response) {
            if (response.status !== 200) {
                // change to correct html
                document.location.replace()
            } else {
                // return readable data
                return response.json()
            }
        })
        .then(function (data) {
            // use data to put into function
            populateCurrentWeather(data)
            // pull lat and lon out of data and put into oneCall API url to fetch that data
            var lat = data.list[0].coord.lat
            var lon = data.list[0].coord.lon
            oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=f064d5cc6e2d5f072655cd51c2f3385d`
            fetch(oneCallAPI)
                .then(function (oneCallRes) {
                    // Again check if response is ok
                    if (oneCallRes.status !== 200) {
                        // change to correct html
                        document.location.replace()
                    } else {
                        return oneCallRes.json()
                    }
                })
                // use readable data to supply fiveDayPop function with data
                .then(function (oneCallData) {
                    fiveDayPop(oneCallData)

                })
        })
}

var $form = $("#form")
var inputField = $form.find("input")
var $search = $("#search")
var cityHolder = $("#cityHolder")

// create button from input submit and local storage
function createButton(city) {
    if (city.length > 0) {
        cityHolder.append(
            // creates button
            $("<button>")
                .addClass("mt-1")
                .attr("class", "recentSearch")
                // gives text of city
                .text(city)
        )
    
        // on button click change weather to the button text
        $(".recentSearch").on("click", function (event) {
           // alert("it works")
            var city = $(this).text()
            console.log(city)
            loadWeather(city)
        })
    
    }
    
  
}

// sets array to push input submits into to save into local storage
var cities = []
// searches city that was submitted into the input field
function searchCity(event) {
    event.preventDefault()
    // sets variable equal to the value and then trims
    city = inputField.val()
    city.trim()
    console.log("saved city",cities )

    if(city.length > 0 && cities.indexOf(city) === -1){
        // pushes city to the cities array
        cities.push(city)
        // saves array to local storage
        localStorage.setItem("city", JSON.stringify(cities))
        createButton(city)
        // sets inputfield back to empty
        inputField.val("")
        loadWeather(city)
    } 
}

function loadWeather(city) {

    // set currentWeatherAPI url for fetchWeather to use with city 
    currentWeatherAPI = `https://api.openweathermap.org/data/2.5/find?q=${city}&units=imperial&appid=f064d5cc6e2d5f072655cd51c2f3385d`;
    fetchWeather()
}

// initial function on page load. Chicago weather
function init() {
   
    city = "Chicago"
    currentWeatherAPI = `https://api.openweathermap.org/data/2.5/find?q=${city}&units=imperial&appid=f064d5cc6e2d5f072655cd51c2f3385d`
    fetchWeather()
    // populate button area with local storage if it is there
    if (savedChar) {
        for (var i = 0; i < savedChar.length; i++) {
            console.log(savedChar[i])
            createButton(savedChar[i])
        }
    } else {
        return
    }
}

// initial function to load
init()
// input field submit
$form.on("submit", searchCity)

