const express = require('express');
const path = require('path');
const http = require('http')
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const Firestore = require('@google-cloud/firestore');
const firebase = require("firebase");
var moment = require('moment');

require("firebase/firestore");

firebase.initializeApp({
  apiKey: "***REMOVED***",
  authDomain: "***REMOVED***",
  projectId: "***REMOVED***"
});

var db = firebase.firestore();

db.collection("events").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
      let time = doc.data().Time
      console.log(time)
      let date = moment(time);
      date = date.toDate();
      console.log(date.format("MM/DD/YY"))
  });
});


const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Answer API requests.
  app.get('/api', function (req, res) {
    let hash = []
    db.collection("events").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          hash.push(doc.data())
      });
      res.json(hash)
    });
  });

  // Route for getting all events
  app.get('/Events', function (req, res) {
    console.log("asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf")
    console.log(req.query.date)
    let hash = []
    db.collection("events").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          hash.push(doc.data())
      });
      res.json(hash)
    });
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}
