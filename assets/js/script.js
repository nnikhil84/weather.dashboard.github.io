let getDate = function (days) {
  let someDate = new Date();
  let numberOfDaysToAdd = days;
  someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

  let dd = someDate.getDate();
  let mm = someDate.getMonth() + 1;
  let y = someDate.getFullYear();

  return mm + "/" + dd + "/" + y;
};

let mph = (speed) => {
  return parseFloat(speed * (3600 / 1609.344)).toFixed(2);
};

// City search

let searchedCities = [];
if (localStorage.getItem("citysearch")) {
  searchedCities = JSON.parse(localStorage.getItem("citysearch"));
}

let lastSearchedCity;

const apiKey = "f41db6dc17c29e94d3dd766203f40706";

$(document).ready(function () {
  var weatherUpdate = function (cityName, searched) {
    $("#searchError").html("");
    $("#search datalist").html("");
    $("button").addClass("wait");
    $("button").attr("disabled", true);

    // AJAX call to obtain city name for the function
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
      success: function (result) {
        if (searched === true) {
          if (searchedCities.includes($("#search input").val()) !== true) {
            searchedCities.push($("#search input").val());
            localStorage.setItem("citysearch", JSON.stringify(searchedCities));
          }
          localStorage.setItem("lastCitySearch", $("#search input").val());
        }
        Array.from(searchedCities).forEach((check) => {
          $("#search datalist").append(`<option value="${check}"></option>`);
        });

        cityId = result.id;

        // AJAX call that uses result.id data to gather information to display the weather
        $.ajax({
          url: `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&APPID=${apiKey}&units=metric`,
          success: function (result) {
            $("#currentDay").html("");
            $("#currentDay").append(
              `<div class="blockHeading"><h2>${result.city.name} ( ${getDate(
                0
              )} )</h2><img src="https://openweathermap.org/img/w/${
                result.list[0].weather[0].icon
              }.png" alt="${
                result.list[0].weather[0].description
              }" width='50' height='50'>`
            );
            $("#currentDay").append(
              `<p class="temperature">Temperature: ${result.list[0].main.temp} °C</p>`
            );
            $("#currentDay").append(
              `<p class="humidity"> Humidity: ${result.list[0].main.humidity} %</p>`
            );
            $("#currentDay").append(
              `<p class="wind_speed">Wind Speed:  ${mph(
                result.list[0].wind.speed
              )} MPH</p>`
            );
            // AJAX call to call UV data through coordinates data from previous call
            $.ajax({
              url:
                `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=` +
                result.city.coord.lat +
                "&lon=" +
                result.city.coord.lon,
              success: function (result) {
                $("#currentDay").append(
                  `<p class="uv">UV Index: <span>${result.value}</span></p>`
                );
                $("button").removeClass("wait");
                $("button").attr("disabled", false);
              },
              error: function (xhr, ajaxOptions, thrownError) {
                $("#currentDay").append(
                  `<p class="uv">UV Index: <span>Data in currently unavailable</span></p>`
                );
                $("button").removeClass("wait");
                $("button").attr("disabled", false);
              },
              error: function (xhr, ajaxOptions, thrownError) {
                $("#currentDay").append(
                  `<div class="blockHeading"><h2>${
                    result.city.name
                  } ( ${getDate(0)} )</h2>Data in currently unavailable`
                );
                $("#currentDay").append(
                  `<p class="temperature">Temperature: Data in currently unavailable</p>`
                );
                $("#currentDay").append(
                  `<p class="humidity"> Humidity: Data in currently unavailable</p>`
                );
                $("#currentDay").append(
                  `<p class="wind_speed">Wind Speed:  Data in currently unavailable</p>`
                );
                $("button").removeClass("wait");
                $("button").attr("disabled", false);
              },
            });
            // Five Days Forecast
            $("#forecast .days").html("");
            // Append forecast data
            for (let i = 1; i <= 5; i++) {
              let forecastBlock = function (i) {
                return (
                  "<div>" +
                  '<p class="date">' +
                  getDate(i) +
                  "</p>" +
                  `<img src="https://openweathermap.org/img/w/${result.list[i].weather[0].icon}.png" alt="${result.list[i].weather[0].description}" width='50' height='50'>` +
                  `<p class="temperature">Temp: ${result.list[i].main.temp}&nbsp;°C</p>` +
                  `<p class="humidity">Humidity: ${result.list[i].main.humidity}&nbsp;%"</p>` +
                  "</div>"
                );
              };

              $("#forecast .days").append(forecastBlock(i));
            }
          },
        });
      },
      error: function (xhr, ajaxOptions, thrownError) {
        if ($("#search input").val() === "") {
          $("#searchError").html("*Requires a city name.");
        } else {
          $("#searchError").html("*City not found.");
        }
        $("button").removeClass("wait");
        $("button").attr("disabled", false);
      },
    });
  };

  if (localStorage.getItem("lastCitySearch")) {
    weatherUpdate(localStorage.getItem("lastCitySearch"), false);
  } else {
    weatherUpdate("Toronto", false);
  }

  $("#presetCities button").on("click", function () {
    weatherUpdate($(this).html().toString(), false);
  });

  $("#search button").on("click", function () {
    weatherUpdate($("#search input").val(), true);
  });
});
