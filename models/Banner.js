const mongoose = require('mongoose');
const bannerSchema = new mongoose.Schema({
    image0 : String,
    image1 : String,
    image2 : String
}, { timestamps: true })

module.exports = mongoose.model('Banner', bannerSchema);
