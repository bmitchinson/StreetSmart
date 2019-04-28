const express = require('express');
const path = require('path');
const http = require('http')
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const firebase = require("firebase");
var moment = require('moment');

require("firebase/firestore");

firebase.initializeApp({
  apiKey: "***REMOVED***",
  authDomain: "***REMOVED***",
  projectId: "***REMOVED***"
});

var db = firebase.firestore();

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

  // Dump all data when called
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
    let query = db.collection("events")

    if(req.query.Date !== undefined) {
      let date_from_url = req.query.Date
      let date = moment(date_from_url).toDate()
      query = query.where("Time", "==", date)
    }

    if(req.query.StartDate !== undefined) {
      let start_date_from_url = req.query.StartDate
      let end_date_from_url = req.query.EndDate
      let start_date = moment(start_date_from_url).toDate()
      let end_date = moment(end_date_from_url).toDate()
      query = query.where("Time", ">=", start_date).where("Time", "<=", end_date)
    }

    if(req.query.Driver !== undefined) {
      query = query.where("Driver", "==", req.query.Driver)
    }

    if(req.query.Safe !== undefined) {
      query = query.where("SpeedStatus", "<=", 0)
    }

    if(req.query.Speeding !== undefined) {
      query = query.where("SpeedStatus", ">", 0)
    }

    if(req.query.RealData !== undefined) {
      if(req.query.RealData == "true") {
        query = query.where("RealData", "==", true)
      }
      else {
        query = query.where("RealData", "==", false)
      }
    }
   
    let hash = []
    query.get().then((querySnapshot) => {
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
