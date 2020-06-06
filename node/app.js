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

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

app.get('/', async (req, res, next) => {
    const _songs = await client.db("MUSICDB").collection("songs").find();
    const songs = await _songs.toArray();
    res.render('home', {songs});
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