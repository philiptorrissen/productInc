// bruker express (siden vi lærete litt hos BEKK)
var express = require('Express');
var app = express();

// Lar serveren vise filer fra public-mappa. Dette må settes opp.  
app.use(express.static(__dirname + '/public'));

// bruker PUG som template-framework
app.set('view engine', 'pug');

// respons når brukeren sør etter /items løses av det som ligger i items.js 
var items = require('./items.js');
app.use('/items', items);

// respons når brukeren spør om "ping"
app.use('/ping', function (req, res) {
    // da bruker vi pug til å vise malen "message.pug" med to parameter: title og message (som settes til "pong")
    res.render("message", { title: 'PONG!', message: 'pong'})
});

// Svarer på alle anndre urler. 
app.use('/', function (req, res) {

    // For  å sjekke om en side ikke finnes, henter vi ut urlen brukeren har skrevet inn (req.path)
    console.log("path" + req.path)

    // hvis brukeren spør om noe annet enn startsiden (http://localhost:3000/) viser vi en feilside 
    if (req.path != "/"){
        res.render("error", { title: '404 - Siden Finnes Ikke', message: 'Du har forsøkt å navigere til en side som ikke finnes. (404)'})
    }else {
        // hvis brukeren spør om startsiden, viser vi den med malen "about.pug"
        res.render("about", { title: 'Om denne oppgaven.'})
    }
});

app.listen(3000);