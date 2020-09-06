const express = require('express');
const mongoose = require('mongoose');
const app = express();
const redirect = require('./routes/makeIds');
const { Model, schema, validate } = require('./models/urlschema');
const methodOverride = require('method-override');
const cors = require('cors');

mongoose.connect('mongodb://localhost/url-shortner', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected to mongodb');
}).catch(err => {
    console.log('could not connect to mongodb');
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cors());

app.get('/', async (req, res) => {
    const urls = await Model.find();
    res.render('index', { shortUrls: urls });
});

app.post('/', async (req, res) => {
    const unique = await Model.findOne({ url: req.body.url });
    if(unique) return res.redirect('/');
    const inuse = await Model.findOne({ redirectId: req.body.redirectId });
    if(inuse) return res.redirect('/');

    const model = new Model({
        url: req.body.fullUrl,
        redirectId: req.body.custom || redirect(6)
    });

    await model.save();

    res.redirect('/');
});

app.get('/:redirectId', async (req, res) => {
    const redirectId = req.params.redirectId;
    const urlFound = await Model.findOne({ redirectId: redirectId });

    res.redirect(urlFound.url);
});

app.delete('/d/:redirectId', async (req, res) => {
    const redirectId = req.params.redirectId;
    const urlFound = await Model.findOne({ redirectId: redirectId });

    await Model.findByIdAndDelete(urlFound.id);

    res.redirect('/');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});