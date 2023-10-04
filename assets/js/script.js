$(function () {
    var searchFormEl = $('#search-form')
    var searchEl = $('#search');

    var historyEl = $('#history');

    var locationEl = $('#location');
    var currentDayEl = $('#current-day');
    var currentIconEl = $('#current-icon');
    var currentTempEl = $('#current-temp');
    var currentWindEl = $('#current-wind');
    var currentHumidityEl = $('#current-humidity');

    var futureEl = $('#future-forecast');

    var submitHandler = function (event) {
        event.preventDefault();

        var search = searchEl.val().trim();

        if (search) {
            getLonLat(search);

            localStorage.setItem(search, search);

            searchEl.val('');
        } else {
            alert('Please enter a City');
        }
    };

    var getLonLat = function (city) {
        var lonLatApi = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=6c6770ea3b9bbb08d782e667037f5757';

        fetch(lonLatApi)
            .then(function (response) {
                if (response.ok) {
                    console.log(response);
                    response.json().then(function (data) {
                        console.log(data);
                        console.log(data[0].lat);
                        getCityWeather(data[0].lat, data[0].lon);
                    });
                } else {
                    alert('Error: ' + response.statusText);
                }
            })
            .catch(function (error) {
                alert('Unable to connect to OpenWeather');
            });
    };

    var getCityWeather = function (lat, lon) {
      var weatherApi = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=6c6770ea3b9bbb08d782e667037f5757&units=imperial'

      fetch(weatherApi)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    console.log(data.list[0].weather[0].icon);
                    displayWeather(data);
                })
            }
        })
    }

    var displayWeather = function (data) {
        locationEl.text(data.city.name);
        currentDayEl.text(dayjs(data.list[0].dt_txt).format('MMMM D, YYYY'));
        currentIconEl.attr('src', 'http://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png');
        currentTempEl.text('Temp: ' + data.list[0].main.temp + '°F');
        currentWindEl.text('Wind: ' + data.list[0].wind.speed + ' MPH');
        currentHumidityEl.text('Humidity: ' + data.list[0].main.humidity + ' %');

        futureEl.empty();

        for (var i = 7; i < data.list.length; i+=8) {
            var dayEl = document.createElement('p');
            dayEl.textContent = dayjs(data.list[i].dt_txt).format('MMMM D, YYYY');

            var iconEl = document.createElement('img');
            iconEl.setAttribute('src', 'http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png');

            var tempEl = document.createElement('p');
            tempEl.textContent = 'Temp: ' + data.list[i].main.temp + '°F';

            var windEl = document.createElement('p');
            windEl.textContent = 'Wind: ' + data.list[i].wind.speed + ' MPH';

            var humidityEl = document.createElement('p');
            humidityEl.textContent = 'Humidity: ' + data.list[i].main.humidity + ' %';

            futureEl.append(dayEl);
            futureEl.append(iconEl);
            futureEl.append(tempEl);
            futureEl.append(windEl);
            futureEl.append(humidityEl);
        }
    }

    searchFormEl.on('submit', submitHandler);
})