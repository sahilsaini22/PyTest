const express = require('express')
const expressHandlebars = require('express-handlebars');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');
const app = express();
const port = 4000;

const ObjectId = require('mongodb').ObjectID;
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

const mongoose = require('mongoose');
const MONGO_URI = "mongodb+srv://musicdbuser1:root@musicdbcluster-s6hji.azure.mongodb.net/MUSICDB?retryWrites=true&w=majority";

const db = `${MONGO_URI}`;

//const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,    
    useUnifiedTopology: true
  }) // Adding new mongo url parser
  .then(() => console.log('Connected to Mongoose'))
  .catch(err => console.log(err));
 // app.use('/users', userRoutes);
  app.use('/auth', authRoutes);

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method')); 
app.use(cors());


//start of changes  (001) - authentication - Sahil
//const userRoutes = require('./routes/api/users');
//end of changes (001) - authentication - Sahil


app.get('/songs', async (req, res) => {
    const _songs = await client.db("MUSICDB").collection("songs").find();
    const songs = await _songs.toArray();
    if (songs) {
        return res.json({
            data: songs
        });
    } else {
        return null;
    }
});

app.get('/trendingSongs', async (req, res) => {
    redisClient.zrevrange("trending", 0, 9, async (err, trendingSongIDs) => {
        const trendingSongs = await Promise.all(trendingSongIDs.map(songID => getSong(songID)))
        if (trendingSongs) {
            return res.json({
                data: trendingSongs
            });    
        } else {
            return null;
        }
    });
});

app.get('/queue', async (req, res) => {
    redisClient.lrange("queue:1000", 0, -1, async (err, queueIDs) => {
        const queue = await Promise.all(queueIDs.map(songID => getSong(songID)));
        if (queue) {
            return res.json({
                data: queue
            });    
        } else {
            return null;
        }
    });
});

app.get('/nowPlaying', async (req, res) => {
    redisClient.hget("user:1000", "nowPlaying", async (err, nowPlayingID) => {
        if (nowPlayingID) {
            return res.json({
                data: nowPlayingID
            });    
        } else {
            return null;
        } 
    });
});




// app.get('/', async (req, res, next) => {
//     const _songs = await client.db("MUSICDB").collection("songs").find();
//     const songs = await _songs.toArray();

//     let trending;
//     redisClient.zrevrange("trending", 0, 9, async (err, res) => {
//         trending = await Promise.all(res.map(songID => getSong(songID)));
//         console.log('trending');
//         // res.render('trending', {trending});
//     });

//     // TODO: update user id
//     let queue;
//     redisClient.lrange("queue:1000", 0, -1, async (err, res) => {
//         queue = await Promise.all(res.map(songID => getSong(songID)));
//         console.log('queue');
//     });

//     let nowPlaying;
//     redisClient.hget("user:1000", "nowPlaying", async (err, res) => {
//         console.log('res');
//         // if (res) {
//         //     nowPlaying = await Promise.all(res.map(songID => getSong(songID)));
//         // }
//         // render();
//     });

//     // const render = () => {
//     //     res.render('home', {songs, trending, queue});
//     // };
// });

app.get('/song/:_id', async (req, res) => {
    const _id = req.params._id;
    const song = await client.db("MUSICDB").collection("songs").findOne({ _id: new ObjectId(_id) });
    if (song) {
        // console.log(song);
        return song;
    } else {
        console.log('No song found with id: ' + id);
        return null;
    }
});

const getSong = async (id) => {
    const song = await client.db("MUSICDB").collection("songs").findOne({ _id: new ObjectId(id) });
    if (song) {
        // console.log(song);
        return song;
    } else {
        console.log('No song found with id: ' + id);
        return null;
    }
};

app.get('/play/:_id', (req, res) => {
    const _id = req.params._id;

    // HSET user:1000 password 12345
    // RPUSH mylist c

    // TODO: replace with user id
    redisClient.lpush("queue:1000", _id, (err, res) => {});
    redisClient.hset("user:1000", "nowPlaying", 0, (err, res) => {});

    redisClient.zincrby("trending", 1, _id, (err, res) => {});
    // return null;
    res.redirect('/nowPlaying');
});

app.get('/like/:_id', (req, res) => {
    const _id = req.params._id;
    redisClient.zincrby("trending", 2, _id, (err, res) => {});
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