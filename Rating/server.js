const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const Ratings = require('./Models/Rating');

const app = express();
const server = http.createServer(app);

app.use(express.json());

// connecting to db
mongoose.connect('mongodb://mongodb:27017/RideSharingApp', {
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

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
