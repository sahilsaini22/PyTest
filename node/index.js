const express = require('express')
const app = express()
const port = 3000

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://musicdbuser1:root@musicdbcluster-s6hji.azure.mongodb.net/MUSICDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    } finally {
        // await client.close();
    }
}

main().catch(console.error);

app.get('/', (req, res) => res.send('welcome to the musicdb'));

app.get('/songs', async (req, res) => {
    const songs = await client.db("MUSICDB").collection("songs").find();
    const songArray = await songs.toArray();
    res.send(songArray);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))