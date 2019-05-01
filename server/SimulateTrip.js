const firebase = require("firebase");
var moment = require('moment');

// Firebase initializtion
firebase.initializeApp({
  apiKey: "***REMOVED***",
  authDomain: "streetsmart-2cf68.firebaseapp.com",
  projectId: "streetsmart-2cf68"
});
var db = firebase.firestore();

// Initial Values for simulating a "trip"
let Battery = Math.floor(Math.random() * 60) + 40 // Will decay slowly

// Optional status code enabled for the entire trip
let StatusCode = ""

// Starting time of the trip
let Driver = "Tyler" // Constant
let Time = moment('05-2-2019 10:45', 'MM-DD-YYYY hh:mm');

// to use for simulated trip
let checkpointStrings = [
  "41.663611, -91.534595",
  "41.663627, -91.537588",
  "41.656694, -91.537728",
  "41.656615, -91.530174",
  "41.654159, -91.530218",
  "41.650474, -91.531966",
  "41.649512, -91.532020",
  "41.649472, -91.515884"
]

let speedLimits = [
  25, 35, 25, 25, 25, 25, 45
]

// Alters varience from speed limit
let DriveStyle = 2 // -2: Slow driver, 0: Strict Driver, 1: Late, 3: Stupid
let sampleRate = 12 // Sample every 15 seconds
let timeFactor = 2 // Move time along 3x times faster
let pushMode = true // If enabled results are pushed to firebase
let delayMode = true // If enabled, time / speed MPH accurate delays occur

// Converts strings to GeoPoints for publishing 
let checkpoints = []

checkpointStrings.forEach((text) => {
  let geo = new firebase.firestore.GeoPoint(
    Number(text.split(',')[0]), Number(text.split(',')[1]));
  checkpoints.push(geo);
})

function cordDistKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

async function sim(){
let carGeoPoint = checkpoints[0];
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
console.log(Time.format('lll') + ": Starting 🚗  @ "
  + String(carGeoPoint.latitude) + ", " + String(carGeoPoint.longitude) +
  " Driver Style: " + DriveStyle)
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
// Begin adding data in simulated time (if delayMode, otherwise all at once)
let index = 0
for (const destPoint of checkpoints){
//checkpoints.forEach((destPoint, index) => {
  if (index != 0) {
    // Variance in speed
    let carMPH = speedLimits[index - 1] + (DriveStyle * Math.floor(Math.random() * 10) + 1)
    if (DriveStyle == 0) {
      carMPH--
    }
    let carMPS = carMPH / 3600
    let carMPSample = carMPS * sampleRate
    let milesBetween = cordDistKm(destPoint.latitude, destPoint.longitude,
      carGeoPoint.latitude, carGeoPoint.longitude) * .6214; //KM to Miles
    let subPointsCount = milesBetween / carMPSample
    let subPoints = [];
    let latShift = (destPoint.latitude -
      carGeoPoint.latitude) / subPointsCount
    let longShift = (destPoint.longitude -
      carGeoPoint.longitude) / subPointsCount
    let subPointsIndex = 0;
    while (subPointsIndex < subPointsCount - 1) {
      carGeoPoint = new firebase.firestore.GeoPoint(
        carGeoPoint.latitude + latShift,
        carGeoPoint.longitude + longShift
      )
      if (pushMode) {
        await db.collection("events").doc().set({
          RealData: false,
          Battery: Battery,
          Driver: Driver,
          Location: carGeoPoint,
          Speed: carMPH,
          SpeedLimit: speedLimits[index - 1],
          SpeedStatus: (carMPH - speedLimits[index - 1]),
          StatusCode: StatusCode,
          Time: firebase.firestore.Timestamp.fromDate(Time.toDate())
        }).then(() => {
          console.log("🔥 ✔️");
        })
      }
      if (delayMode) {
        sleep(1000 * sampleRate / timeFactor);
      }
      subPointsIndex++
      Time = Time.add(sampleRate, 'seconds')
      console.log(Time.format('lll') + ": 🚗  located @ " +
        String(Math.round(carGeoPoint.latitude * 1000000.0) / 1000000.0) +
        ", " + String(Math.round(carGeoPoint.longitude * 1000000.0) / 1000000.0)
        + " going " + carMPH + "MPH in a " + speedLimits[index - 1] + "MPH Zone"
      );
    }
    Battery--
    carGeoPoint = checkpoints[index]
    if (pushMode) {
      await db.collection("events").doc().set({
        RealData: false,
        Battery: Battery,
        Driver: Driver,
        Location: carGeoPoint,
        Speed: carMPH,
        SpeedLimit: speedLimits[index - 1],
        SpeedStatus: (carMPH - speedLimits[index - 1]),
        StatusCode: StatusCode,
        Time: firebase.firestore.Timestamp.fromDate(Time.toDate())
      }).then(() => {
        console.log("🔥 ✔️");
      })
    }
    if (delayMode) {
      sleep(1000 * sampleRate / timeFactor);
    }
    Time = Time.add(sampleRate, 'seconds')
    console.log(Time.format('lll') + ": 🚗  reached point " + String(index+1) + "! " + checkpointStrings[index]);
  }
  index++
}
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
console.log("End of trip");
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
}

// Call the main sim async function
sim()

/* db.collection("bentest").doc().set({
  RealData: false,
  Battery: Battery,
  Driver: Driver,
  Location: carGeoPoint,
  Speed: carMPH,
  SpeedLimit: speedLimits[index - 1],
  SpeedStatus: (carMPH - speedLimits[index - 1]),
  StatusCode: StatusCode,
  Time: firebase.firestore.Timestamp.fromDate(Time.toDate())
}).then(() => {
  console.log("🔥 ✔️");
}) */
