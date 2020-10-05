$(document).ready(function(){
        var cities = [];

        //creating list of city names using renderButton( method)
        function renderButton() {
            var cityList = $("#list-view")
            cityList.empty();
            for (var i = 0; i < cities.length; i++) {
                var list = $("<li>");
                list.addClass("list-group-item");
                list.attr("data-city", cities[i]);
                list.text(cities[i]);
                cityList.append(list);
            }
        }

        // when click on the search button, taking the value in the input field and adding to list by calling renderButton method and displayInfo method
        $("#search").on("click", function (event) {
            event.preventDefault();
            var cityName = $("#city-name").val().trim();
            cities.push(cityName);
            renderButton();

            displayInfo(cityName);
        });

        //getting the aatribute data-city value and passing to diaplayInfo method 
        var displayView = function () {
            cityName = $(this).attr("data-city");
            displayInfo(cityName);
        }
        //getting the required information form the object and adding to html elements in the card body
        var displayInfo = function (cityName) {
            var lat;
            var lon;
            var APIKey = "166a433c57516f51dfab1f7edaed8413";
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
                "q=" + cityName + "&appid=" + APIKey;
            // //atlanta(date) temperature,humidity,windspeed,uv index
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                $(".card-title").html("<h1>" + response.name + "</h1>");
                $(".card-text1").html("<p>  temperature: " + response.main.temp + "</p>");
                $(".card-text2").html("<p>  Humidity: " + response.main.humidity + "</p>");
                $(".card-text3").html("<p>  Wind Speed: " + response.wind.speed + "</p>");
                lat = response.coord.lat;
                     lon = response.coord.lon;
                     console.log("lat is"+lat);
                     console.log("lon is"+lon);

                     var queryUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=166a433c57516f51dfab1f7edaed8413";
            $.ajax({
                url: queryUrl,
                method: "GET"
            }).then(function (response) {
                var uv=response.value;
                $(".card-text4").html("<p>  UV index: " + uv + "</p>");
               var text= $(".card-body").children(".card-text4");
                
                if (uv === 5) {
                    text.addClass("grey");
                }
                else if (uv > 5) {
                    text.addClass("red");
                }
                else if (uv < 5) {
                    text.addClass("green");
                }
                console.log("uv is:......."+uv);

            });
            });
            

            var URL = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + cityName + "&cnt=5&appid=166a433c57516f51dfab1f7edaed8413";
            
            $("#weather-section").empty();
            $.ajax({
                url: URL,
                method: "GET"
            }).then(function (response) {

                for (var i = 0; i < 5; i++) {
                    var icon = "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png";
                    var temp = response.list[i].temp.day;
                    var humidity = response.list[i].humidity;
                    var date = response.list[i].dt;
                
                    var $weatherList = $("<ul>");
                    $weatherList.addClass("list-group");
                    $("#weather-section").append($weatherList);
                    var $weatherListItem = $("<li class= 'list-group-item temperature'>");
                    if (date) {
                        $weatherListItem.append("<p class='label label-primary'>" +
                            date + "</p>");

                    }
                    if (temp) {
                        $weatherListItem.append("<span class='label label-primary'>" +
                            temp + "</span>");
                    }

                    if (humidity) {
                        $weatherListItem.append("<p class='label label-primary'>" +
                            humidity + "</p>");

                    }
                    if (icon) {
                        var weathericon = $("<img>").attr("src", icon);
                        $weatherListItem.append(weathericon);

                    }
                    $weatherList.append($weatherListItem);
                }
             

            })



            

        }
        //calling display view method when click on the city name has class name .list-group-item
        $(document).on("click", ".list-group-item", displayView);
    });