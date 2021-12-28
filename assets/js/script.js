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