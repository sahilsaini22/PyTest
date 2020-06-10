const express = require('express')
const expressHandlebars = require('express-handlebars');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');
const jwt = require("./jwt.js");
const app = express();
const port = 4000;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://musicdbuser1:root@musicdbcluster-s6hji.azure.mongodb.net/MUSICDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect()
.then(_ => {
    console.log('Connected to MongoDB');
})
.catch(error => console.error(error));

const neo4j = require('neo4j-driver');

let redisClient = redis.createClient();
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method')); 
app.use(cors());

app.get('/songs', async (req, res) => {
    const _songs = await client.db("MUSICDB").collection("songs").find();
    const songs = await _songs.toArray();
    if (songs) {
        // console.log(songs);
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

app.get('/queue/:_userId', async (req, res) => {
    const _userId = req.params._userId;
    const queueListKey = "queue:" + _userId;
    redisClient.lrange(queueListKey, 0, -1, async (err, queueIDs) => {
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

app.get('/nowPlaying/:_userId', async (req, res) => {
    const _userId = req.params._userId;
    const listKey = "user:" + _userId;
    redisClient.hget(listKey, "nowPlaying", async (err, nowPlayingID) => {
        return res.json({
            data: nowPlayingID
        });
    });
});

app.get('/song/:_id', async (req, res) => {
    const _id = req.params._id;
    const song = await client.db("MUSICDB").collection("songs").findOne({ _id: new ObjectId(_id) });
    if (song) {
        return song;
    } else {
        console.log('No song found with id: ' + id);
        return null;
    }
});

app.post('/play', (req, res) => {
    const _songId = req.body._songId;
    const _userId = req.body._userId;

    const queueListKey = "queue:" + _userId;
    const userListKey = "user:" + _userId;

    redisClient.rpush(queueListKey, _songId, (err, listLength) => {
        redisClient.hset(userListKey, "nowPlaying", listLength - 1);
    });

    redisClient.zincrby("trending", 1, _songId);

    res.redirect(`/nowPlaying/${_userId}`);
});

// app.post('/playNext', (req, res) => {
//     const _songId = req.body._songId;
//     const _userId = req.body._userId;
//     const nowPlaying = req.body.nowPlaying ? parseInt(req.body.nowPlaying) : null;

//     const queueListKey = "queue:" + _userId;
//     const userListKey = "user:" + _userId;

//     // HSET user:1000 password 12345
//     // RPUSH mylist c

//     // LINSERT mylist BEFORE "World" "There"
//     // LINDEX mylist 0

//     // TODO separate play playNext playLater
//     // TODO if songid in list, add transaction, if not, insert after

//     if (nowPlaying !== null) {
//         let nowPlayingSongID;
//         redisClient.lindex(queueListKey, nowPlaying, (err, songID) => {
//             nowPlayingSongID = songID;
//             redisClient.linsert(queueListKey, "after", nowPlayingSongID, _songId, (err, res) => {});
//             redisClient.hset(userListKey, "nowPlaying", nowPlaying + 1, (err, res) => {});
//         });
//     } else {
//         redisClient.lpush(queueListKey, _songId, (err, res) => {});
//         redisClient.hset(userListKey, "nowPlaying", 0, (err, res) => {});
//     }

//     redisClient.zincrby("trending", 1, _songId, (err, res) => {});

//     res.redirect(`/nowPlaying/${_userId}`);
// });

app.post('/skip', (req, res) => {
    const _songId = req.body._songId;
    const _userId = req.body._userId;
    const nowPlaying = parseInt(req.body.nowPlaying);
    const userListKey = "user:" + _userId;

    redisClient.hset(userListKey, "nowPlaying", nowPlaying + 1, (err, res) => {});
    redisClient.zincrby("trending", -1, _songId, (err, res) => {});

    res.redirect(`/nowPlaying/${_userId}`);
});

app.post('/previous', (req, res) => {
    const _songId = req.body._songId;
    const _userId = req.body._userId;
    const nowPlaying = parseInt(req.body.nowPlaying);
    const userListKey = "user:" + _userId;

    redisClient.hset(userListKey, "nowPlaying", nowPlaying - 1, (err, res) => {});

    res.redirect(`/nowPlaying/${_userId}`);
});

app.get('/like/:_id', (req, res) => {
    const _id = req.params._id;
    redisClient.zincrby("trending", 2, _id, (err, res) => {});
    res.redirect('/');
});

app.post('/register', async (req, res) => {
    const registerData = req.body;
    bcrypt.hash(registerData.password, saltRounds, async function (err, hash) {
        const resultUser = await client.db("MUSICDB").collection("users").insertOne({
            username: registerData.username,
            password: hash,
            role: registerData.role,
            country: registerData.country
        });
        console.log(`New user created with the following id: ${resultUser.insertedId}`);
        const resultUserObject = resultUser.ops[0];
        return res.json({
            data: {
                _id: resultUser.insertedId,
                username: resultUserObject.username,
                role: resultUserObject.role,
                country: resultUserObject.country    
            }
        });
    });
});

app.post('/login', async (req, res) => {
    const userData = await client.db("MUSICDB").collection("users").findOne({ username: req.body.username });
    if (userData) {
        bcrypt.compare(req.body.password, userData.password, function(err, result) {
            if (result === true) {
                const payload = {
                    _id: userData._id,
                    username: userData.username,
                    role: userData.role,
                    country: userData.country
                };
                let token = jwt.sign(payload);
                console.log(token);
                return res.json({ result: "success", token, payload, message: "Login successful" });
            } else {
                // Invalid password
                return res.json({ result: "error", message: "Invalid password" });
            }
        });
    } else {
        // Invalid username
        return res.json({ result: "error", message: "Invalid username" });
    }          
});

app.post('/currentUser', (req, res) => {
    const token = req.body.token;
    const decoded = jwt.decode(token);
    const userData = decoded.payload;
    return res.json({
        data: userData
    });
});

// NEO

app.post('/neoUserAdd', async (req, res) => {
    try {
        const { username, role, country } = req.body;                                 
        if (role === 'user') {
            const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j','root'));
            const session = driver.session();            
            session.run('MERGE (u:User {name: $temp1}) MERGE (c:Country {name: $temp2}) MERGE (u)-[:LIVES_IN]->(c)', {temp1: username, temp2: country})
            .then(() => {
                session.close();
                return res.json({ result: "success", message: "Neo4j user created" });
            })
            .catch((e) => {
                return res.json({ result: "error", message: e.message });
            });
        }
    } catch (e) {
        return res.json({ result: "error", message: e.message });
    }
});


    // //const driver2 = neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j','root'));
    // //const session2 = driver2.session();
    // app.post('/neogenreadd', async (req, res) => {
    //     try{        
    //         const { username, genres } = req.body;    
    //         if(genres){
    //             const driver = neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j','root'));
    //             const session = driver.session();                                
    //             session.run('MERGE (u:User {name: $temp3}) WITH u UNWIND $temp4 AS genre MERGE (g:Genres {genre: genre})MERGE (u)-[:LIKES]->(g)', {temp3: username, temp4: genres}
    //             )
    //             .then(() => session.close());
    //         }
            
    //         console.log(username)
    //         console.log(genres)
    //         res.status(200).json({               
                
    //           }); 
    //     } catch (e) {
    //         res.status(400).json({ error: e.message });
    //       }
    
    //     } );


// FUNCTIONS

const getSong = async (id) => {
    const song = await client.db("MUSICDB").collection("songs").findOne({ _id: new ObjectId(id) });
    if (song) {
        return song;
    } else {
        console.log('No song found with id: ' + id);
        return null;
    }
};


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
