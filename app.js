const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
})


// prikaz svih
app.get('/campgrounds', async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps })
})

// ubacivanje novog
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds`);
})

// prikaz odredjenog
app.get('/campgrounds/:id', async (req, res) => {
    const id = req.params.id;
    const camp = await Campground.findById(id);
    res.render('campgrounds/show', { camp })
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const id = req.params.id;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp })
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect('/campgrounds');
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    await Campground.deleteOne(camp);
    res.redirect('/campgrounds')
})


app.listen(3000, () => {
    console.log("Serving on port 3000")
})