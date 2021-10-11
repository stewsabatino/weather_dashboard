

var homePageURL = ""
var currentWeatherAPI = "https://api.openweathermap.org/data/2.5/find?q=Chicago&units=imperial&appid=f064d5cc6e2d5f072655cd51c2f3385d";
// change london to input or Chicago to start
var oneCallAPI;



var $h4 = $("h4")
var $temp = $("#temp")
var $feelsLike = $("#feelsLike")
var $humidity = $("#humidity")
var $wind = $("#wind")
var $description = $("#description")

function populateCurrentWeather(data) {
    var cityName = data.list[0].name
    $h4.text(cityName)
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
    console.log(description)
}

var $h5 = $("h5")
var $icon = $("#icon")








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
            
        })
    })

}
fetchWeather()