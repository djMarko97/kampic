const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Database connected")
    })
    .catch(err => {
        console.log("Database is not connected")
        console.log(err);
    })



const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: 'My Backyard', price: '$10' });
    await camp.save();
    res.send(camp)
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})