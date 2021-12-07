const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const Ratings = require('./Models/Rating');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio();
io.listen(5000);

app.use(express.json());

var rider = [];
var driver = [];
var init = [];


var bestMatch = function(){
  var matchingPair = [];
  var minDistance = 9999999;
  var position = 0;

  for(var m = rider.length - 1; m >= 0; m--)
  {
    var i = 0;
    for(var n = 0; n < driver.length; n++)
    {
      // console.log("ITERATION _"+m+ "Length "+ rider.length);
      var distance = Math.sqrt(Math.pow((driver[n].lat - rider[m - rider.length + 1].lat), 2)) +
          Math.sqrt(Math.pow((driver[n].lang - rider[m - rider.length + 1].lang), 2)) ;
      if(distance < minDistance)
      {
        minDistance = distance;
        position = i;
      }
      i++;
      // console.log(distance);
    }

    matchingPair.push(rider[0]);
    matchingPair.push(driver[position]);
    rider.splice(0, 1);
    driver.splice(position, 1);

    position = 0;
    minDistance = 9999999;
  }

  // for(var i = 0; i < matchingPair.length; i+=2){
  //   console.log("Driver Info:\n" + "Name: " + matchingPair[i].name + " Lat: " + matchingPair[i].lat + " Lang: " + matchingPair[i].lang
  //   + "\nRider Info:\n" + "Name: " + matchingPair[i+1].name + " Lat: " + matchingPair[i+1].lat + " Lang: " + matchingPair[i+1].lang)
  //   console.log("\n");
  // }

  return matchingPair;
}

// connecting to db
mongoose.connect('mongodb://localhost:27017/RideSharingApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to Database");
});


app.post('/rating', (req, res) => {
  // console.log(req.body);
  console.log("RATINGS Added");
  
  for(var i = 0; i < req.body.length; i++)
  {
    const rating = new Ratings({
      driverNmae: req.body[i].driverName,
      riderName: req.body[i].riderName,
      rating: req.body[i].rating
    });
    rating.save()
    .then(data => {
      console.log(data);
      console.log("Ratings saved Successfully");
    })
    .catch(error => {
      console.log(error);
    });
  }

  res.end();
  
});

// Run when client connects
const connection = io.on('connection', socket => {
  console.log("New WS Connection onpend!!!");
  // socket.emit("message", "Welcome to Socket");

  // emit message
  // socket.emit("message", "Connection Started!!!");
});

app.post('/communication', (req, res) => {
  console.log("Request Body:");
  console.log(req.body);

  connection.emit('message', req.body);
  
  res.status(201).send("Request Completed");
  res.end();
});

app.post('/rider', (req, res) => {
  console.log(req.body);
  console.log("RIDER");
  rider.push(req.body);
  // console.log(rider);

  if(init.length == 0)
  {
    init.push(1);

    setInterval(() => {
      if(rider.length != 0)
      {
        const match = bestMatch();
        sendData(match);
      }
    }
  , 5000);
  }

  res.send("Request Completed");
  res.end();
});

app.post('/driver', (req, res) => {
  console.log(req.body);
  console.log("DRIVER");
  driver.push(req.body);
  // console.log(driver);
  res.send("Request Completed");
  res.end();
});

//sending data to communication endpoint
const sendData = function(match) {
  const data = JSON.stringify(match);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/communication',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      process.stdout.write(d);
    })
  })
  
  req.on('error', error => {
    console.error(error);
  })
  
  req.write(data);
  req.end();
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
