const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const server_location = process.env.SERVERLOCATION;

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

//sending data to communication endpoint
const sendData = function(match) {
  const data = JSON.stringify(match);

  const options = {
    // hostname: 'localhost',
    // hostname: 'communication-service',
    hostname: `communication-service-${server_location}`,
    port: 3002,
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

app.post('/driver', (req, res) => {
  console.log(req.body);
  console.log("DRIVER");
  driver.push(req.body);
  // console.log(driver);
  res.send("Request Completed");
  res.end();
});

const PORT = process.env.PORT || 3000;
// const HOST = '0.0.0.0';

server.listen(PORT);
