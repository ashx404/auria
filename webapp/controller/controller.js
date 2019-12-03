const fs = require("fs");
const axios = require("axios");

let lat = 28.7;
let lon = 77.1;
let temp, water, humidity, elevation;

let tempVal;
let precipVal;
let seaVal;
let heightVal;

module.exports.sendapival = (req, res) => {
  let lat = req.body.lat;
  let lon = req.body.lon;
  async function findWeather() {
    // **COUNTRY***
    let countryData;
    try {
      let countryUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=e46770635aa44ffbbdf6807b600b344d`;
      countryData = await axios.get(countryUrl);
      countryData =
        countryData["data"]["results"]["0"]["components"]["country"];
    } catch (error) {
      countryData = undefined;
    }

    console.log("Name  " + countryData);

    // * DIST FROM SEA ***
    try {
      let seaData = await axios.get(
        "https://api.onwater.io/api/v1/results/${lat},${lon}"
      );
      water = seaData["water"];
    } catch (err) {
      water = false;
    }

    console.log(water);

    let TEMP = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=e22c5633dc0e79e6fe9dc29dd57e51e4`
    );
    temp = TEMP["data"]["main"]["temp"];
    console.log(temp);
    humidity = TEMP["data"]["main"]["humidity"];

    console.log(humidity);
    let eleUrl = await axios.get(
      `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lon}&units=metric&key=AIzaSyDcnHYgcC-bKhg4sIumw-FooUjSHMBFods`
    );
    elevation = eleUrl["data"]["results"][0]["elevation"];
    console.log(elevation);

    if (temp > 35) {
      tempVal = 4;
    } else if (temp > 20) {
      tempVal = 3;
    } else if (temp > 5) {
      tempVal = 2;
    } else {
      tempVal = 1;
    }

    if (water == false) {
      seaVal = 0;
    } else {
      seaVal = 1;
    }
    if (humidity > 80) {
      precipVal = 4;
    } else if (humidity > 55) {
      precipVal = 3;
    } else if (humidity > 30) {
      precipVal = 2;
    } else {
      precipVal = 1;
    }

    if (elevation > 1000) {
      heightVal = 4;
    } else if (elevation > 500) {
      heightVal = 3;
    } else if (elevation > 200) {
      heightVal = 2;
    } else {
      heightVal = 1;
    }

    console.log(tempVal + "." + precipVal + "." + seaVal + "." + heightVal);

    res.json({
      tempVal: data,
      seaVal: seaVal,
      // precipVal: precipVal,
      popVal: popVal
    });
  }
  findWeather();
};

module.exports.gethome = (req, res) => {
  let home = fs.readFileSync("./public/home.html");
  let home1 = home + " ";

  res.end(home1);
};
