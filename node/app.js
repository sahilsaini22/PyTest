const express = require('express')
const expressHandlebars = require('express-handlebars');
const cors = require('cors');
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
const trendingSongsKey = "trendingSongs"
const trendingArtistsKey = "trendingArtists"

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
        return res.json({
            data: songs
        });
    } else {
        return null;
    }
});

app.get('/searchSongs/:query', async (req, res) => {
    const query = req.params.query;
    const regexp = new RegExp(query,"i");
    const _searchResults = await client.db("MUSICDB").collection("songs").find({Song: regexp});
    const searchResults = await _searchResults.toArray();
    if (searchResults) {
        return res.json({
            data: searchResults
        });
    } else {
        return res.json({
            data: []
        });
    }
});

app.get('/songArtist/:song', async (req, res) => {
    const song = req.params.song;
    try {        
        let artists = [];                
        const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j','root'));
        const session = driver.session();        
        session.run('MATCH (s:Songs {name : $temp1}) -[x:CREATED_BY]-(a:Artists) RETURN a.a_name', {temp1: song})
        .then(function (result) {                                     
            result.records.forEach(function(record) {                                  
                artists.push(record._fields[0]);                        
            });      
            console.log('song: ' + song);
            console.log('artists: ' + artists);
            session.close();
            res.status(200).json({data: artists});
        })
        .catch((err) => {
            res.status(500).json({ message: err })
        })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
});

app.get('/artistSongs/:artistName', async (req, res) => {
    const artistName = req.params.artistName;
    try {        
        let songs = [];                
        const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j','root'));
        const session = driver.session();        
        session.run('MATCH (s:Songs) -[:CREATED_BY]->(a:Artists) WHERE toLower(a.a_name) = toLower($temp1) RETURN s.name', {temp1: artistName})
        .then(async (result) => {                                     
            result.records.forEach(function(record) {                                  
                songs.push(record._fields[0]);                        
            });      
            console.log('artist: ' + artistName + ', songs: ' + songs );
            session.close();
            const songsAsObject = await Promise.all(songs.map(songTitle => getSongFromTitle(songTitle)))
            res.status(200).json({data: songsAsObject});
        })
        .catch((err) => {
            res.status(500).json({ message: err })
        })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
});

app.get('/users', async (req, res) => {
    const _users = await client.db("MUSICDB").collection("users").find({ role: "user" });
    const users = await _users.toArray();
    if (users) {
        // console.log(songs);
        return res.json({
            data: users
        });
    } else {
        return null;
    }
});

app.get('/trendingSongs', async (req, res) => {
    redisClient.zrevrange(trendingSongsKey, 0, 9, async (err, trendingSongIDs) => {
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

app.get('/trendingArtists', async (req, res) => {
    redisClient.zrevrange(trendingArtistsKey, 0, 9, async (err, trendingArtists) => {
        if (trendingArtists) {
            return res.json({
                data: trendingArtists
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

    redisClient.zincrby(trendingSongsKey, 1, _songId);

    res.redirect(`/nowPlaying/${_userId}`);
});

app.post('/incrementArtistScore', (req, res) => {
    const artist = req.body.artist;
    const scoreIncrement = req.body.scoreIncrement;

    redisClient.zincrby(trendingArtistsKey, scoreIncrement, artist, (err, newScore) => {
        if (newScore !== null) {
            res.status(200).json({data: newScore});
        } else {
            res.status(500).json({ message: err })
        }
    });
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
    redisClient.zincrby(trendingSongsKey, -1, _songId, (err, res) => {});

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

app.post('/likedSongs', async (req, res) => {
    try {        
        let likedSongs = [];                
        const { username } = req.body;    
        if (username) {
            const driver = neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j','root'));
            const session = driver.session();                                                
            await session.run('MATCH (u:User {name : $temp1}) -[:LIKES]-(s:Songs)RETURN s.name AS liked', {temp1: username})
            .then(function (result) {                                     
                result.records.forEach(function(record){                                  
                    likedSongs.push(record._fields[0]);                        
                });      
                session.close();
                res.status(200).json({data: likedSongs});
            })          
        } else {
            res.status(500).json({ message: "No username provided" })
        }
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
});  

app.get('/like/:_id', (req, res) => {
    const _id = req.params._id;
    redisClient.zincrby(trendingSongsKey, 2, _id, (err, result) => {
        if (result !== null) {
            res.status(200).json({ message: result })
        } else {
            res.status(500).json({ message: err })
        }
    });
});

app.get('/removeLike/:_id', (req, res) => {
    const _id = req.params._id;
    redisClient.zincrby(trendingSongsKey, -2, _id, (err, result) => {
        if (result !== null) {
            res.status(200).json({ message: result })
        } else {
            res.status(500).json({ message: err })
        }
    });
});

app.post('/likeSong', (req, res) => {
    try {                        
        const { username, song } = req.body;    
        if (username && song) {
            const driver = neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j','root'));
            const session = driver.session();                                                
            session.run('MATCH (u:User) WHERE u.name=$temp1 MATCH (s:Songs) WHERE s.name=$temp2 MERGE (u)-[:LIKES]->(s)', {temp1: username, temp2: song})
            .then(function () {                                    
                session.close();    
                res.status(200).json({ message: "Neo4j like song success" });
            })
            .catch((err) => {
                res.status(500).json({ message: err })
            })
        } else {
            res.status(500).json({ message: "No username and song provided" })
        }
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
});

app.post('/removeLikeSong', (req, res) => {
    try {                        
        const { username, song } = req.body;    
        if (username && song) {
            const driver = neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j','root'));
            const session = driver.session();                                                
            session.run('MATCH ( n{ name: $temp1 })-[r:LIKES]->(s {name:$temp2})DELETE r', {temp1: username, temp2: song})
            .then(function () {                                    
                session.close();    
                res.status(200).json({ message: "Neo4j unlike song success" });
            })
            .catch((err) => {
                res.status(500).json({ message: err })
            })
        } else {
            res.status(500).json({ message: "No username and song provided" })
        }
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
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

        const payload = {
            _id: resultUser.insertedId,
            username: resultUserObject.username,
            role: resultUserObject.role,
            country: resultUserObject.country    
        };
        const token = jwt.sign(payload);
        return res.json({
            data: payload,
            token
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
            const neoDriver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j','root'));
            const neoSession = neoDriver.session();                                
            neoSession.run('MERGE (u:User {name: $temp1}) MERGE (c:Country {name: $temp2}) MERGE (u)-[:LIVES_IN]->(c)', {temp1: username, temp2: country})
            .then(() => {
                neoSession.close();
                return res.json({ result: "success", message: "Neo4j user created" });
            })
            .catch((e) => {
                return res.json({ result: "error", message: e.message });
            });
        } else {
            return res.json({ result: "error", message: "Neo4j user not created: role not user" });
        }
    } catch (e) {
        return res.json({ result: "error", message: e.message });
    }
});

app.post('/neoGenreAdd', async (req, res) => {
    try {        
        const { username, likedGenres } = req.body;    
        const neoDriver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j','root'));
        const neoSession = neoDriver.session();                                
        neoSession.run('MERGE (u:User {name: $temp3}) WITH u UNWIND $temp4 AS genre MERGE (g:Genres {genre: genre})MERGE (u)-[:PREFERS]->(g)', {temp3: username, temp4: likedGenres})
        .then(() => {
            console.log('node: Neo4j user-genre relationship added');
            neoSession.close();
            return res.json({ result: "success", message: "Neo4j user-genre relationship added" });
        })
        .catch((e) => {
            return res.json({ result: "error", message: e.message });
        });
    } catch (e) {
        return res.json({ result: "error", message: e.message });
    }
});

//List of followed users
app.post('/followedUsers', async (req, res) => {
    try {        
        let followedUsers = [];                
        const { username } = req.body;   
        if (username) {
            const driver = neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j','root'));
            const session = driver.session();                                                
            await session.run('MATCH (u:User {name : $temp1}) -[:FOLLOWS]->(a:User)RETURN a.name AS followed', {temp1: username})
            .then(function (result) {                                     
                result.records.forEach(function(record){   
                    console.log(record._fields[0]);                                                                       
                    followedUsers.push(record._fields[0]);                        
                });      
                console.log(followedUsers)
                session.close();
                return res.json({ result: "success", data: followedUsers, message: "Neo4j followed users fetched" });
            })          
            .catch((e) => {
                return res.json({ result: "error", message: e.message });
            });        
        }
    }
    catch (e) {
        return res.json({ result: "error", message: e.message });
    }
});   


app.post('/followUser', async (req, res) => {
    try {                        
        const { username, followedUser } = req.body;    
        if (username && followedUser) {
            const driver = neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j','root'));
            const session = driver.session();                                                
            session.run('MATCH(n:User) WHERE n.name= $temp1 MATCH(m:User) WHERE m.name= $temp2 MERGE (n)-[f:FOLLOWS]->(m)', {temp1: username, temp2: followedUser})
            .then(() => {
                console.log('node: Neo4j user followed');
                session.close(); 
                return res.json({ result: "success", message: "Neo4j user followed" });
            })
            .catch((e) => {
                return res.json({ result: "error", message: e.message });
            });
        }
    } catch (e) {
        return res.json({ result: "error", message: e.message });
    }
});  

app.post('/removeFollowUser', async (req, res) => {
    try {                        
        const { username, unfollowedUser } = req.body;    
        if (username && unfollowedUser) {
            const driver = neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j','root'));
            const session = driver.session();                                                
            session.run('MATCH ( n{ name: $temp1 })-[f:FOLLOWS]->(s {name:$temp2}) DELETE f', {temp1: username, temp2: unfollowedUser})
            .then(() => {
                console.log('node: Neo4j user unfollowed');
                session.close(); 
                return res.json({ result: "success", message: "Neo4j user unfollowed" });
            })
            .catch((e) => {
                return res.json({ result: "error", message: e.message });
            });
        }
    } catch (e) {
        return res.json({ result: "error", message: e.message });
    }
});  

// Songs liked by users followed by the user
app.post('/neoFollowedLikesSongs', async (req, res) => {
    try {            
        let recomm = [];
        const { username } = req.body;    
        if (username) {
            const driver = neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j','root'));
            const session = driver.session();                                
            session.run('MATCH (u:User {name : $temp1}) -[:FOLLOWS]->(a:User)-[r:LIKES]->(t:Songs) return t.name AS Recommendation,COUNT(r) ORDER BY COUNT(r) DESC', {temp1: username})
            .then(function (result) {                
                result.records.forEach(function(record) {
                    recomm.push(record._fields[0]);  
                    console.log(record._fields[0]) ;                 
                });
                res.status(200).json({data: recomm});
                session.close();
            })          
            .catch((err) => {
                res.status(500).json({ message: err })
            })
        } else {
            res.status(200).json({ data: null })
        }
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
});

// DISCOVERY

//Songs of artist liked by user
app.post('/discovery/artistSongs', async (req, res) => {
    try {            
        var songs = [];
        var allsongs = [];
        var eliminate = [];
        const { username } = req.body;    
        
        if (username) {                
            const driver = neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j','root'));
            const session = driver.session();   
                                               
            await session.run('MATCH (u:User {name : $temp1}) -[:LIKES]-(s:Songs)-[r:CREATED_BY]->(a:Artists)-[x:CREATED_BY]-(y:Songs)RETURN y.name AS Allsongs ,COUNT(r) ORDER BY COUNT(r) DESC', {temp1: username})
            .then(function (result) {    
                result.records.forEach(function(record){   
                    allsongs.push(record._fields[0]);                        
                });                                
                console.log("All songs: " + allsongs);            
            }) 
            .catch((err) => {
                res.status(500).json({ message: err })
            })
            
            await session.run('MATCH (u:User {name : $temp1}) -[:LIKES]-(s:Songs)RETURN s.name AS Eliminate', {temp1: username})                            
            .then(function (result) {                
                result.records.forEach(function(record){  
                    eliminate.push(record._fields[0]);
                });
                songs = allsongs.filter(element => !eliminate.includes(element) );
                if (songs.length > 10) {
                    songs.splice(10);
                }
                session.close();    
                res.status(200).json({data: songs});
            })       
            .catch((err) => {
                res.status(500).json({ message: err })
            })
        } else {
            res.status(200).json({ data: null })
        }
    }
    catch (err) {
        res.status(500).json({ message: err })
    }            
});

// Top 10 liked songs from the user's country
app.post('/discovery/topSongsCountry', async (req, res) => {
    try {            
        let songs = [];
        let allsongs = [];
        let eliminate = []
        const { username } = req.body;    
        
        if (username) {                
            const driver = neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j','root'));
            const session = driver.session();   
                                               
            await session.run('MATCH (u:User {name : $temp1 })-[:LIVES_IN]-(c:Country) -[:LIVES_IN]-(a:User)-[r:LIKES]->(t:Songs)RETURN t.name as RES,count(r) order by count(r) desc limit 10', {temp1: username})
            .then(function (result) {    
                console.log("(topSongsCountry) All songs:");            
                result.records.forEach(function(record) {   
                    console.log(record._fields[0]);                                                                       
                    allsongs.push(record._fields[0]);                        
                });                                
            }) 
            .catch((err) => {
                res.status(500).json({ message: err })
            })
            
            await session.run('MATCH (u:User {name : $temp1}) -[:LIKES]-(s:Songs)return s.name as Eliminate', {temp1: username})                            
            .then(function (result) {                
                console.log("(topSongsCountry) Exclude:");
                result.records.forEach(function(record) {  
                    eliminate.push(record._fields[0]);
                    console.log(record._fields[0]);
                });
                songs = allsongs.filter(element => !eliminate.includes(element) );
                if (songs.length > 10) {
                    songs.splice(10);
                }
                console.log("(topSongsCountry) RESULT:")
                songs.forEach(function(element) {  
                    console.log(element);
                });
                if (songs) {
                    res.status(200).json({data: songs});
                } else {
                    res.status(200).json({ data: null });
                }
                session.close();    
            })                 
            .catch((err) => {
                res.status(500).json({ message: err })
            })
        }
    }
    catch (err) {
        res.status(500).json({ message: err });
    }    
});

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

const getSongFromTitle = async (songTitle) => {
    const song = await client.db("MUSICDB").collection("songs").findOne({ Song: songTitle });
    if (song) {
        return song;
    } else {
        console.log('No song found with title: ' + songTitle);
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
