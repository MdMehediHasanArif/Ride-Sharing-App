const io = require('socket.io-client');
const http = require('http');


const socket = io.connect('http://localhost:5000');
// const socket = io.connect(`http://communication.${server_location}.com:5000`);


socket.on("message", message=> {
  console.log(message);
  var userData = JSON.stringify(message);
  var data = JSON.parse(userData);
  console.log(data);

  for(var i = 0; i < data.length; i+=2){
    console.log("Driver Info:\n" + "Name: " + data[i].name + " Lat: " + data[i].lat + " Lang: " + data[i].lang
    + "\nRider Info:\n" + "Name: " + data[i+1].name + " Lat: " + data[i+1].lat + " Lang: " + data[i+1].lang)
    console.log("\n");
  }

  rating(data);
});

var rating = function(data){
  var ratingInfo = [];
  for(var i = 0; i < data.length; i+= 2)
  {
    var info = {
      driverName: data[i].name,
      riderName: data[i+1].name,
      rating: (Math.random() * 4) + 1
    }
    ratingInfo.push(info);
  }

  const reqBody = JSON.stringify(ratingInfo);

  const options = {
    hostname: 'localhost',
    // hostname: `server.${server_location}.com`,
    port: 104,
    // port: 3005,
    path: '/rating',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
  
    res.on('data', d => {
      process.stdout.write(d);
    })
  })
  
  req.on('error', error => {
    console.error(error);
  })
  
  req.write(reqBody);
  req.end();
}



setInterval(() => {
  riderData();
  driverData();
  }
, 1000);

var riderData = function(){
  var randomName = getRandomName();
  const data = {
    name: randomName,
    lat: (Math.random() * 100) + 1,
    lang: (Math.random() * 100) + 1
  };
  
  const reqBody = JSON.stringify(data);

  const options = {
    hostname: 'localhost',
    // hostname: `server.${server_location}.com`,
    port: 104,
    // port: 8080,
    // port: 3000,
    path: '/rider',
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
  
  req.write(reqBody);
  req.end();
}
 
var driverData = function(){
    var randomName = getRandomName();
    const data = {
      name: randomName,
      lat: (Math.random() * 100) + 1,
      lang: (Math.random() * 100) + 1
    };
    
    const reqBody = JSON.stringify(data);
  
    const options = {
      hostname: 'localhost',
      // hostname: `server.${server_location}.com`,
      port: 104,
      // port: 3000,
      // port: 8080,
      path: '/driver',
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
    
    req.write(reqBody);
    req.end();
}

var getRandomName = function(){
  var names = ["Mike","Nick","Slagathor","Banana","Rick","Astley","Rock","JW","pronax","Bilbo","Frodo","Theodulph",
              "Berthefried", 'Tatiana', 'Hildeburg'];
  var position = Math.floor((Math.random() * (names.length)));
  return names[position];
}
