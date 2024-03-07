const forecastDay = 5; // Number of days to forecast (Max: 5)
const apiKey = "ee07e2bf337034f905cde0bdedae3db8";
createWeatherCards(forecastDay);
$(document).ready(function(){
    $('.sidenav').sidenav();
  });
$("#searchButton").click(function() {
    weatherForecast();
});
$("#searchTerm").keyup(function(e) {
    if (e.keyCode == 13) {
        weatherForecast();
    }
});

/**
 * Fill table with data
 */
function moreInformations(city, i) {
    var date = new Date();
    date.setDate(date.getDate() + i);

    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${city},fr&units=metric&lang=fr&appid=${apiKey}`,
        type: "GET",
        dataType: "json",
        success: function(response) {
            var date = new Date();
            date.setDate(date.getDate() + i);
            
            var filteredData = response.list.filter(function(data) {
                return data.dt_txt.includes(date.toISOString().slice(0, 10));
            });
        
            //Empty table #weather-table (except first tr) before filling it
            $("#weather-table tr:not(:first)").remove();
            filteredData.forEach(function(data) {
                //Fill table
                $("#weather-table").append(
                    `<tr>
                        <td>${data.dt_txt.slice(11, 16)}</td>
                        <td>${data.main.temp_min}°C</td>
                        <td>${data.main.temp_max}°C</td>
                        <td>${data.main.humidity}%</td>
                        <td>${data.wind.speed}km/h</td>
                        <td><span><i class="wi wi-owm-${data.weather[0].id}"></i> ${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}</span></td>
                        <td>${data.main.pressure}hPa</td>
                    </tr>`
                );
            });
        }
    });
}

/**
 * Fill weather cards and table with data
 */
function weatherForecast(){
    var city = $("#searchTerm").val();
    city = city.replace(/(?<=\S)\s(?=\S)/g, "-");
    if (city != "") {
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city},fr&units=metric&cnt=${forecastDay}&lang=fr&appid=${apiKey}`,
            type: "GET",
            dataType: "json",
            success: function(data) {
                //Show shortInfo
                $("#error").addClass("hidden");
                $(".weather-card").removeClass("hidden");
                $("#info").removeClass("hidden");

                //Fill weather cards
                var weather_cards = $(".weather-card");
                
                for(var i = 0; i < weather_cards.length; i++) {
                    var card = $(weather_cards[i]);
                    var date = new Date();
                    date.setDate(date.getDate() + i);
                    if (i == 0) {
                        card.find(".weather-day").html("Aujourd'hui");
                    } else if (i == 1) {
                        card.find(".weather-day").html("Demain");
                    } else {
                        card.find(".weather-day").html(date.toLocaleDateString("fr-FR", {weekday: "long", day: "numeric", month: "long"}));
                    }
                    
                    card.find(".weather-icon-i").addClass("wi wi-owm-" + data.list[i].weather[0].id);
                    card.find(".weather-temp").html(data.list[i].temp.day + "°C");
                    card.find(".weather-desc").html(data.list[i].weather[0].description);

                }
            },
            error: function() {
                $("#info").removeClass("hidden");
                $(".weather-card").addClass("hidden");
                $(".weather-data").addClass("hidden");
                $("#error").removeClass("hidden");
            }
        });
    }
}

/**
 * Duplicate weather cards in #info div using template #weather-card-template
 * @param {number} count 
 */
function createWeatherCards(count){
    var weather_card_template = $("#weather-card-template");
    var weather_cards = $("#info");
    for (var i = 0; i < count; i++) {
        weather_cards.append(weather_card_template.html());
    }    
}


// More informations on click get city from input and get card index from .weather-card
$(".moreInfo").click(function() {
    var city = $("#searchTerm").val();
    city = city.replace(/(?<=\S)\s(?=\S)/g, "-");
    var index = $(this).parents(".weather-card").index() - 2;
    moreInformations(city, index);

    //Show more informations
    $(".weather-data").removeClass("hidden");
}
);

// Transform vertical scroll into horizontal scroll when mouse is over #info
$("#info").on("wheel", function(event) {
    this.scrollBy(event.originalEvent.deltaY, 0);
    event.preventDefault();
});