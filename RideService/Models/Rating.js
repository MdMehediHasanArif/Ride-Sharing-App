const mongoose = require('mongoose');

const RatingSchema = mongoose.Schema({
    driverNmae: String,
    riderName: String,
    rating: Number
});

module.exports = mongoose.model("Ratings", RatingSchema);