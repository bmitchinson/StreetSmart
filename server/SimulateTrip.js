const firebase = require("firebase");
var moment = require('moment');

// Firebase initializtion
firebase.initializeApp({
  apiKey: "***REMOVED***",
  authDomain: "***REMOVED***",
  projectId: "***REMOVED***"
});
var db = firebase.firestore();

// Initial Values for simulating a "trip"
let Battery = 81 // Will decay slowly
let Driver = "Tyler" // Constant

// Alters varience from speed limit
let DriveStyle = 1 // -1: Slow driver, 0: Strict Driver, 1: Late, 2: Stupid

// Optional status code enabled for the entire trip
let StatusCode = ""

// Starting time of the trip
let Time = moment('04-24-2019 19:53', 'MM-DD-YYYY hh:mm');

// check point strings to use for simulated trip
let checkpointStrings = [
  "41.660058, -91.526004",
  "41.660090, -91.519642",
  "41.653349, -91.509965"
]
let speedLimit = 35
let sampleRate = 5 // Sample every 15 seconds
let delayMode = false
let pushMode = false

// Converts strings to GeoPoint
let checkpoints = []

checkpointStrings.forEach( (text) => {
  let geo = new firebase.firestore.GeoPoint(
    Number(text.split(',')[0]), Number(text.split(',')[1]));
  checkpoints.push(geo);
})

let carGeoPoint = checkpoints[0];
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
console.log(Time.format('lll') + ": Starting 🚗  @ " 
+ String(carGeoPoint.latitude) + ", " + String(carGeoPoint.longitude))
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
// Begin adding data in simulated time (if delayMode, otherwise all at once)
checkpoints.forEach((destPoint, index) => {
  // Variance in speed
  let carMPH = speedLimit + (DriveStyle*Math.floor(Math.random()*10)+1)
  let carMPS = carMPH / 3600
  console.log(Time.format('lll') + ": 🚗  located @ " + 
  String(carGeoPoint.latitude) + ", " + String(carGeoPoint.longitude) + " going "
    + carMPH + "MPH in a " + speedLimit + "MPH Zone");
  let carMPSample = carMPS * sampleRate
  let milesBetween = 0;
  let subPointsCount = milesBetween / carMPSample
  let subPoints = [];
  let latShift = (destPoint.latitude - 
  carGeoPoint.latitude)/subPointsCount
  let longShift = (destPoint.longitude - 
  carGeoPoint.longitude)/subPointsCount
  let subPointsIndex = 0;
  while (subPointsIndex < subPointsCount-1){
    // Shift + push to FB
    carGeoPoint = new firebase.firestore.GeoPoint(
      (carGeoPoint.latitude + latShift),
      (carGeoPoint.longitude + longShift)
    )
    if (pushMode){
      console.log("Give to FB")
    }
    subPointsIndex++
    if (delayMode){
      setTimeout(sampleRate * 1000);
    }
    Time = Time.add(sampleRate, 'seconds')
    console.log(Time.format('lll') + ": 🚗 located @ " + carGeoPoint + " going "
    + carMPH + "MPH in a " + speedLimit + "MPH Zone");
  }
  carGeoPoint = checkpoints[index]
  if (pushMode){
    console.log("Give to FB")
  }
  if (delayMode){
    setTimeout(sampleRate * 1000);
  }
  Time = Time.add(sampleRate, 'seconds')
  console.log(Time.format('lll') + ": 🚗  reached point " + index + "!");
})
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
console.log("End of trip")
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