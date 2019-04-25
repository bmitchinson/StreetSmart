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
let Battery = 81 // Will decay slowly
let Driver = "Tyler" // Constant

// Optional status code enabled for the entire trip
let StatusCode = ""

// Starting time of the trip
let Time = moment('04-24-2019 19:53', 'MM-DD-YYYY hh:mm');

// check point strings to use for simulated trip
let checkpointStrings = [
  "41.660145, -91.537679",
  "41.659920, -91.520041",
  "41.651764, -91.507637"
]
// Alters varience from speed limit
let DriveStyle = 0 // -2: Slow driver, 0: Strict Driver, 1: Late, 3: Stupid

let speedLimit = 35
let sampleRate = 15 // Sample every 15 seconds
let timeFactor = 3
let pushMode = false
let delayMode = true

// Converts strings to GeoPoint
let checkpoints = []

checkpointStrings.forEach( (text) => {
  let geo = new firebase.firestore.GeoPoint(
    Number(text.split(',')[0]), Number(text.split(',')[1]));
  checkpoints.push(geo);
})

function cordDistKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

let carGeoPoint = checkpoints[0];
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
console.log(Time.format('lll') + ": Starting 🚗  @ " 
+ String(carGeoPoint.latitude) + ", " + String(carGeoPoint.longitude) + 
" Driver Style: " + DriveStyle)
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
// Begin adding data in simulated time (if delayMode, otherwise all at once)
checkpoints.forEach((destPoint, index) => {
  if (index != 0) {
    // Variance in speed
    let carMPH = speedLimit + (DriveStyle*Math.floor(Math.random()*10)+1)
    if (DriveStyle == 0){
      carMPH--
    }
    let carMPS = carMPH / 3600
    let carMPSample = carMPS * sampleRate
    let milesBetween = cordDistKm(destPoint.latitude, destPoint.longitude,
      carGeoPoint.latitude, carGeoPoint.longitude) * .6214; //KM to Miles
    let subPointsCount = milesBetween / carMPSample
    let subPoints = [];
    let latShift = (destPoint.latitude - 
      carGeoPoint.latitude)/subPointsCount
    let longShift = (destPoint.longitude - 
      carGeoPoint.longitude)/subPointsCount
    latShift = latShift
    longShift = latShift
    let subPointsIndex = 0;
    while (subPointsIndex < subPointsCount-1){
      // Shift + push to FB
      carGeoPoint = new firebase.firestore.GeoPoint(
        carGeoPoint.latitude + latShift,
        carGeoPoint.longitude + longShift
        )
        if (pushMode){
          console.log("Give to FB")
        }
        if (delayMode){
          sleep(1000 * sampleRate / timeFactor);
        }
        subPointsIndex++
        Time = Time.add(sampleRate, 'seconds')
        console.log(Time.format('lll') + ": 🚗  located @ " + 
          String(Math.round(carGeoPoint.latitude * 1000000.0) / 1000000.0) + 
          ", " + String(Math.round(carGeoPoint.longitude * 1000000.0) / 1000000.0)
          + " going " + carMPH + "MPH in a " + speedLimit + "MPH Zone"
        );
      }
      carGeoPoint = checkpoints[index]
      if (pushMode){
        console.log("Give to FB")
      }
      if (delayMode){
        sleep(1000 * sampleRate / timeFactor);
      }
      Time = Time.add(sampleRate, 'seconds')
      console.log(Time.format('lll') + ": 🚗  reached point " + index + "! " + checkpointStrings[index]);
    }
  })
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log("End of trip");
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

/* db.collection("events").doc().set({
  Battery: Battery,
  Driver: Driver,
  Location: Location,
  Speed: Speed,
  SpeedLimit: SpeedLimit,
  SpeedStatus: SpeedStatus,
  StatusCode: StatusCode,
  Time: firebase.firestore.Timestamp.fromDate(Time.toDate())
}).then( () => {
  console.log("Wrote to firebase");
  process.exit();
}) */