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
            if(!cityName){
                return;
            }
            cities.push(cityName);
            localStorage.setItem("cities",JSON.stringify(cities));
            renderButton();
            $("#city-name").val("");

            displayInfo(cityName);
            $(".card1").css("visibility","visible");
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
                var icon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
                var date = response.dt;
                var formattedDate =  Unix_timestamp(date);
                var temp=( response.main.temp -273.15)*1.80 + 32
                var image = $("<img>").attr("src", icon);
                $(".card-title").html(response.name+" ("+ formattedDate+")").append(image);

                $(".card-text1").text("Temperature: "+temp.toFixed(2)+" °F")
                $(".card-text2").text("Humidity: "+response.main.humidity+"%");
                $(".card-text3").text("Wind Speed: "+response.wind.speed+" MPH");
                lat = response.coord.lat;
                 lon = response.coord.lon;
                    
    //getting uv index by sending latitude and longitude values to uvi url
         var queryUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=166a433c57516f51dfab1f7edaed8413";
            $.ajax({
                url: queryUrl,
                method: "GET"
            }).then(function (response) {
                var uv=response.value;
                $(".card-text4").html("<p>  UV Index: "+"<span>"+uv+"</span>"  + "</p>");
            
               var text=$("span");
                
                if (uv === 5) {
                    text.addClass("grey");
                    text.addClass("padding")
                }
                else if (uv > 5) {
                    text.addClass("red");
                    text.addClass("padding")

                }
                else if (uv < 5) {
                    text.addClass("green");
                    text.addClass("padding")

                }
            });
            });
            
            //Getting 5 day forecast
             $(".heading").attr("style","display:block");
            var URL = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + cityName + "&cnt=5&appid=166a433c57516f51dfab1f7edaed8413";
            
            $("#weather-section").empty();
            $.ajax({
                url: URL,
                method: "GET"
            }).then(function (response) {

                for (var i = 0; i < 5; i++) {
                     var icon = "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png";
                
                    var temp=( response.list[i].temp.day - 273.15)*1.80 + 32 ;
                    var humidity = response.list[i].humidity;
                    
                    var date = response.list[i].dt;
                    var formattedDate=  Unix_timestamp(date);
                    var card=$("<div class='card text-white bg-primary mb-3 mr-3 col-md-2' style='max-width: 18rem;'></div>");
                
                    var cardBody= $(" <div class='card-body' ></div>");
                     card.append(cardBody);
                    var $weatherList = $("<ul>");
                    cardBody.append($weatherList);
                    $weatherList.addClass("list-group");
                    $("#weather-section").append(card);
                    var $weatherListItem = $("<li class= 'card-text temperature'>");
                    if (date) {
                        $weatherListItem.append("<p class='label label-primary'>" +
                            formattedDate + "</p>");

                    }
                    if (icon) {
                        var weathericon = $("<img>").attr("src", icon);
                        $weatherListItem.append(weathericon);

                    }
                    if (temp) {
                        $weatherListItem.append("<p class='label label-primary'>" +"Temp: "+
                            temp.toFixed(2) +" °F"+ "</p>");
                    }

                    if (humidity) {
                        $weatherListItem.append("<p class='label label-primary'>" +"Humidity: "+
                            humidity +"%"+ "</p>");

                    }
                   
                

                    $weatherList.append($weatherListItem);
                }
             

            })



            

        }
        //calling display view method when click on the city name has class name .list-group-item
        $(document).on("click", ".list-group-item", displayView);

        function Unix_timestamp(t)
        {
        var dt = new Date(t * 1000);
        var date = dt.getDate();
        var month =  (dt.getMonth() + 1);
        var year =  dt.getFullYear();
        return month+ '/' + date+ '/' + year;  
        }
        

        var data=localStorage.getItem("cities");
        if(data){
            cities=JSON.parse(data);
            displayInfo(cities[cities.length-1]);
            renderButton();
        }


       

    });
