const fs = require("fs");
const axios = require("axios");
const MidiConvert = require("midiconvert");
const scribble = require("scribbletune");
const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var series = require("async/series");

let temp, water, humidity, elevation;

let tempVal;
let precipVal;
let seaVal;
let heightVal;

module.exports.sendapival = (req, res) => {
  console.log("Fired");
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
      precipVal = 3;
    } else if (humidity > 55) {
      precipVal = 2;
    } else if (humidity > 30) {
      precipVal = 1;
    } else {
      precipVal = 0;
    }

    if (elevation > 1000) {
      heightVal = 3;
    } else if (elevation > 500) {
      heightVal = 2;
    } else if (elevation > 200) {
      heightVal = 1;
    } else {
      heightVal = 0;
    }

    console.log(tempVal + "." + precipVal + "." + seaVal + "." + heightVal);

    makeMusic(tempVal + heightVal, seaVal, precipVal, res);
    // res.send(true);
  }
  findWeather();
  res.json(true);
};

module.exports.gethome = (req, res) => {
  let home = fs.readFileSync("./public/home.html");
  let home1 = home + " ";

  res.end(home1);
};

function makeMusic(sChoose, mChoose, pChoose, res) {
  // if (sChoose == 1 || sChoose == 2 || sChoose == 5)
  //   sChoose = 0;
  console.log("Music Parameter Code: " + sChoose + mChoose + pChoose);
  var notes = [];
  var chords = [];
  let pattern = "";
  let cpattern = "";
  var finalChord = getNote(sChoose) + " " + getType(mChoose);
  var finalProgression = getProgression(pChoose);
  console.log("Final Chord: " + finalChord);
  finalProgression.forEach(element => {
    console.log("Elem: " + element);
    chords.push(scribble.getChordsByProgression(finalChord, element));
    console.log(
      "in pusher: " + scribble.getChordsByProgression(finalChord, element)
    );
  });

  var flutey = chords;
  chords.forEach(element => {
    element.split(" ").forEach((c, i) => {
      const chord = scribble.chord(c);
      if (i % 2 !== 0) {
        // use 2 quarter notes
        notes.push(chord[0]);
        notes.push(chord[1]);
        pattern = pattern + "x_";
        //     cpattern = cpattern + 'x_'
      } else {
        // use a quarter note and 2 eigth notes
        notes.push(chord[0]);
        notes.push(chord[1]);
        notes.push(chord[2]);
        pattern = pattern + "xx";
        //    cpattern = pattern +
      }
    });
  });

  //console.log("Flutey: "+flutey)
  var patternist = pattern.split;
  console.log("Chords: " + chords);
  console.log("Final chord: " + finalChord);
  console.log("Notes: " + notes);
  console.log("Note length" + notes.length);

  clipper(sChoose, mChoose, pChoose);

  function getProgression(value) {
    var progression = [];
    var outprog = [];
    //12 bar blues
    if (value == 0) {
      progression[0] = "I IV V I";
      progression[1] = "IV IV I I";
      progression[2] = "I I I IV";
    }
    //Sensitive (weird?)
    if (value == 1) {
      progression[0] = "I V vi IV";
    }
    //Jazzy
    if (value == 2) {
      progression[0] = "ii V I";
    }
    //Nostalgic Pop?
    if (value == 3) {
      progression[0] = "I V vi iii";
      progression[1] = "IV I IV V";
    }
    console.log("prog: " + progression);
    // progression.forEach(element => {
    //     var array = element.split(" ");
    //     console.log("Arr: " + array)
    //     var newarray = shuffle(array).join(" ")
    //     outprog.push(newarray)
    // });
    //console.log("out: " + outprog)
    return progression;
  }

  function getNote(value) {
    if (value == 0) note = "C5";
    else if (value == 1) note = "B4";
    else if (value == 2) note = "A4";
    else if (value == 3) note = "G4";
    else if (value == 4) note = "F4";
    else if (value == 5) note = "E4";
    else if (value == 6) note = "D4";
    else if (value == 7) note = "C4";
    return note;
  }

  function getType(value) {
    if (value == 1) return "major";
    if (value == 0) return "minor";
  }

  function changer() {
    var arnotes = ["C", "D", "E", "F", "G", "A", "B", "C"];
    var nutu = [];
    console.log("NOTES");
    console.log(notes);
    notes.forEach(element => {
      var key = element.split("", 2);
      console.log("key: " + key);
      if (key[1] == "#") {
        key[1] = "b";
        for (var i = 0; i < arnotes.length; i++) {
          if (key[0] == arnotes[i]) key[0] = arnotes[i + 1];
        }
      }
      nutu.push(key);
      console.log(nutu);
    });
  }

  function getFlute(value) {
    var flute = [];

    for (var i = 0; i <= notes.length - 1; i++) {
      if (i % 3 == 0) flute.push(notes[i]);
    }

    console.log("FUFUFU");
    console.log(flute);
    return flute;
  }

  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  function playChords(value) {
    var getCh = [];
    for (var i = 0; i < notes.length; i++) {
      if (i % 3 == 0) getCh.push(notes[i]);
    }

    var getOc = [];
    var getCh0;
    var choose;
    for (var i = 0; i < getCh.length; i++) {
      getOc.push(getCh[i].split("")[getCh[i].length - 1]);
      if (getCh[i].length == 3) {
        getCh0 = getCh[i].split("")[1];
        getCh[i] = getCh[i].split("")[0] + getCh0;
        console.log("Getter: " + getCh[i]);
      } else {
        getCh[i] = getCh[i].split("")[0];
        console.log("Getter: " + getCh[i]);
      }

      if (value == "0") choose = "m";
      else choose = "M";
      getCh[i] += choose + "-" + (getOc[i] - 1);
    }
    console.log("PlayCH: " + getCh);
    console.log("PlayCH length: " + getCh.length);
    console.log("GetOC " + getOc);
    return getCh;
  }

  function clipper(sChoose, mChoose, pChoose) {
    changer();
    console.log("FInal Notes: " + notes);
    const playNotes = scribble.clip({
      notes: notes,
      pattern: pattern
      // subdiv: '32n'
    });
    pcl = playChords(mChoose).length;

    const playchords = scribble.clip({
      notes: playChords(mChoose),
      pattern: "x__-".repeat(pcl)
      // subdiv: '32n'
    });

    const playFlute = scribble.clip({
      notes: getFlute(0),
      pattern: "x___".repeat(pcl)
      //subdiv: '16n'
    });

    const playBase = scribble.clip({
      notes: splitter(getFlute(0), 2),
      pattern: "xxxx".repeat(pcl)
    });

    const playCoolRythm = scribble.clip({
      notes: splitter(getFlute(0), 2),
      pattern: "x[xxxx]".repeat(pcl)
    });

    scribble.midi(playNotes, "clip.mid");
    scribble.midi(playchords, "chord.mid");
    scribble.midi(playFlute, "flute.mid");
    scribble.midi(playBase, "base.mid");
    scribble.midi(playCoolRythm, "cool.mid");
  }

  function splitter(arr, oct) {
    var arry = [];
    arr.forEach(element => {
      arry.push(element.split("")[0] + oct);
      console.log(arry);
    });
    return arry;
  }

  var midi = MidiConvert.create();

  series(
    [
      function(callback) {
        fs.readFile("base.mid", "binary", function(err, midiBlob) {
          if (!err) {
            let x = MidiConvert.parse(midiBlob);
            console.log("BAS:");
            console.log(x);
            x.tracks[0].patch(32);
            x.tracks[0].name = "Bass";
            midi.tracks.push(x.tracks[0]);
            console.log("written base");
            callback(null, "one");
          }
        });
      },
      function(callback) {
        fs.readFile("cool.mid", "binary", function(err, midiBlob) {
          if (!err) {
            let x = MidiConvert.parse(midiBlob);
            x.tracks[0].patch(0);
            x.tracks[0].channelNumber = 4;
            x.tracks[0].id = 4;
            x.tracks[0].name = "Cool";
            midi.tracks.push(x.tracks[0]);
            console.log("written cool");
            callback(null, "two");
          }
        });
      },
      function(callback) {
        fs.readFile("chord.mid", "binary", function(err, midiBlob) {
          if (!err) {
            let x = MidiConvert.parse(midiBlob);
            x.tracks[0].patch(0);
            x.tracks[0].channelNumber = 2;
            x.tracks[0].id = 2;
            x.tracks[0].name = "Chords";
            midi.tracks.push(x.tracks[0]);
            console.log("written chords");
            callback(null, "three");
          }
        });
      },
      function(callback) {
        fs.readFile("flute.mid", "binary", function(err, midiBlob) {
          if (!err) {
            let x = MidiConvert.parse(midiBlob);
            x.tracks[0].patch(75);
            x.tracks[0].channelNumber = 3;
            x.tracks[0].id = 3;
            x.tracks[0].name = "Flute";
            midi.tracks.push(x.tracks[0]);
            console.log("written flute");
            callback(null, "four");
          }
        });
      }
    ],
    function(err, results) {
      console.log("REs" + results);
      console.log("Miniiii:");
      console.log(midi);
      fs.writeFileSync("ANS.mid", midi.encode(), "binary");
      console.log("Written");
    }
  );
}
