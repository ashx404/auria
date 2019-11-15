const fs = require("fs");
const axios = require("axios");
module.exports.sendapival = (req, res) => {
  let lat = req.body.lat;
  let lon = req.body.lon;
  console.log(lat);
  console.log(lon);
  async function findWeather() {
    // *****COUNTRY**********
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

    // * DIST FROM SEA *********
    let distFromSea;
    try {
      let seaData = await axios.get(
        `https://api.kbgeo.com/coastal-distance/v2/coord?lat=${lat}&lng=${lon}`,
        {
          params: {},
          headers: { "kb-auth-token": "50a1f7e7-1fad-4cdf-9a03-ccc003c0e008" }
        }
      );
      distFromSea = seaData["data"]["distanceInMiles"] * 1.6; //in km
      console.log("seaDist  " + distFromSea + "km");
    } catch (err) {
      distFromSea = 0;
    }

    console.log(distFromSea + "  SEA");

    //******POPULATION DENSITY******

    let popData;
    try {
      let popUrl = `http://www.foodsecurityportal.org/api/countries/population-density/${countryData}.csv`;
      popData = await axios.get(popUrl);
      popData = popData["data"];
      popData = popData.split(",");
      popData = popData.slice(-1)[0];
      popData = Number(popData.split('"')[1]);
    } catch (error) {
      if (distFromSea == 0) {
        popData = 0;
      } else {
        popData = 250;
      }
    }
    if (popData == 2016 && distFromSea == 0) {
      popData = 0;
    }
    if (popData == 2016) {
      popData = 250;
    }
    console.log("POP  " + popData);

    //*****
    // *******TEMP AND RAINFALL*********
    let rainData = await axios.get(
      `https://api.darksky.net/forecast/26627e161e652e96152956f588621c52/${lat},${lon}`
    );
    let currTemp = rainData["data"]["currently"]["temperature"];
    let precipIntensity = rainData["data"]["currently"]["precipIntensity"];
    currTemp = [5 * (currTemp - 32)] / 9;

    console.log("precipIntensity  " + precipIntensity);
    console.log("currTemp  " + currTemp);

    // let TEMP = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=e22c5633dc0e79e6fe9dc29dd57e51e4`);
    // console.log(TEMP["data"]["main"]["temp"]);
    // let terrain = await axios.get(`https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lon}&units=metric&key=AIzaSyDcnHYgcC-bKhg4sIumw-FooUjSHMBFods`);
    // console.log(terrain["data"]["results"][0]["elevation"]);
  }
  findWeather();

  let tempVal;
  let precipVal;
  let seaVal;
  let popVal;

  //TEMP
 
  if (currTemp > 35) {
    tempVal = 4;
  } else if (currTemp > 20) {
    tempVal = 3;
  } else if (currTemp > 5) {
    tempVal = 2;
  } else {
    tempVal = 1;
  }

  //DIST FROM SEA
  if (this.distFromSea > 2000) {
    seaVal = 4;
  } else if (this.distFromSea > 1000) {
    seaVal = 3;
  } else if (this.distFromSea > 500) {
    seaVal = 2;
  } else {
    seaVal = 1;
  }

  //POPULATION
  if (this.popData > 500) {
    popVal = 4;
  } else if (this.popData > 250) {
    popVal = 3;
  } else if (this.popData > 100) {
    popVal = 2;
  } else {
    popVal = 1;
  }
  let arr = [1, 2, 3, 4];
  let data = arr[Math.floor(Math.random() * arr.length)];
  let data2 = arr[Math.floor(Math.random() * arr.length)];

  // if (this.currTemp > 35) {
  //     tempVal = 4;
  // }
  // else if (currTemp > 20) {
  //     tempVal = 3;
  // }
  // else if (currTemp > 5) {
  //     tempVal = 2;
  // }
  // else {
  //     tempVal = 1;
  // }

  res.json({
    tempVal: data,
    seaVal: seaVal,
    // precipVal: precipVal,
    popVal: popVal
  });
};
module.exports.gethome = (req, res) => {
  let home = fs.readFileSync("./public/home.html");
  let home1 = home + " ";

  res.end(home1);
};
