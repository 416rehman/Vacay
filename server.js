const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const auth = require('./controllers/middleware/authentication')
//Used for caching
const typeSchema = require('./models/type.js')
      locationSchema = require('./models/location.js')

//Authentication
const passport = require('passport'),
    setupPassport = require('./passport/passportConfig'),
    session = require("express-session");
setupPassport(passport)

require('dotenv').config()

app = express()

//Mongoose connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,}) .then(async ()=>{
        console.log(`Caching Types and Locations!`)
        app.locals.typesCache = await typeSchema.find().lean()
        app.locals.locationsCache = await locationSchema.find().lean()
        console.log(`FINISHED caching Types and Locations!`)
    })

//Register custom handlebars helpers
let hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: require('./views/helpers/utils')
});

//Process file uploads from forms
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true
}));

//Process POST HTML forms data
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//Set handlebars biew engine
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

//Static dir
app.use(express.static(__dirname + '/public'));

app.use(auth.DynamicLayout);
//localhost:3000
app.use('/', require('./controllers/home.js'));

//localhost:3000/@123
app.use('/', require('./controllers/@.js'));

//localhost:3000/listings
//localhost:3000/listings/1234
app.use('/listings', require('./controllers/listings.js'))

//localhost:3000/signup
app.use('/signup', require('./controllers/signup.js'));

//localhost:3000/login
app.use('/login', require('./controllers/login.js')(passport));

//localhost:3000/logout
app.use('/logout', require('./controllers/logout.js'));

// TODO
//localhost:3000/search
// app.use('/search', require('./controllers/search.js'));

//localhost:3000/articles/123
app.use('/articles', require('./controllers/articles.js'));

//CREATE A NEW PROPERTY TYPE, LOCATION, LISTING, OR ARTICLE
//localhost:3000/type
app.use('/new', auth.LoggedInOnly, require('./controllers/new/new.js'));

//localhost:3000/dev - FOR DEVELOPMENT PURPOSES
app.use('/dev', require('./controllers/dev.js'));

//404 - For any non-configured routes
app.use(require('./controllers/404.js'));

app.listen(process.env.PORT, ()=>{
    console.log(`Server listening on port: ${process.env.PORT}`)
})