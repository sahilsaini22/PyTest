const express = require('express')
const expressHandlebars = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');
const app = express();
const port = 3000;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://musicdbuser1:root@musicdbcluster-s6hji.azure.mongodb.net/MUSICDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect()
.then(_ => {
    console.log('Connected to MongoDB');
})
.catch(error => console.error(error));

let redisClient = redis.createClient();
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method')); 

app.get('/', async (req, res, next) => {
    const _songs = await client.db("MUSICDB").collection("songs").find();
    const songs = await _songs.toArray();

    redisClient.zrevrange("trending", 0, -1, (err, trending) => {
        res.render('home', {songs, trending});
    });
});

app.get('/song/:_id', (req, res) => {
    const _id = req.params._id;
    // zincrby trending -1 "song5"
    redisClient.zincrby("trending", 1, _id, (err, res) => {});
    res.redirect('/');
});

app.listen(port, () => console.log(`Server started at http://localhost:${port}`));

// client.connect(err => {
//     if (err) return console.log(err);
//     console.log('Connected to Database');
//   const collection = client.db("test").collection("devices");
  // perform actions on the collection object
//   client.close();
// });

// async function main() {
//     try {
//         await client.connect();
//     } catch (e) {
//         console.error(e);
//     } finally {
//         // await client.close();
//     }
// }

// main().catch(console.error);