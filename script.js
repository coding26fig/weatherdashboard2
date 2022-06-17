const apiKey = "21e72237572c5ae5093c7b3de85b3577";
let currentCity = "";

let cities = JSON.parse(localStorage.getItem("cities")) || [];

if (cities.length > 0) {
  cities.forEach((city) => {
    document.getElementById("cityList").innerHTML += `
      <li data-city="${city}" class="list-group-item city">${city}</li>
      `;
  });
}

function search(city) {
  document.getElementById("currentDay").innerHTML = "";
  document.getElementById("fiveDayForecast").innerHTML = "";

  document.getElementById("forecastH1").classList.remove("hidden");
  axios
    .get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
    )
    .then((res) => {
      const lat = res.data[0].lat;
      const lon = res.data[0].lon;
      currentCity = res.data[0].name;
      cities.push(currentCity);
      return axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
      );
    })
    .then((forecast) => {
      const current = forecast.data.current;

      let currentDate = current.dt;

      let today = formatDay(new Date());

      const currentTemp = Math.floor(current.temp);
      let uvi = "";

      if (current.uvi < 2) {
        uvi = "mild";
      } else if (current.uvi < 5) {
        uvi = "moderate";
      } else {
        uvi = "severe";
      }

      document.getElementById("currentDay").innerHTML += `
        <div class="card padCard">
          <img class="card-img-top iconImage" src="http://openweathermap.org/img/wn/${
            current.weather[0].icon
          }@4x.png" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">${currentCity}</h5>
            <p> ${today} </p>
            <p> ${currentTemp} °F</p>
            <p> Humidity: ${current.humidity} % </p>
            <p> Wind Speed: ${Math.floor(current.wind_speed)} mph </p>
            <p class="${uvi}"> ${current.uvi} </p>
            <a href="#" data-city="${currentCity}" class="btn btn-primary save">Save</a>
          </div>
        </div>
        `;

      const day1 = new Date(today);
      day1.setDate(day1.getDate() + 1);

      const formDay1 = formatDay(day1);

      const day2 = new Date(today);
      day2.setDate(day2.getDate() + 2);
      formatDay(day2);
      const formDay2 = formatDay(day2);

      const day3 = new Date(today);
      day3.setDate(day3.getDate() + 3);
      formatDay(day3);
      const formDay3 = formatDay(day3);

      const day4 = new Date(today);
      day4.setDate(day4.getDate() + 4);
      formatDay(day4);
      const formDay4 = formatDay(day4);

      const day5 = new Date(today);
      day5.setDate(day5.getDate() + 5);
      formatDay(day5);
      const formDay5 = formatDay(day5);

      let daily = forecast.data.daily;

      let fiveDayArray = [];
      let firstDay = {
        date: formDay1,
        icon: daily[0].weather[0].icon,
        temp: Math.floor(daily[0].temp.day),
        windspeed: Math.floor(daily[0].wind_speed),
        humidity: daily[0].humidity,
      };

      let secondDay = {
        date: formDay2,
        icon: daily[1].weather[0].icon,
        temp: Math.floor(daily[1].temp.day),
        windspeed: Math.floor(daily[1].wind_speed),
        humidity: daily[1].humidity,
      };

      let thirdDay = {
        date: formDay3,
        icon: daily[2].weather[0].icon,
        temp: Math.floor(daily[2].temp.day),
        windspeed: Math.floor(daily[2].wind_speed),
        humidity: daily[2].humidity,
      };

      let fourthDay = {
        date: formDay4,
        icon: daily[3].weather[0].icon,
        temp: Math.floor(daily[3].temp.day),
        windspeed: Math.floor(daily[3].wind_speed),
        humidity: daily[3].humidity,
      };

      let fifthDay = {
        date: formDay5,
        icon: daily[4].weather[0].icon,
        temp: Math.floor(daily[4].temp.day),
        windspeed: Math.floor(daily[4].wind_speed),
        humidity: daily[4].humidity,
      };

      fiveDayArray.push(firstDay);
      fiveDayArray.push(secondDay);
      fiveDayArray.push(thirdDay);
      fiveDayArray.push(fourthDay);
      fiveDayArray.push(fifthDay);

      fiveDayArray.forEach((day) => {
        document.getElementById("fiveDayForecast").innerHTML += `
            <div class="col-sm-12 col-md-2">
              <div class="card padCard">
          <img class="card-img-top iconImage" src="http://openweathermap.org/img/wn/${day.icon}@4x.png" alt="Card image cap">
          <div class="card-body">
           
            <p> ${day.date} </p>
            <p> ${day.temp} °F</p>
            <p> Humidity: ${day.humidity} % </p>
            <p> Wind Speed: ${day.windspeed} mph </p>
          </div>
        </div>
        </div>
            `;
      });
    });
}

function formatDay(day) {
  day = day.toString();
  day = day.split(" ");
  day = day.slice(0, 4);
  day = day.join(" ");
  return day;
}

document.getElementById("searchButton").addEventListener("click", (event) => {
  event.preventDefault();
  const city = document.getElementById("city").value;
  search(city);
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("save")) {
    document.getElementById("cityList").innerHTML += `
        <li data-city="${currentCity}" class="list-group-item city">${currentCity}</li>
        `;
    cities.push(event.target.dataset.city);
    cities.pop();
    localStorage.setItem("cities", JSON.stringify(cities));
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("city")) {
    search(event.target.dataset.city);
  }
});
