
const firebase = require("firebase");
var moment = require('moment');

// Firebase initializtion
firebase.initializeApp({
  apiKey: "***REMOVED***",
  authDomain: "streetsmart-2cf68.firebaseapp.com",
  projectId: "streetsmart-2cf68"
});

text = "41.660145, -91.537679";
let geo = new firebase.firestore.GeoPoint(
  Number(text.split(',')[0]), Number(text.split(',')[1])
);

var db = firebase.firestore(); 
db.collection("events").doc().set({
  Battery: 100,
  Driver: "Test",
  Location: geo,
  Speed: 35,
  SpeedLimit: 35,
  SpeedStatus: 0,
  StatusCode: "",
  Time: firebase.firestore.Timestamp.fromDate(new moment().toDate())
}).then( () => {
  console.log("Done")
  process.exit();
})