const express = require('express');
const path = require('path');
const http = require('http')
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const firebase = require("firebase");
var moment = require('moment');

import {APIKEY, DOMAIN} from '../firebaseConfig';

require("firebase/firestore");

firebase.initializeApp({
  apiKey: APIKEY,
  authDomain: DOMAIN + '.firebaseapp.com',
  projectId: DOMAIN
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
    let result = []
    db.collection("events").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        result.push(doc.data())
      });
      res.json(result)
    });
  });

  // Route for getting all events
  app.get('/Events', function (req, res) {
    let query = db.collection("events")

    if (req.query.Date !== undefined) {
      let date_from_url = req.query.Date
      let date = moment(date_from_url, 'x')
      query = query.where("Time", ">=", date.toDate())
        .where("Time", "<=", date.endOf('day').toDate())
    }

    if (req.query.StartDate !== undefined) {
      let start_date_from_url = req.query.StartDate
      let end_date_from_url = req.query.EndDate
      let start_date = moment(start_date_from_url).toDate()
      let end_date = moment(end_date_from_url).toDate()
      query = query.where("Time", ">=", start_date).where("Time", "<=", end_date)
    }

    if (req.query.Driver !== undefined) {
      query = query.where("Driver", "==", req.query.Driver)
    }

    if (req.query.RealData !== undefined) {
      if (req.query.RealData == "Sensor") {
        query = query.where("RealData", "==", true)
      }
      else if (req.query.RealData == "Sim"){
        query = query.where("RealData", "==", false)
      }
    }

    let result = {}
    let index = 0
    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (req.query.Speeding == "OverLimit") {
          if (doc.data().SpeedStatus > 0) {
            result[index] = doc.data()
            index++
          }
        }
        else if (req.query.Speeding == "UnderLimit") {
          if (doc.data().SpeedStatus <= 0) {
            result[index] = doc.data()
            index++
          }
        }
        else {
          result[index] = doc.data()
          index++
        }
      })

      if (req.query.Speed != undefined && result[0] != undefined) {
        switch (req.query.Speed) {
          case "10-25":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if (result[i].Speed < 10 || result[i].Speed > 25) {
                delete result[i]
              }
            }
            break;
          case "25-35":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if (result[i].Speed < 25 || result[i].Speed > 35) {
                delete result[i]
              }
            }
            break;
          case "35-45":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if (result[i].Speed < 35 || result[i].Speed > 45) {
                delete result[i]
              }
            }
            break;
          case "45-60":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if (result[i].Speed < 45 || result[i].Speed > 60) {
                delete result[i]
              }
            }
            break;
          case "60-75":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if (result[i].Speed < 60 || result[i].Speed > 75) {
                delete result[i]
              }
            }
            break;
          case "75-90":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if (result[i].Speed < 75 || result[i].Speed > 90) {
                delete result[i]
              }
            }
            break;
          case "90+":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if (result[i].Speed < 90) {
                delete result[i]
              }
            }
            break;

          default:
        }
      }

      if (req.query.SpeedLimit != undefined && result[0] != undefined) {
        switch (req.query.SpeedLimit) {
          case "10-25":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if ((result[i] != undefined) && (result[i].SpeedLimit < 10 || result[i].SpeedLimit > 25)) {
                delete result[i]
              }
            }
            break;
          case "25-35":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if ((result[i] != undefined) && (result[i].SpeedLimit < 25 || result[i].SpeedLimit > 35)) {
                delete result[i]
              }
            }
            break;
          case "35-45":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if ((result[i] != undefined) && (result[i].SpeedLimit < 35 || result[i].SpeedLimit > 45)) {
                delete result[i]
              }
            }
            break;
          case "45-60":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if ((result[i] != undefined) && (result[i].SpeedLimit < 45 || result[i].SpeedLimit > 60)) {
                delete result[i]
              }
            }
            break;
          case "60-75":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if ((result[i] != undefined) && (result[i].SpeedLimit < 60 || result[i].SpeedLimit > 75)) {
                delete result[i]
              }
            }
            break;
          case "75-90":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if ((result[i] != undefined) && (result[i].SpeedLimit < 75 || result[i].SpeedLimit > 90)) {
                delete result[i]
              }
            }
            break;
          case "90+":
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
              if ((result[i] != undefined) && (result[i].SpeedLimit < 90)) {
                delete result[i]
              }
            }
            break;

          default:
        }
      }
      res.json(result)
    })
  })

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'))
  })

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`)
  })

}
