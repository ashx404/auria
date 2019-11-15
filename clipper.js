const fs = require("fs");
const MidiConvert = require("midiconvert");
const scribble = require("scribbletune");
const express = require("express");
const app = express();
var cors = require("cors");
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/p", (req, res) => {
  //console.log(req)
  // makeMusic(7,0,0);
  console.log(req);
  // makeMusic(7,0,0)
  sChoose = getAPI(6);
  pChoose = getAPI(2);
  res.send("hoho");
  makeMusic(sChoose, 1, pChoose);
});

//Send Chord Scale, Major/minor, progression

function getAPI(param) {
  var pick = Math.floor(Math.random() * param);
  console.log("RAND " + pick);
  return pick;
}

function makeMusic(sChoose, mChoose, pChoose) {
  if (sChoose == 1 || sChoose == 2 || sChoose == 5) sChoose = 0;
  console.log();
  console.log("AAAAA" + sChoose + mChoose + pChoose);
  var notes = [];
  console.log("NODES");
  console.log(notes);
  var chords = [];
  let pattern = "";
  let cpattern = "";
  var finalChord = getNote(sChoose) + " " + getType(mChoose);
  var finalProgression = getProgression(pChoose);
  console.log("Final Chord: " + finalChord);
  finalProgression.forEach(element => {
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
      progression[0] = " I V vi iii ";
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

  // function changer() {
  //     var arnotes = ['C', 'D', 'E', 'F','G','A','B','C']
  //     var nutu = []
  //     console.log("NOTES")
  //     console.log(notes)
  //     notes.forEach(element => {
  //         var key = element.split("",2)
  //         console.log("key: "+key)
  //         if(key[1] == '#'){
  //             key[1] = 'b'
  //             for(var i=0; i<arnotes.length; i++) {
  //                 if(key[0] == arnotes[i])
  //                     key[0] = arnotes[i+1]
  //             }
  //         }
  //         nutu.push(key)
  //         console.log(nutu)
  //     });

  function getFlute(value) {
    var flute = [];

    for (var i = 0; i <= notes.length - 1; i++) {
      if (i % 3 == 0) flute.push(notes[i]);
    }

    console.log("FUFUFU");
    console.log(flute);
    return flute;
  }

  //getFlute(0)

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
    var choose;
    for (var i = 0; i < getCh.length; i++) {
      getOc.push(getCh[i].split("")[1]);
      getCh[i] = getCh[i].split("")[0];
      if (value == "0") choose = "m";
      else choose = "M";
      getCh[i] += choose + "-" + (getOc[i] - 1);
    }
    console.log("PlayCH: " + getCh);
    console.log("PlayCH length: " + getCh.length);
    return getCh;
  }

  function clipper(sChoose, mChoose, pChoose) {
    //  changer ()
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

  mixer();
  function splitter(arr, oct) {
    var arry = [];
    arr.forEach(element => {
      arry.push(element.split("")[0] + oct);
      console.log(arry);
    });
    return arry;
  }

  function mixer() {
    var midi = MidiConvert.create();

    fs.readFile("base.mid", "binary", function(err, midiBlob) {
      if (!err) {
        let x = MidiConvert.parse(midiBlob);
        console.log("BAS:");
        console.log(x);
        x.tracks[0].patch(32);

        midi.tracks.push(x.tracks[0]);
        console.log(midi);
      }
    });

    fs.readFile("cool.mid", "binary", function(err, midiBlob) {
      if (!err) {
        let x = MidiConvert.parse(midiBlob);
        x.tracks[0].patch(0);
        x.tracks[0].channelNumber = 4;
        x.tracks[0].id = 4;
        x.tracks[0].name = "GOD";

        midi.tracks.push(x.tracks[0]);
        console.log(midi);
      }
    });

    fs.readFile("chord.mid", "binary", function(err, midiBlob) {
      if (!err) {
        let x = MidiConvert.parse(midiBlob);
        x.tracks[0].patch(0);
        x.tracks[0].channelNumber = 2;
        x.tracks[0].id = 2;

        midi.tracks.push(x.tracks[0]);
        console.log(midi);
      }
    });

    fs.readFile("flute.mid", "binary", function(err, midiBlob) {
      if (!err) {
        let x = MidiConvert.parse(midiBlob);
        x.tracks[0].patch(75);
        x.tracks[0].channelNumber = 3;
        x.tracks[0].id = 3;

        midi.tracks.push(x.tracks[0]);
        console.log(midi);
        fs.writeFileSync("ANS.mid", midi.encode(), "binary");
      }
    });
    console.log("MIDI");
    console.log(midi);
  }
}

app.listen(7676, (req, res) => {
  console.log("Server on 7676");
});
